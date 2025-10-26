package br.ufal.ic.odontolog.services;

import static org.springframework.http.HttpStatus.NOT_FOUND;

import br.ufal.ic.odontolog.config.S3Properties;
import br.ufal.ic.odontolog.dtos.AppointmentDTO;
import br.ufal.ic.odontolog.dtos.AttachmentDTO;
import br.ufal.ic.odontolog.dtos.CreateAttachmentRequestDTO;
import br.ufal.ic.odontolog.dtos.PatientAndTreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.PatientDTO;
import br.ufal.ic.odontolog.dtos.UploadAttachmentInitResponseDTO;
import br.ufal.ic.odontolog.exceptions.ResourceNotFoundException;
import br.ufal.ic.odontolog.exceptions.UnprocessableRequestException;
import br.ufal.ic.odontolog.mappers.AttachmentMapper;
import br.ufal.ic.odontolog.mappers.PatientMapper;
import br.ufal.ic.odontolog.models.Attachment;
import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import br.ufal.ic.odontolog.models.User;
import br.ufal.ic.odontolog.repositories.AttachmentRepository;
import br.ufal.ic.odontolog.repositories.PatientRepository;
import br.ufal.ic.odontolog.utils.CurrentUserProvider;
import io.awspring.cloud.s3.S3Template;
import lombok.RequiredArgsConstructor;

import java.net.URL;
import java.time.Duration;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class PatientService {

  private final PatientRepository patientRepository;
  private final AttachmentRepository attachmentRepository;
  private final PatientMapper patientMapper;
  private final S3Template s3Template;
  private final S3Properties s3Properties;
  private final CurrentUserProvider currentUserProvider;
  private final AttachmentMapper attachmentMapper;

  public List<PatientDTO> getPatients() {
    List<Patient> patients = patientRepository.findAll();
    return patientMapper.toDTOList(patients);
  }

  public PatientDTO getPatientById(Long id) {
    Patient patient = patientRepository
        .findById(id)
        .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Patient not found"));
    return patientMapper.toDTO(patient);
  }

  public List<PatientAndTreatmentPlanDTO> searchForPatients(Optional<String> searchTerm) {
    List<Patient> patients = patientRepository
        .searchPatients(searchTerm.orElse(null), PageRequest.of(0, 10))
        .getContent();

    if (patients.isEmpty()) {
      return Collections.emptyList();
    }

    List<Long> patientIds = patients.stream().map(Patient::getId).toList();

    List<TreatmentPlan> lastPlans = patientRepository.findLastTreatmentPlans(patientIds);

    Map<Long, TreatmentPlan> lastPlanByPatientId = lastPlans.stream()
        .collect(Collectors.toMap(tp -> tp.getPatient().getId(), Function.identity()));

    return patients.stream()
        .map(
            p -> {
              TreatmentPlan plan = lastPlanByPatientId.get(p.getId());
              return PatientAndTreatmentPlanDTO.builder()
                  .id(p.getId())
                  .name(p.getName())
                  .avatarUrl(p.getAvatarUrl())
                  .lastTreatmentPlanId(plan != null ? plan.getId() : null)
                  .lastTreatmentPlanStatus(plan != null ? plan.getStatus() : null)
                  .lastTreatmentPlanUpdatedAt(plan != null ? plan.getUpdatedAt() : null)
                  .build();
            })
        .toList();
  }

  public AppointmentDTO getNextAppointment(Long id) {
    Patient patient = patientRepository
        .findById(id)
        .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Patient not found"));

    AppointmentDTO appointmentDTO = new AppointmentDTO();
    appointmentDTO.setAppointmentDate(patient.getAppointmentDate());
    return appointmentDTO;
  }

  @Transactional
  public AppointmentDTO updateNextAppointment(Long id, AppointmentDTO dto) {
    Patient patient = patientRepository
        .findById(id)
        .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Patient not found"));

    patient.setAppointmentDate(dto.getAppointmentDate());

    var newAppointmentDTO = new AppointmentDTO();
    newAppointmentDTO.setAppointmentDate(patient.getAppointmentDate());

    return newAppointmentDTO;
  }

  public UploadAttachmentInitResponseDTO initUploadAttachment(Long patientId) {
    Patient patient = patientRepository
        .findById(patientId)
        .orElseThrow(() -> new UnprocessableRequestException("Patient not found"));

    String attachmentId = UUID.randomUUID().toString();

    String objectKey = String.format("patients/%d/attachments/%s", patient.getId(), attachmentId);
    String privateBucket = s3Properties.getBuckets().getPrivateBucket();
    Duration timeout = s3Properties.getSignedUrlTimeout();

    URL s3Url = s3Template.createSignedPutURL(privateBucket, objectKey, timeout);

    var dto = new UploadAttachmentInitResponseDTO();
    dto.setObjectKey(objectKey);
    dto.setUploadUrl(s3Url);

    return dto;
  }

  @Transactional
  public AttachmentDTO createAttachment(Long id, CreateAttachmentRequestDTO request) {
    User currentUser = currentUserProvider.getCurrentUser();

    Patient patient = patientRepository
        .findById(id)
        .orElseThrow(() -> new UnprocessableRequestException("Patient not found"));

    var objectExists = s3Template.objectExists(
        s3Properties.getBuckets().getPrivateBucket(),
        request.getObjectKey());

    if (!objectExists) {
      throw new UnprocessableRequestException("Attachment file not found in storage");
    }

    String location = String.format("s3://%s/%s",
        s3Properties.getBuckets().getPrivateBucket(),
        request.getObjectKey());

    Attachment attachment = new Attachment();
    attachment.setFilename(request.getFilename());
    attachment.setFiletype(request.getFiletype());
    attachment.setLocation(location);
    attachment.setObjectKey(request.getObjectKey());
    attachment.setSize(request.getSize());
    attachment.setUploader(currentUser);

    patient.addAttachment(attachment);
    attachmentRepository.save(attachment);

    return attachmentMapper.toDTO(attachment);
  }

  public AttachmentDTO getAttachmentById(Long patientId, Long attachmentId) {
    Patient patient = patientRepository
        .findById(patientId)
        .orElseThrow(() -> new UnprocessableRequestException("Patient not found"));

    var attachment = attachmentRepository.findByIdAndPatient(attachmentId, patient)
        .orElseThrow(() -> new ResourceNotFoundException("Attachment not found"));

    URL presignedUrl = s3Template.createSignedGetURL(
        s3Properties.getBuckets().getPrivateBucket(),
        attachment.getObjectKey(),
        s3Properties.getSignedUrlTimeout());

    AttachmentDTO attachmentDTO = attachmentMapper.toDTO(attachment);
    attachmentDTO.setPresignedUrl(presignedUrl);

    return attachmentDTO;
  }

  public List<AttachmentDTO> getAttachmentsByPatientId(Long patientId) {
    Patient patient = patientRepository
        .findById(patientId)
        .orElseThrow(() -> new UnprocessableRequestException("Patient not found"));

    List<Attachment> attachments = attachmentRepository.findAllByPatient(patient);
    List<AttachmentDTO> attachmentDTOs = attachmentMapper.toDTOs(attachments);

    attachmentDTOs.forEach(attachmentDTO -> {
      URL presignedUrl = s3Template.createSignedGetURL(
          s3Properties.getBuckets().getPrivateBucket(),
          attachmentDTO.getObjectKey(),
          s3Properties.getSignedUrlTimeout());

      attachmentDTO.setPresignedUrl(presignedUrl);
    });

    return attachmentDTOs;
  }
}

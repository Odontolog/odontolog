package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.dtos.AppointmentDTO;
import br.ufal.ic.odontolog.dtos.AttachmentDTO;
import br.ufal.ic.odontolog.dtos.CreateAttachmentRequestDTO;
import br.ufal.ic.odontolog.dtos.PatientAndTreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.PatientDTO;
import br.ufal.ic.odontolog.dtos.UploadAttachmentInitResponseDTO;
import br.ufal.ic.odontolog.services.PatientService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@PreAuthorize("isAuthenticated()")
@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {
  private final PatientService patientService;

  @GetMapping
  public ResponseEntity<List<PatientDTO>> getAllPatients() {
    return ResponseEntity.ok(patientService.getPatients());
  }

  @GetMapping("/search")
  public ResponseEntity<List<PatientAndTreatmentPlanDTO>> searchPatient(
      @RequestParam(name = "term") Optional<String> searchTerm) {
    return ResponseEntity.ok(patientService.searchForPatients(searchTerm));
  }

  @GetMapping("/{id}")
  public ResponseEntity<PatientDTO> getPatientById(@PathVariable Long id) {
    return ResponseEntity.ok(patientService.getPatientById(id));
  }

  @GetMapping("/{id}/next-appointment")
  public ResponseEntity<AppointmentDTO> getNextAppointment(@PathVariable Long id) {
    AppointmentDTO appointmentDTO = patientService.getNextAppointment(id);
    return ResponseEntity.ok(appointmentDTO);
  }

  @PutMapping("/{id}/next-appointment")
  @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
  public ResponseEntity<AppointmentDTO> updateNextAppointment(
      @PathVariable Long id, @RequestBody @Valid AppointmentDTO appointmentDTO) {

    var nextAppointmentDTO = patientService.updateNextAppointment(id, appointmentDTO);
    return ResponseEntity.ok(nextAppointmentDTO);
  }

  @PostMapping("/{id}/attachments/init-upload")
  public ResponseEntity<UploadAttachmentInitResponseDTO> initUploadAttachment(
      @PathVariable Long id) {
    var response = patientService.initUploadAttachment(id);

    return ResponseEntity.ok().body(response);
  }

  @PostMapping("/{id}/attachments")
  public ResponseEntity<AttachmentDTO> createAttachment(
      @PathVariable Long id, @Valid @RequestBody CreateAttachmentRequestDTO request) {
    var createdAttachment = patientService.createAttachment(id, request);

    return ResponseEntity.ok().body(createdAttachment);
  }

  @GetMapping("/{patientId}/attachments/{attachmentId}")
  public ResponseEntity<AttachmentDTO> getAttachmentByPatientAndId(
      @PathVariable Long patientId, @PathVariable Long attachmentId) {
    var attachment = patientService.getAttachmentById(patientId, attachmentId);

    return ResponseEntity.ok(attachment);
  }

  @GetMapping("/{patientId}/attachments")
  public ResponseEntity<List<AttachmentDTO>> getAttachments(@PathVariable Long patientId) {
    var attachments = patientService.getAttachmentsByPatientId(patientId);
    return ResponseEntity.ok(attachments);
  }
}

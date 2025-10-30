package br.ufal.ic.odontolog.services;

import br.ufal.ic.odontolog.config.S3Properties;
import br.ufal.ic.odontolog.dtos.ProcedureDTO;
import br.ufal.ic.odontolog.dtos.ProcedureShortDTO;
import br.ufal.ic.odontolog.enums.ActivityType;
import br.ufal.ic.odontolog.enums.ProcedureStatus;
import br.ufal.ic.odontolog.exceptions.ResourceNotFoundException;
import br.ufal.ic.odontolog.mappers.ProcedureMapper;
import br.ufal.ic.odontolog.models.*;
import br.ufal.ic.odontolog.repositories.ProcedureRepository;
import br.ufal.ic.odontolog.utils.CurrentUserProvider;
import io.awspring.cloud.s3.S3Template;
import java.net.URL;
import java.time.Instant;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProcedureService {
  private final ProcedureRepository procedureRepository;
  private final ProcedureMapper procedureMapper;
  private final CurrentUserProvider currentUserProvider;
  private final S3Template s3Template;
  private final S3Properties s3Properties;

  @Transactional(readOnly = true)
  public List<ProcedureShortDTO> getDonePatientProcedures(long patientId) {
    List<Procedure> procedures =
        procedureRepository.findAllByPatientIdAndStatus(patientId, ProcedureStatus.COMPLETED);
    return procedureMapper.toShortDTOs(procedures);
  }

  @Transactional(readOnly = true)
  public ProcedureDTO getProcedureById(Long procedureId) {
    Procedure procedure =
        procedureRepository
            .findById(procedureId)
            .orElseThrow(() -> new ResourceNotFoundException("Procedure not found"));

    ProcedureDTO procedureDTO = procedureMapper.toDTO(procedure);

    procedureDTO
        .getAttachments()
        .forEach(
            attachmentDTO -> {
              URL presignedUrl =
                  s3Template.createSignedGetURL(
                      s3Properties.getBuckets().getPrivateBucket(),
                      attachmentDTO.getObjectKey(),
                      s3Properties.getSignedUrlTimeout());

              attachmentDTO.setPresignedUrl(presignedUrl);
            });

    return procedureDTO;
  }

  @Transactional
  public ProcedureDTO startProcedure(Long procedureId) {
    Procedure procedure =
        procedureRepository
            .findById(procedureId)
            .orElseThrow(() -> new ResourceNotFoundException("Procedure not found"));

    procedure.startProcedure();
    procedure.setPerformedAt(Instant.now());

    User currentUser = currentUserProvider.getCurrentUser();
    Activity activity =
        Activity.builder()
            .actor(currentUser)
            .type(ActivityType.EDITED)
            .description(
                String.format(
                    "Procedimento %s #%s iniciado por %s (%s)",
                    procedure.getName(),
                    procedure.getId(),
                    currentUser.getName(),
                    currentUser.getEmail()))
            .reviewable(procedure)
            .build();
    procedure.getHistory().add(activity);

    procedureRepository.save(procedure);
    return procedureMapper.toDTO(procedure);
  }

  @Transactional
  public ProcedureDTO updateTeeth(Long procedureId, Set<String> teeth) {
    Procedure procedure =
        procedureRepository
            .findById(procedureId)
            .orElseThrow(() -> new ResourceNotFoundException("Procedure not found"));

    Set<String> oldTeeth = new HashSet<>(procedure.getTeeth());
    procedure.setTeeth(teeth);

    HashMap<String, Object> metadata = new HashMap<>();
    metadata.put("data", String.join(", ", teeth));
    metadata.put("oldData", String.join(", ", oldTeeth));

    User currentUser = currentUserProvider.getCurrentUser();
    Activity activity =
        Activity.builder()
            .actor(currentUser)
            .type(ActivityType.EDITED)
            .description(
                String.format(
                    "Dentes/regiões atualizados por %s (%s)",
                    currentUser.getName(), currentUser.getEmail()))
            .reviewable(procedure)
            .metadata(metadata)
            .build();
    procedure.getHistory().add(activity);

    procedureRepository.save(procedure);
    return procedureMapper.toDTO(procedure);
  }

  @Transactional
  public ProcedureDTO updateStudySector(Long procedureId, String studySector) {
    Procedure procedure =
        procedureRepository
            .findById(procedureId)
            .orElseThrow(() -> new ResourceNotFoundException("Procedure not found"));

    String oldStudySector =
        new String(procedure.getStudySector() != null ? procedure.getStudySector() : "");
    procedure.setStudySector(studySector);

    HashMap<String, Object> metadata = new HashMap<>();
    metadata.put("data", studySector);
    metadata.put("oldData", oldStudySector);

    User currentUser = currentUserProvider.getCurrentUser();
    Activity activity =
        Activity.builder()
            .actor(currentUser)
            .type(ActivityType.EDITED)
            .description(
                String.format(
                    "Seção de estudo atualizada por %s (%s)",
                    currentUser.getName(), currentUser.getEmail()))
            .reviewable(procedure)
            .metadata(metadata)
            .build();
    procedure.getHistory().add(activity);

    procedureRepository.save(procedure);
    return procedureMapper.toDTO(procedure);
  }

  @Transactional
  public ProcedureDTO updateDiagnostic(Long procedureId, String diagnostic) {
    Procedure procedure =
        procedureRepository
            .findById(procedureId)
            .orElseThrow(() -> new ResourceNotFoundException("Procedure not found"));

    String oldDiagnostic = new String(procedure.getProcedureDetail().getDiagnostic());
    procedure.setProcedureDetail(new ProcedureDetail(diagnostic));

    HashMap<String, Object> metadata = new HashMap<>();
    metadata.put("data", diagnostic);
    metadata.put("oldData", oldDiagnostic);

    User currentUser = currentUserProvider.getCurrentUser();
    Activity activity =
        Activity.builder()
            .actor(currentUser)
            .type(ActivityType.EDITED)
            .description(
                String.format(
                    "Diagnóstico atualizado por %s (%s)",
                    currentUser.getName(), currentUser.getEmail()))
            .reviewable(procedure)
            .metadata(metadata)
            .build();
    procedure.getHistory().add(activity);

    procedureRepository.save(procedure);
    return procedureMapper.toDTO(procedure);
  }
}

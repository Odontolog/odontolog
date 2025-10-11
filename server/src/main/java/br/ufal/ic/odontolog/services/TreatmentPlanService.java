package br.ufal.ic.odontolog.services;

import br.ufal.ic.odontolog.dtos.CreateTreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.ProcedureUpsertDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanShortDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanSubmitForReviewDTO;
import br.ufal.ic.odontolog.enums.ActivityType;
import br.ufal.ic.odontolog.enums.ProcedureStatus;
import br.ufal.ic.odontolog.enums.ReviewableType;
import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import br.ufal.ic.odontolog.exceptions.ResourceNotFoundException;
import br.ufal.ic.odontolog.mappers.TreatmentPlanMapper;
import br.ufal.ic.odontolog.models.Activity;
import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import br.ufal.ic.odontolog.models.TreatmentPlanProcedure;
import br.ufal.ic.odontolog.models.User;
import br.ufal.ic.odontolog.repositories.*;
import br.ufal.ic.odontolog.utils.CurrentUserProvider;
import java.util.HashMap;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TreatmentPlanService {

  private final TreatmentPlanRepository treatmentPlanRepository;
  private final TreatmentPlanMapper treatmentPlanMapper;
  private final PatientRepository patientRepository;
  private final CurrentUserProvider currentUserProvider;
  private final TreatmentPlanProcedureRepository treatmentPlanProcedureRepository;
  private final ReviewableRepository reviewableRepository;
  private final ActivityRepository activityRepository;

  @Transactional
  public TreatmentPlanDTO createTreatmentPlan(CreateTreatmentPlanDTO request) {
    User currentUser = currentUserProvider.getCurrentUser();

    Patient patient =
        patientRepository
            .findById(request.getPatientId())
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

    TreatmentPlan plan =
        TreatmentPlan.builder()
            .author(currentUser)
            .name("Plano de Tratamento")
            .patient(patient)
            .assignee(currentUser)
            .type(ReviewableType.TREATMENT_PLAN)
            .status(TreatmentPlanStatus.DRAFT)
            .build();

    Activity activity =
        Activity.builder()
            .actor(currentUser)
            .type(ActivityType.CREATED)
            .description(
                String.format(
                    "Plano de Tratamento criado para %s por %s (%s)",
                    patient.getName(), currentUser.getName(), currentUser.getEmail()))
            .reviewable(plan)
            .build();
    plan.getHistory().add(activity);
    plan = treatmentPlanRepository.save(plan);
    return treatmentPlanMapper.toDTO(plan);
  }

  @Transactional
  public TreatmentPlanDTO getTreatmentPlanById(Long id) {
    TreatmentPlan plan =
        treatmentPlanRepository
            .findByIdWithActiveProcedures(id)
            .orElseThrow(() -> new ResourceNotFoundException("Treatment plan not found"));
    return treatmentPlanMapper.toDTO(plan);
  }

  public List<TreatmentPlanShortDTO> getTreatmentPlansByPatientId(Long patientId) {
    Patient patient =
        patientRepository
            .findById(patientId)
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
    List<TreatmentPlan> treatmentPlans = treatmentPlanRepository.findByPatient(patient);
    return treatmentPlanMapper.toShortDTOs(treatmentPlans);
  }

  @Transactional
  public TreatmentPlanDTO submitTreatmentPlanForReview(
      Long treatment_id, TreatmentPlanSubmitForReviewDTO requestDTO) {
    User currentUser = currentUserProvider.getCurrentUser();

    TreatmentPlan treatmentPlan =
        treatmentPlanRepository
            .findById(treatment_id)
            .orElseThrow(() -> new ResourceNotFoundException("Treatment Plan not found"));

    treatmentPlan.getState().submitForReview(treatmentPlan);

    String description = buildSubmissionDescription(currentUser, treatmentPlan);

    String comments = requestDTO.getComments();
    HashMap<String, Object> metadata = null;
    if (comments != null && !comments.trim().isEmpty()) {
      metadata = new HashMap<>();
      metadata.put("data", comments);
    }

    Activity activity =
        Activity.builder()
            .actor(currentUser)
            .type(ActivityType.REVIEW_REQUESTED)
            .description(description)
            .reviewable(treatmentPlan)
            .metadata(metadata)
            .build();
    treatmentPlan.getHistory().add(activity);

    treatmentPlanRepository.save(treatmentPlan);

    return treatmentPlanMapper.toDTO(treatmentPlan);
  }

  private String buildSubmissionDescription(User currentUser, TreatmentPlan treatmentPlan) {
    StringBuilder descriptionBuilder = new StringBuilder();
    descriptionBuilder.append(
        String.format(
            "%s (%s) enviou Plano de Tratamento #%s para validação",
            currentUser.getName(), currentUser.getEmail(), treatmentPlan.getId()));

    return descriptionBuilder.toString();
  }

  // Procedures CRUD within a Treatment Plan
  @Transactional
  public TreatmentPlanDTO addProcedureToTreatmentPlan(
      Long treatmentPlanId, ProcedureUpsertDTO dto) {
    User currentUser = currentUserProvider.getCurrentUser();

    TreatmentPlan treatmentPlan =
        treatmentPlanRepository
            .findById(treatmentPlanId)
            .orElseThrow(() -> new ResourceNotFoundException("Treatment Plan not found"));

    if (treatmentPlan.getStatus() != TreatmentPlanStatus.DRAFT) {
      throw new IllegalStateException(
          "Não é possível adicionar procedimentos enquanto o plano não está em rascunho (DRAFT)");
    }

    TreatmentPlanProcedure procedure =
        TreatmentPlanProcedure.builder()
            .author(currentUser)
            .assignee(currentUser)
            .type(ReviewableType.PROCEDURE)
            .status(ProcedureStatus.DRAFT)
            .name(dto.getName())
            .studySector(dto.getStudySector())
            .patient(treatmentPlan.getPatient())
            .treatmentPlan(treatmentPlan)
            .build();

    procedure.setPlannedSession(dto.getPlannedSession());
    dto.getTeeth().forEach(procedure::addTooth);

    treatmentPlan.addProcedure(procedure);

    Activity activity =
        Activity.builder()
            .actor(currentUser)
            .type(ActivityType.CREATED)
            .description(
                String.format(
                    "Procedimento #%s adicionado ao Plano de Tratamento #%s",
                    dto.getName(), treatmentPlan.getId()))
            .reviewable(treatmentPlan)
            .build();
    treatmentPlan.getHistory().add(activity);

    treatmentPlanRepository.save(treatmentPlan);

    return treatmentPlanMapper.toDTO(treatmentPlan);
  }

  @Transactional
  public TreatmentPlanDTO updateProcedureInTreatmentPlan(
      Long treatmentPlanId, Long procedureId, ProcedureUpsertDTO dto) {
    User currentUser = currentUserProvider.getCurrentUser();

    TreatmentPlanProcedure procedure =
        treatmentPlanProcedureRepository
            .findById(procedureId)
            .orElseThrow(() -> new ResourceNotFoundException("Procedure not found"));

    if (!procedure.getTreatmentPlan().getId().equals(treatmentPlanId)) {
      throw new ResourceNotFoundException("Procedure does not belong to this Treatment Plan");
    }

    TreatmentPlan treatmentPlan = procedure.getTreatmentPlan();
    if (treatmentPlan.getStatus() != TreatmentPlanStatus.DRAFT) {
      throw new IllegalStateException(
          "Não é possível editar procedimentos enquanto o plano não está em rascunho (DRAFT)");
    }

    procedure.setName(dto.getName());
    procedure.setStudySector(dto.getStudySector());
    procedure.setPlannedSession(dto.getPlannedSession());
    procedure.getTeeth().clear();
    dto.getTeeth().forEach(procedure::addTooth);

    Activity activity =
        Activity.builder()
            .actor(currentUser)
            .type(ActivityType.EDITED)
            .description(
                String.format(
                    "Procedimento #%s (%s) editado em Plano de Tratamento #%s",
                    procedure.getId(), procedure.getName(), treatmentPlanId))
            .build();

    procedure.getHistory().add(activity);

    treatmentPlanProcedureRepository.save(procedure);

    treatmentPlan.getHistory().add(activity);

    treatmentPlanRepository.save(treatmentPlan);

    return treatmentPlanMapper.toDTO(treatmentPlan);
  }

  @Transactional
  public void removeProcedureFromTreatmentPlan(Long treatmentPlanId, Long procedureId) {
    User currentUser = currentUserProvider.getCurrentUser();

    TreatmentPlan treatmentPlan =
        treatmentPlanRepository
            .findById(treatmentPlanId)
            .orElseThrow(() -> new ResourceNotFoundException("Treatment Plan not found"));

    if (treatmentPlan.getStatus() != TreatmentPlanStatus.DRAFT) {
      throw new IllegalStateException(
          "Não é possível remover procedimentos enquanto o plano não está em rascunho (DRAFT)");
    }

    TreatmentPlanProcedure procedure =
        treatmentPlan.getProcedures().stream()
            .filter(p -> p.getId().equals(procedureId))
            .findFirst()
            .orElseThrow(
                () -> new ResourceNotFoundException("Procedure not found in this Treatment Plan"));

    Activity activity =
        Activity.builder()
            .actor(currentUser)
            .type(ActivityType.EDITED)
            .description(
                String.format(
                    "Procedimento #%s removido do plano de tratamento #%s por %s (%s)",
                    procedureId, treatmentPlanId, currentUser.getName(), currentUser.getEmail()))
            .build();

    procedure.setDeleted(true);
    procedure.getHistory().add(activity);
    treatmentPlanProcedureRepository.save(procedure);

    treatmentPlan.getHistory().add(activity);
    treatmentPlanRepository.save(treatmentPlan);
  }
}

package br.ufal.ic.odontolog.services;

import br.ufal.ic.odontolog.dtos.CreateTreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanShortDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanSubmitForReviewDTO;
import br.ufal.ic.odontolog.enums.ActivityType;
import br.ufal.ic.odontolog.enums.ReviewableType;
import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import br.ufal.ic.odontolog.exceptions.ResourceNotFoundException;
import br.ufal.ic.odontolog.mappers.TreatmentPlanMapper;
import br.ufal.ic.odontolog.models.Activity;
import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import br.ufal.ic.odontolog.models.User;
import br.ufal.ic.odontolog.repositories.PatientRepository;
import br.ufal.ic.odontolog.repositories.TreatmentPlanRepository;
import br.ufal.ic.odontolog.utils.CurrentUserProvider;
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
                    "TreatmentPlan created for patient %s (%s) by user %s (%s)",
                    patient.getName(),
                    patient.getId(),
                    currentUser.getName(),
                    currentUser.getEmail()))
            .reviewable(plan)
            .build();
    plan.getHistory().add(activity);
    plan = treatmentPlanRepository.save(plan);
    return treatmentPlanMapper.toDTO(plan);
  }

  @Transactional(readOnly = true)
  public TreatmentPlanDTO getTreatmentPlanById(Long id) {
    TreatmentPlan plan =
        treatmentPlanRepository
            .findById(id)
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

    String comments = requestDTO.getComments();
    String description = buildSubmissionDescription(currentUser, treatmentPlan, comments);

    Activity activity =
        Activity.builder()
            .actor(currentUser)
            .type(ActivityType.REVIEW_REQUESTED)
            .description(description)
            .reviewable(treatmentPlan)
            .build();
    treatmentPlan.getHistory().add(activity);

    treatmentPlanRepository.save(treatmentPlan);

    return treatmentPlanMapper.toDTO(treatmentPlan);
  }

  private String buildSubmissionDescription(
      User currentUser, TreatmentPlan treatmentPlan, String comments) {

    StringBuilder descriptionBuilder = new StringBuilder();
    descriptionBuilder.append(
        String.format(
            "User %s (%s) submitted Treatment Plan (%s) for review",
            currentUser.getName(), currentUser.getId(), treatmentPlan.getId()));

    if (comments != null && !comments.trim().isEmpty()) {
      descriptionBuilder.append(", with additional comments: ").append(comments);
    } else {
      descriptionBuilder.append(" without additional comments");
    }

    return descriptionBuilder.toString();
  }
}

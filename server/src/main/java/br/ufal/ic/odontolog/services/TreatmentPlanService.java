package br.ufal.ic.odontolog.services;

import br.ufal.ic.odontolog.dtos.CreateTreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanAssignUserRequestDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanDTO;
import br.ufal.ic.odontolog.enums.ActivityType;
import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import br.ufal.ic.odontolog.exceptions.ResourceNotFoundException;
import br.ufal.ic.odontolog.exceptions.UnprocessableRequestException;
import br.ufal.ic.odontolog.mappers.TreatmentPlanMapper;
import br.ufal.ic.odontolog.models.Activity;
import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import br.ufal.ic.odontolog.models.User;
import br.ufal.ic.odontolog.repositories.PatientRepository;
import br.ufal.ic.odontolog.repositories.TreatmentPlanRepository;
import br.ufal.ic.odontolog.repositories.UserRepository;
import br.ufal.ic.odontolog.utils.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class TreatmentPlanService {

  private final TreatmentPlanRepository treatmentPlanRepository;
  private final UserRepository userRepository;
  private final TreatmentPlanMapper treatmentPlanMapper;
  private final PatientRepository patientRepository;
  private final CurrentUserProvider currentUserProvider;

  @Transactional
  public TreatmentPlanDTO createTreatmentPlan(CreateTreatmentPlanDTO request) {
    User currentUser = currentUserProvider.getCurrentUser();

    Patient patient =
        patientRepository
            .findById(request.getPatientId())
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Patient not found"));

    TreatmentPlan plan =
        TreatmentPlan.builder()
            .author(currentUser)
            .patient(patient)
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
            .orElseThrow(
                () ->
                    new ResponseStatusException(HttpStatus.NOT_FOUND, "Treatment plan not found"));

    return treatmentPlanMapper.toDTO(plan);
  }

  @Transactional
  public TreatmentPlanDTO assignUserToTreatmentPlan(
      TreatmentPlanAssignUserRequestDTO requestDTO, Long treatmentId) {
    User currentUser = currentUserProvider.getCurrentUser();

    TreatmentPlan treatmentPlan =
        treatmentPlanRepository
            .findById(treatmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Treatment Plan not found"));

    User user =
        userRepository
            .findById(requestDTO.getUserId())
            .orElseThrow(() -> new UnprocessableRequestException("Provided User not found"));

    treatmentPlan.getState().assignUser(treatmentPlan, user);

    Activity activity =
        Activity.builder()
            .actor(currentUser)
            .type(ActivityType.CREATED)
            .description(
                String.format(
                    "User %s (%s) assigned to Treatment Plan (%s) by user %s (%s)",
                    user.getName(),
                    user.getId(),
                    treatmentPlan.getId(),
                    currentUser.getName(),
                    currentUser.getEmail()))
            .reviewable(treatmentPlan)
            .build();
    treatmentPlan.getHistory().add(activity);
    treatmentPlanRepository.save(treatmentPlan);

    return treatmentPlanMapper.toDTO(treatmentPlan);
  }

  @Transactional
  public TreatmentPlanDTO submitTreatmentPlanForReview(Long treatment_id) {
    User currentUser = currentUserProvider.getCurrentUser();

    TreatmentPlan treatmentPlan =
        treatmentPlanRepository
            .findById(treatment_id)
            .orElseThrow(() -> new ResourceNotFoundException("Treatment Plan not found"));

    treatmentPlan.getState().submitForReview(treatmentPlan);

    Activity activity =
        Activity.builder()
            .actor(currentUser)
            .type(ActivityType.CREATED)
            .description(
                String.format(
                    "User %s (%s) submitted Treatment Plan (%s) for review",
                    currentUser.getName(), currentUser.getId(), treatmentPlan.getId()))
            .reviewable(treatmentPlan)
            .build();
    treatmentPlan.getHistory().add(activity);

    treatmentPlanRepository.save(treatmentPlan);

    return treatmentPlanMapper.toDTO(treatmentPlan);
  }
}

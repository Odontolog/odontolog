package br.ufal.ic.odontolog.services;

import br.ufal.ic.odontolog.dtos.CreateTreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanDTO;
import br.ufal.ic.odontolog.enums.ActivityType;
import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import br.ufal.ic.odontolog.mappers.TreatmentPlanMapper;
import br.ufal.ic.odontolog.models.Activity;
import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import br.ufal.ic.odontolog.models.User;
import br.ufal.ic.odontolog.repositories.PatientRepository;
import br.ufal.ic.odontolog.repositories.TreatmentPlanRepository;
import br.ufal.ic.odontolog.utils.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TreatmentPlanService {

  private final TreatmentPlanMapper treatmentPlanMapper;
  private final TreatmentPlanRepository treatmentPlanRepository;
  private final PatientRepository patientRepository;
  private final CurrentUserProvider currentUserProvider;

  @Transactional
  public TreatmentPlanDTO createTreatmentPlan(CreateTreatmentPlanDTO request) {
    User currentUser = currentUserProvider.getCurrentUser();

    Patient patient = patientRepository.getReferenceById(request.getPatientId());

    TreatmentPlan plan =
        TreatmentPlan.builder().patient(patient).status(TreatmentPlanStatus.DRAFT).build();

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
}

package br.ufal.ic.odontolog.services;

import br.ufal.ic.odontolog.dtos.TreatmentPlanAssignUserRequestDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanDTO;
import br.ufal.ic.odontolog.exceptions.ResourceNotFoundException;
import br.ufal.ic.odontolog.exceptions.UnprocessableRequestException;
import br.ufal.ic.odontolog.mappers.TreatmentPlanMapper;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import br.ufal.ic.odontolog.models.User;
import br.ufal.ic.odontolog.repositories.TreatmentPlanRepository;
import br.ufal.ic.odontolog.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TreatmentPlanService {
  private final TreatmentPlanRepository treatmentPlanRepository;
  private final UserRepository userRepository;
  private final TreatmentPlanMapper treatmentPlanMapper;

  @Transactional
  public TreatmentPlanDTO assignUserToTreatmentPlan(
      TreatmentPlanAssignUserRequestDTO requestDTO, Long treatmentId) {
    TreatmentPlan treatmentPlan =
        treatmentPlanRepository
            .findById(treatmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Treatment Plan not found"));

    User user =
        userRepository
            .findById(requestDTO.getUserId())
            .orElseThrow(() -> new UnprocessableRequestException("Provided User not found"));

    treatmentPlan.getState().assignUser(treatmentPlan, user);
    treatmentPlanRepository.save(treatmentPlan);

    return treatmentPlanMapper.toDTO(treatmentPlan);
  }
}

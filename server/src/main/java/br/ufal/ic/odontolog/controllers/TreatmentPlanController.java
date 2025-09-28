package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.api.TreatmentPlanApi;
import br.ufal.ic.odontolog.dtos.TreatmentPlanAssignUserRequestDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanDTO;
import br.ufal.ic.odontolog.services.TreatmentPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("/api/treatments")
@RequiredArgsConstructor
public class TreatmentPlanController implements TreatmentPlanApi {
  private final TreatmentPlanService treatmentPlanService;

  @PostMapping("/{treatment_id}/assignee")
  public ResponseEntity<TreatmentPlanDTO> assignUserToTreatmentPlan(
      @RequestBody TreatmentPlanAssignUserRequestDTO requestDTO, @PathVariable Long treatment_id) {
    TreatmentPlanDTO updatedTreatmentPlan =
        treatmentPlanService.assignUserToTreatmentPlan(requestDTO, treatment_id);

    return ResponseEntity.ok(updatedTreatmentPlan);
  }
}

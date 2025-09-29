package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.dtos.CreateTreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanAssignUserRequestDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanDTO;
import br.ufal.ic.odontolog.services.TreatmentPlanService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/treatment-plan")
@RequiredArgsConstructor
public class TreatmentPlanController {
  private final TreatmentPlanService treatmentPlanService;

  @PostMapping
  @PreAuthorize("hasAnyRole('STUDENT', 'SUPERVISOR')")
  public TreatmentPlanDTO createTreatmentPlan(@RequestBody CreateTreatmentPlanDTO request) {
    return treatmentPlanService.createTreatmentPlan(request);
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('STUDENT','SUPERVISOR')")
  public TreatmentPlanDTO getTreatmentPlan(@PathVariable UUID id) {
    return treatmentPlanService.getTreatmentPlanById(id);
  }

  @PostMapping("/{treatment_id}/assignee")
  public ResponseEntity<TreatmentPlanDTO> assignUserToTreatmentPlan(
      @RequestBody TreatmentPlanAssignUserRequestDTO requestDTO, @PathVariable Long treatment_id) {
    TreatmentPlanDTO updatedTreatmentPlan =
        treatmentPlanService.assignUserToTreatmentPlan(requestDTO, treatment_id);

    return ResponseEntity.ok(updatedTreatmentPlan);
  }
}

package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.dtos.CreateTreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanAssignUserRequestDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanShortDTO;
import br.ufal.ic.odontolog.services.TreatmentPlanService;
import java.util.List;
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
@RequestMapping("/api")
@RequiredArgsConstructor
public class TreatmentPlanController {
  private final TreatmentPlanService treatmentPlanService;

  @PostMapping("/treatment-plan")
  @PreAuthorize("hasAnyRole('STUDENT', 'SUPERVISOR')")
  public TreatmentPlanDTO createTreatmentPlan(@RequestBody CreateTreatmentPlanDTO request) {
    return treatmentPlanService.createTreatmentPlan(request);
  }

  @GetMapping("/treatment-plan/{id}")
  @PreAuthorize("hasAnyRole('STUDENT','SUPERVISOR')")
  public TreatmentPlanDTO getTreatmentPlan(@PathVariable Long id) {
    return treatmentPlanService.getTreatmentPlanById(id);
  }

  @PostMapping("/treatment-plan/{treatment_id}/assignee")
  @PreAuthorize("hasAnyRole('STUDENT', 'SUPERVISOR')")
  public ResponseEntity<TreatmentPlanDTO> assignUserToTreatmentPlan(
      @RequestBody TreatmentPlanAssignUserRequestDTO requestDTO, @PathVariable Long treatment_id) {
    TreatmentPlanDTO updatedTreatmentPlan =
        treatmentPlanService.assignUserToTreatmentPlan(requestDTO, treatment_id);

    return ResponseEntity.ok(updatedTreatmentPlan);
  }

  @GetMapping("/patients/{od}/treatment-plans")
  @PreAuthorize("hasAnyRole('STUDENT','SUPERVISOR')")
  public List<TreatmentPlanShortDTO> getTreatmentPlansByPatient(@PathVariable Long od) {
    return treatmentPlanService.getTreatmentPlansByPatientId(od);
  }
}

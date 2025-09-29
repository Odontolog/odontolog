package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.dtos.CreateTreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanDTO;
import br.ufal.ic.odontolog.services.TreatmentPlanService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
}

package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.api.TreatmentPlanApi;
import br.ufal.ic.odontolog.dtos.CreateTreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanAssignUserRequestDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanShortDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanSubmitForReviewDTO;
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
public class TreatmentPlanController implements TreatmentPlanApi {
  private final TreatmentPlanService treatmentPlanService;

  @PostMapping("/treatment-plan")
  @PreAuthorize("hasAnyRole('STUDENT', 'SUPERVISOR')")
  public TreatmentPlanDTO createTreatmentPlan(@RequestBody CreateTreatmentPlanDTO request) {
    return treatmentPlanService.createTreatmentPlan(request);
  }

  @GetMapping("/treatment-plan/{treatmentId}")
  @PreAuthorize("hasAnyRole('STUDENT','SUPERVISOR')")
  public TreatmentPlanDTO getTreatmentPlan(@PathVariable Long treatmentId) {
    return treatmentPlanService.getTreatmentPlanById(treatmentId);
  }

  @PostMapping("/treatment-plan/{treatmentId}/assignee")
  @PreAuthorize("hasAnyRole('STUDENT', 'SUPERVISOR')")
  public ResponseEntity<TreatmentPlanDTO> assignUserToTreatmentPlan(
      @RequestBody TreatmentPlanAssignUserRequestDTO requestDTO, @PathVariable Long treatmentId) {
    TreatmentPlanDTO updatedTreatmentPlan =
        treatmentPlanService.assignUserToTreatmentPlan(requestDTO, treatmentId);

    return ResponseEntity.ok(updatedTreatmentPlan);
  }

  @PostMapping("/{treatment_id}/submit-for-review")
  @PreAuthorize("hasAnyRole('STUDENT', 'SUPERVISOR')")
  public ResponseEntity<TreatmentPlanDTO> submitForReview(
      @PathVariable Long treatment_id, @RequestBody TreatmentPlanSubmitForReviewDTO requestDTO) {
    TreatmentPlanDTO updatedTreatmentPlan =
        treatmentPlanService.submitTreatmentPlanForReview(treatment_id, requestDTO);

    return ResponseEntity.ok(updatedTreatmentPlan);
  }

  @GetMapping("/patients/{patientId}/treatment-plan")
  @PreAuthorize("hasAnyRole('STUDENT','SUPERVISOR')")
  public List<TreatmentPlanShortDTO> getTreatmentPlansByPatient(@PathVariable Long patientId) {
    return treatmentPlanService.getTreatmentPlansByPatientId(patientId);
  }
}

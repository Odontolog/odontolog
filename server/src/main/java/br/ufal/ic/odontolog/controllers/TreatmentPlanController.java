package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.api.TreatmentPlanApi;
import br.ufal.ic.odontolog.dtos.CreateTreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.ProcedureUpsertDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanShortDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanSubmitForReviewDTO;
import br.ufal.ic.odontolog.services.TreatmentPlanService;
import jakarta.validation.Valid;
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

  // TODO: Move to ReviewableController
  // because it's related to reviewable actions
  @PostMapping("/treatment-plan/{treatment_id}/submit-for-review")
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

  @PostMapping("/treatment-plan/{treatmentId}/procedures")
  @PreAuthorize("hasAnyRole('STUDENT','SUPERVISOR')")
  public TreatmentPlanDTO addProcedure(
      @PathVariable Long treatmentId, @Valid @RequestBody ProcedureUpsertDTO dto) {
    return treatmentPlanService.addProcedureToTreatmentPlan(treatmentId, dto);
  }

  @PutMapping("/treatment-plan/{treatmentId}/procedures/{procedureId}")
  @PreAuthorize("hasAnyRole('STUDENT','SUPERVISOR')")
  public TreatmentPlanDTO updateProcedure(
      @PathVariable Long treatmentId,
      @PathVariable Long procedureId,
      @Valid @RequestBody ProcedureUpsertDTO dto) {
    return treatmentPlanService.updateProcedureInTreatmentPlan(treatmentId, procedureId, dto);
  }

  @DeleteMapping("/treatment-plan/{treatmentId}/procedures/{procedureId}")
  @PreAuthorize("hasAnyRole('STUDENT','SUPERVISOR')")
  public void removeProcedure(@PathVariable Long treatmentId, @PathVariable Long procedureId) {
    treatmentPlanService.removeProcedureFromTreatmentPlan(treatmentId, procedureId);
  }
}

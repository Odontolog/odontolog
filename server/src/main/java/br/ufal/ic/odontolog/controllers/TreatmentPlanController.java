package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.api.TreatmentPlanApi;
import br.ufal.ic.odontolog.dtos.CreateTreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.ProcedureUpsertDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanShortDTO;
import br.ufal.ic.odontolog.services.TreatmentPlanService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
  @PreAuthorize("hasPermission(#treatmentId, 'TreatmentPlan', 'edit')")
  public TreatmentPlanDTO getTreatmentPlan(@PathVariable Long treatmentId) {
    return treatmentPlanService.getTreatmentPlanById(treatmentId);
  }

  @GetMapping("/patients/{patientId}/treatment-plan")
  @PreAuthorize("hasPermission(#patientId, 'Patient', 'edit')")
  public List<TreatmentPlanShortDTO> getTreatmentPlansByPatient(@PathVariable Long patientId) {
    return treatmentPlanService.getTreatmentPlansByPatientId(patientId);
  }

  @PostMapping("/treatment-plan/{treatmentId}/procedures")
  @PreAuthorize("hasPermission(#treatmentId, 'TreatmentPlan', 'edit')")
  public TreatmentPlanDTO addProcedure(
      @PathVariable Long treatmentId, @Valid @RequestBody ProcedureUpsertDTO dto) {
    return treatmentPlanService.addProcedureToTreatmentPlan(treatmentId, dto);
  }

  @PutMapping("/treatment-plan/{treatmentId}/procedures/{procedureId}")
  @PreAuthorize("hasPermission(#treatmentId, 'TreatmentPlan', 'edit')")
  public TreatmentPlanDTO updateProcedure(
      @PathVariable Long treatmentId,
      @PathVariable Long procedureId,
      @Valid @RequestBody ProcedureUpsertDTO dto) {
    return treatmentPlanService.updateProcedureInTreatmentPlan(treatmentId, procedureId, dto);
  }

  @DeleteMapping("/treatment-plan/{treatmentId}/procedures/{procedureId}")
  @PreAuthorize("hasPermission(#treatmentId, 'TreatmentPlan', 'edit')")
  public void removeProcedure(@PathVariable Long treatmentId, @PathVariable Long procedureId) {
    treatmentPlanService.removeProcedureFromTreatmentPlan(treatmentId, procedureId);
  }
}

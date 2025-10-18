package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.dtos.*;
import br.ufal.ic.odontolog.services.ProcedureService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProcedureController {
  private final ProcedureService procedureService;

  @PreAuthorize("hasAnyRole('SUPERVISOR', 'STUDENT')")
  @GetMapping("/patients/{patientId}/procedures")
  public ResponseEntity<List<ProcedureShortDTO>> getPatientDoneProcedures(
      @PathVariable Long patientId) {
    List<ProcedureShortDTO> procedures = procedureService.getDonePatientProcedures(patientId);
    return ResponseEntity.ok(procedures);
  }

  @PreAuthorize("hasAnyRole('SUPERVISOR', 'STUDENT')")
  @GetMapping("/procedures/{procedureId}")
  public ResponseEntity<ProcedureDTO> getProcedureById(@PathVariable Long procedureId) {
    return ResponseEntity.ok(procedureService.getProcedureById(procedureId));
  }

  @PreAuthorize("hasAnyRole('SUPERVISOR', 'STUDENT')")
  @PatchMapping("/procedures/{procedureId}/teeth")
  public ResponseEntity<ProcedureDTO> updateProcedureTeeth(
      @PathVariable Long procedureId, @Valid @RequestBody UpdateProcedureTeethDTO request) {
    return ResponseEntity.ok(procedureService.updateTeeth(procedureId, request.getTeeth()));
  }

  @PreAuthorize("hasAnyRole('SUPERVISOR', 'STUDENT')")
  @PatchMapping("/procedures/{procedureId}/study-sector")
  public ResponseEntity<ProcedureDTO> updateProcedureStudySector(
      @PathVariable Long procedureId, @Valid @RequestBody UpdateProcedureStudySectorDTO request) {
    return ResponseEntity.ok(
        procedureService.updateStudySector(procedureId, request.getStudySector()));
  }

  @PreAuthorize("hasAnyRole('SUPERVISOR', 'STUDENT')")
  @PatchMapping("/procedures/{procedureId}/diagnostic")
  public ResponseEntity<ProcedureDTO> updateProcedureDetail(
      @PathVariable Long procedureId, @Valid @RequestBody UpdateProcedureDetailDTO request) {
    return ResponseEntity.ok(
        procedureService.updateDiagnostic(procedureId, request.getDiagnostic())
    );
  }
}

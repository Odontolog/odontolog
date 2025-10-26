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

  @GetMapping("/patients/{patientId}/procedures")
  @PreAuthorize("hasPermission(#patientId, 'Patient', 'edit')")
  public ResponseEntity<List<ProcedureShortDTO>> getPatientDoneProcedures(
      @PathVariable Long patientId) {
    List<ProcedureShortDTO> procedures = procedureService.getDonePatientProcedures(patientId);
    return ResponseEntity.ok(procedures);
  }

  @GetMapping("/procedures/{procedureId}")
  @PreAuthorize("hasPermission(#procedureId, 'Procedure', 'edit')")
  public ResponseEntity<ProcedureDTO> getProcedureById(@PathVariable Long procedureId) {
    return ResponseEntity.ok(procedureService.getProcedureById(procedureId));
  }

  @PostMapping("/procedures/{procedureId}/start")
  @PreAuthorize("hasPermission(#procedureId, 'Procedure', 'edit')")
  public ResponseEntity<ProcedureDTO> startProcedure(@PathVariable Long procedureId) {
    return ResponseEntity.ok(procedureService.startProcedure(procedureId));
  }

  @PatchMapping("/procedures/{procedureId}/teeth")
  @PreAuthorize("hasPermission(#procedureId, 'Procedure', 'edit')")
  public ResponseEntity<ProcedureDTO> updateProcedureTeeth(
      @PathVariable Long procedureId, @Valid @RequestBody UpdateProcedureTeethDTO request) {
    return ResponseEntity.ok(procedureService.updateTeeth(procedureId, request.getTeeth()));
  }

  @PatchMapping("/procedures/{procedureId}/study-sector")
  @PreAuthorize("hasPermission(#procedureId, 'Procedure', 'edit')")
  public ResponseEntity<ProcedureDTO> updateProcedureStudySector(
      @PathVariable Long procedureId, @Valid @RequestBody UpdateProcedureStudySectorDTO request) {
    return ResponseEntity.ok(
        procedureService.updateStudySector(procedureId, request.getStudySector()));
  }

  @PatchMapping("/procedures/{procedureId}/diagnostic")
  @PreAuthorize("hasPermission(#procedureId, 'Procedure', 'edit')")
  public ResponseEntity<ProcedureDTO> updateProcedureDetail(
      @PathVariable Long procedureId, @Valid @RequestBody UpdateProcedureDetailDTO request) {
    return ResponseEntity.ok(
        procedureService.updateDiagnostic(procedureId, request.getDiagnostic()));
  }
}

package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.dtos.*;
import br.ufal.ic.odontolog.services.ProcedureService;
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
  @GetMapping("/procedures/{procedureId}")
  public ResponseEntity<ProcedureDTO> getProcedureById(@PathVariable Long procedureId) {
    return ResponseEntity.ok(procedureService.getProcedureById(procedureId));
  }

  @PreAuthorize("hasAnyRole('SUPERVISOR', 'STUDENT')")
  @GetMapping("/patients/{patientId}/procedures")
  public ResponseEntity<List<ProcedureDTO>> getPatientProcedures(@PathVariable Long patientId) {
    List<ProcedureDTO> procedures = procedureService.getAllPatientProcedures(patientId);

    return ResponseEntity.ok(procedures);
  }

  @PreAuthorize("hasAnyRole('SUPERVISOR', 'STUDENT')")
  @PatchMapping("/procedures/{procedureId}/teeth")
  public ResponseEntity<ProcedureDTO> updateProcedureTeeth(
      @PathVariable Long procedureId, @RequestBody UpdateProcedureTeethDTO request) {
    return ResponseEntity.ok(procedureService.updateTeeth(procedureId, request.getTeeth()));
  }
}

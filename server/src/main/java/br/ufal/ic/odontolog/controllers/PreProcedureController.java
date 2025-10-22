package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.api.PreProcedureApi;
import br.ufal.ic.odontolog.dtos.*;
import br.ufal.ic.odontolog.services.PreProcedureService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PreProcedureController implements PreProcedureApi {

  private final PreProcedureService preProcedureService;

  @PostMapping("/patients/{patientId}/pre-procedures")
  public ResponseEntity<PreProcedureDTO> createPreProcedure(
      @PathVariable Long patientId, @RequestBody @Valid PreProcedureUpsertDTO dto) {
    PreProcedureDTO created = preProcedureService.createPreProcedure(patientId, dto);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  @GetMapping("/patients/{patientId}/pre-procedures/{preProcedureId}")
  public ResponseEntity<PreProcedureDTO> getPreProcedureByPatientAndId(
      @PathVariable Long patientId, @PathVariable Long preProcedureId) {
    PreProcedureDTO dto =
        preProcedureService.getPreProcedureByPatientAndId(patientId, preProcedureId);
    return ResponseEntity.ok(dto);
  }

  @GetMapping("/patients/{patientId}/pre-procedures")
  public ResponseEntity<List<PreProcedureShortDTO>> getPreProceduresForPatient(
      @PathVariable Long patientId) {
    List<PreProcedureShortDTO> list = preProcedureService.getPreProceduresForPatient(patientId);
    return ResponseEntity.ok(list);
  }
}

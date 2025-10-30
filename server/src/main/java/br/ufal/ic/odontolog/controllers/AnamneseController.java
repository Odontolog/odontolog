package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.dtos.anamnese.AnamneseConditionsUpsertDTO;
import br.ufal.ic.odontolog.dtos.anamnese.AnamneseDTO;
import br.ufal.ic.odontolog.dtos.anamnese.AnamneseNotesUpsertDTO;
import br.ufal.ic.odontolog.services.AnamneseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@PreAuthorize("isAuthenticated()")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/patients/{patientId}/anamnese")
public class AnamneseController {

  private final AnamneseService service;

  @GetMapping
  public ResponseEntity<AnamneseDTO> get(@PathVariable Long patientId) {
    return ResponseEntity.ok(service.getByPatientId(patientId));
  }

  @PatchMapping("/notes")
  @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'STUDENT')")
  public ResponseEntity<AnamneseDTO> upsertNotes(
      @PathVariable Long patientId, @RequestBody @Valid AnamneseNotesUpsertDTO dto) {
    return ResponseEntity.ok(service.upsertNotes(patientId, dto));
  }

  @PutMapping("/conditions")
  @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'STUDENT')")
  public ResponseEntity<AnamneseDTO> upsertConditions(
      @PathVariable Long patientId, @RequestBody @Valid AnamneseConditionsUpsertDTO dto) {
    return ResponseEntity.ok(service.upsertConditions(patientId, dto));
  }
}

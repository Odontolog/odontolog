package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.dtos.*;
import br.ufal.ic.odontolog.services.PreProcedureService;
import java.util.List;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PreProcedureController {

    private final PreProcedureService preProcedureService;

    @PostMapping("/patient/{patientId}/pre-procedures")
    public ResponseEntity<PreProcedureDTO> createPreProcedure(
            @PathVariable Long patientId,
            @RequestBody @Valid PreProcedureUpsertDTO dto) {
        PreProcedureDTO created = preProcedureService.createPreProcedure(patientId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/pre-procedures/{id}")
    public ResponseEntity<PreProcedureDTO> getPreProcedureById(@PathVariable Long id) {
        PreProcedureDTO dto = preProcedureService.getPreProcedureById(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/patient/{patientId}/pre-procedures")
    public ResponseEntity<List<PreProcedureShortDTO>> getPreProceduresForPatient(
            @PathVariable Long patientId) {
        List<PreProcedureShortDTO> list = preProcedureService.getPreProceduresForPatient(patientId);
        return ResponseEntity.ok(list);
    }
}


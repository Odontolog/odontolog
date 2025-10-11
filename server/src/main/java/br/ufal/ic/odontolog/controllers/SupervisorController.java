package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.dtos.*;
import br.ufal.ic.odontolog.services.SupervisorService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@PreAuthorize("isAuthenticated()")
@RestController
@RequestMapping("/api/supervisors")
public class SupervisorController {

  private final SupervisorService supervisorService;

  public SupervisorController(SupervisorService supervisorService) {
    this.supervisorService = supervisorService;
  }

  @GetMapping
  public ResponseEntity<List<SupervisorDTO>> getAllSupervisors() {
    return new ResponseEntity<>(supervisorService.getSupervisors(), HttpStatus.OK);
  }

  @GetMapping({"/{id}"})
  public ResponseEntity<SupervisorDTO> getSupervisor(@PathVariable UUID id) {
    return new ResponseEntity<>(supervisorService.getSupervisorById(id), HttpStatus.OK);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN') or #id == principal.id")
  public ResponseEntity<SupervisorDTO> updateSupervisorById(
      @PathVariable UUID id, @RequestBody @Valid SupervisorUpdateDTO supervisorUpdateDTO) {

    SupervisorDTO supervisorDTO = supervisorService.updateSupervisor(id, supervisorUpdateDTO);
    return new ResponseEntity<>(supervisorDTO, HttpStatus.OK);
  }
}

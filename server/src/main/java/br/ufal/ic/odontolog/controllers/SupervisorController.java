package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.dtos.*;
import br.ufal.ic.odontolog.services.SupervisorService;
import jakarta.validation.Valid;
import java.util.List;
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

  @GetMapping({"/{email}"})
  public ResponseEntity<SupervisorDTO> getSupervisor(@PathVariable String email) {
    return new ResponseEntity<>(supervisorService.getSupervisorByEmail(email), HttpStatus.OK);
  }

  @PutMapping({"/{email}"})
  @PreAuthorize("hasAnyRole('ADMIN') or authentication.name == #email")
  public ResponseEntity<SupervisorDTO> updateSupervisorByEmail(
      @PathVariable String email, @RequestBody @Valid SupervisorUpdateDTO supervisorUpdateDTO) {
    SupervisorDTO supervisorDTO = supervisorService.updateSupervisor(email, supervisorUpdateDTO);

    return new ResponseEntity<>(supervisorDTO, HttpStatus.OK);
  }
}

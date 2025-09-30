package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.dtos.*;
import br.ufal.ic.odontolog.services.PatientService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@PreAuthorize("isAuthenticated()")
@RestController
@RequestMapping("/api/patients")
public class PatientController {
  private final PatientService patientService;

  public PatientController(PatientService patientService) {
    this.patientService = patientService;
  }

  @GetMapping
  public ResponseEntity<List<PatientDTO>> getAllPatients() {
    return new ResponseEntity<>(patientService.getPatients(), HttpStatus.OK);
  }

  @GetMapping("/{id}")
  public ResponseEntity<PatientDTO> getPatientById(@PathVariable Long id) {
    return new ResponseEntity<>(patientService.getPatientById(id), HttpStatus.OK);
  }
}

package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.dtos.PatientAndTreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.PatientDTO;
import br.ufal.ic.odontolog.services.PatientService;
import java.util.List;
import java.util.Optional;
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
    return ResponseEntity.ok(patientService.getPatients());
  }

  @GetMapping("/search")
  public ResponseEntity<List<PatientAndTreatmentPlanDTO>> searchPatient(
      @RequestParam(name = "term") Optional<String> searchTerm) {
    return ResponseEntity.ok(patientService.searchForPatients(searchTerm));
  }

  @GetMapping("/{id}")
  public ResponseEntity<PatientDTO> getPatientById(@PathVariable Long id) {
    return ResponseEntity.ok(patientService.getPatientById(id));
  }
}

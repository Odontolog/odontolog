package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.dtos.AppointmentDTO;
import br.ufal.ic.odontolog.dtos.PatientAndTreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.PatientDTO;
import br.ufal.ic.odontolog.mappers.PatientMapper;
import br.ufal.ic.odontolog.services.PatientService;
import jakarta.validation.Valid;
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
  private final PatientMapper patientMapper;

  public PatientController(PatientService patientService, PatientMapper patientMapper) {
    this.patientService = patientService;
    this.patientMapper = patientMapper;
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

  @GetMapping("/{id}/next-appointment")
  public ResponseEntity<AppointmentDTO> getNextAppointment(@PathVariable Long id) {
    AppointmentDTO appointmentDTO = patientService.getNextAppointment(id);
    return ResponseEntity.ok(appointmentDTO);
  }

  @PutMapping("/{id}/next-appointment")
  @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
  public ResponseEntity<AppointmentDTO> updateNextAppointment(
      @PathVariable Long id, @RequestBody @Valid AppointmentDTO appointmentDTO) {

    patientService.updateNextAppointment(id, appointmentDTO);
    return ResponseEntity.ok(appointmentDTO);
  }
}

package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.dtos.AppointmentDTO;
import br.ufal.ic.odontolog.dtos.PatientAndTreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.PatientDTO;
import br.ufal.ic.odontolog.dtos.PatientUpsertDTO;
import br.ufal.ic.odontolog.services.PatientService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@PreAuthorize("isAuthenticated()")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/patients")
public class PatientController {
  private final PatientService patientService;

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
    AppointmentDTO updatedAppointment = patientService.getNextAppointment(id);
    return ResponseEntity.ok(updatedAppointment);
  }

  @PostMapping
  @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
  public ResponseEntity<PatientDTO> createPatient(@RequestBody @Valid PatientUpsertDTO dto) {
    PatientDTO created = patientService.createPatient(dto);
    return ResponseEntity.status(201).body(created);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
  public ResponseEntity<PatientDTO> updatePatient(
      @PathVariable Long id, @RequestBody @Valid PatientUpsertDTO dto) {
    PatientDTO updated = patientService.updatePatient(id, dto);
    return ResponseEntity.ok(updated);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
  public ResponseEntity<Void> deletePatient(
      @PathVariable Long id, @RequestParam(defaultValue = "true") boolean soft) {

    patientService.deletePatient(id, soft);
    return ResponseEntity.noContent().build();
  }

  @PutMapping("/{id}/restore")
  @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
  public ResponseEntity<Void> restorePatient(@PathVariable Long id) {
    patientService.restorePatient(id);
    return ResponseEntity.noContent().build();
  }
}

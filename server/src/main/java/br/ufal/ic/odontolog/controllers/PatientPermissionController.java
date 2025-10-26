package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.dtos.StudentDTO;
import br.ufal.ic.odontolog.services.PatientPermissionService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@PreAuthorize("isAuthenticated()")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/patients/{patientId}/permissions")
public class PatientPermissionController {
  private final PatientPermissionService patientPermissionService;

  @GetMapping
  @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
  public ResponseEntity<List<StudentDTO>> getAllowedStudents(@PathVariable Long patientId) {
    List<StudentDTO> students = patientPermissionService.getAllowedStudents(patientId);
    return ResponseEntity.ok(students);
  }

  @PostMapping("/{studentId}")
  @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
  public ResponseEntity<Void> grantPermission(
      @PathVariable Long patientId, @PathVariable UUID studentId) {
    patientPermissionService.grantPermission(studentId, patientId);
    return ResponseEntity.status(201).build();
  }

  @DeleteMapping("/{studentId}")
  @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
  public ResponseEntity<Void> revokePermission(
      @PathVariable Long patientId, @PathVariable UUID studentId) {
    patientPermissionService.revokePermission(studentId, patientId);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{studentId}/check")
  @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'STUDENT')")
  public ResponseEntity<Boolean> hasPermission(
      @PathVariable Long patientId, @PathVariable UUID studentId) {
    boolean hasPermission = patientPermissionService.hasPermission(studentId, patientId);
    return ResponseEntity.ok(hasPermission);
  }
}

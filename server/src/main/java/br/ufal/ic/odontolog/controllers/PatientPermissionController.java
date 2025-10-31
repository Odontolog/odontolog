package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.dtos.StudentDTO;
import br.ufal.ic.odontolog.enums.Role;
import br.ufal.ic.odontolog.models.User;
import br.ufal.ic.odontolog.services.PatientPermissionService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

  @GetMapping("/check")
  @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'STUDENT')")
  public ResponseEntity<Boolean> hasPermission(
      @AuthenticationPrincipal User user, @PathVariable Long patientId) {
    if (user.getRole() == Role.STUDENT) {
      boolean hasPermission = patientPermissionService.hasPermission(user.getId(), patientId);
      return ResponseEntity.ok(hasPermission);
    }

    return ResponseEntity.ok(true);
  }
}

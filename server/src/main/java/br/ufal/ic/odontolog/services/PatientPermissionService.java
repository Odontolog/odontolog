package br.ufal.ic.odontolog.services;

import static org.springframework.http.HttpStatus.NOT_FOUND;

import br.ufal.ic.odontolog.dtos.StudentDTO;
import br.ufal.ic.odontolog.exceptions.PermissionAlreadyExistsException;
import br.ufal.ic.odontolog.mappers.StudentMapper;
import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.PatientPermission;
import br.ufal.ic.odontolog.models.Student;
import br.ufal.ic.odontolog.repositories.PatientPermissionRepository;
import br.ufal.ic.odontolog.repositories.PatientRepository;
import br.ufal.ic.odontolog.repositories.StudentRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class PatientPermissionService {
  private final PatientPermissionRepository patientPermissionRepository;
  private final PatientRepository patientRepository;
  private final StudentRepository studentRepository;
  private final StudentMapper studentMapper;

  public List<StudentDTO> getAllowedStudents(Long patientId) {
    return patientPermissionRepository.findByPatientIdAndActiveTrue(patientId).stream()
        .map(p -> studentMapper.toDTO(p.getStudent()))
        .collect(Collectors.toList());
  }

  @Transactional
  public void grantPermission(UUID studentId, Long patientId) {
    boolean alreadyHasActivePermission =
        patientPermissionRepository
            .findTopByStudentIdAndPatientIdAndActiveTrueOrderByGrantedAtDesc(studentId, patientId)
            .isPresent();

    if (alreadyHasActivePermission) {
      throw new PermissionAlreadyExistsException(
          "Student " + studentId + " already has access to patient " + patientId);
    }

    Patient patient =
        patientRepository
            .findById(patientId)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Patient not found"));

    Student student =
        studentRepository
            .findById(studentId)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Student not found"));

    PatientPermission permission = new PatientPermission();
    permission.setGrantedAt(Instant.now());
    permission.setPatient(patient);
    permission.setStudent(student);

    patientPermissionRepository.save(permission);
  }

  @Transactional
  public void revokePermission(UUID studentId, Long patientId) {
    PatientPermission permission =
        patientPermissionRepository
            .findTopByStudentIdAndPatientIdAndActiveTrueOrderByGrantedAtDesc(studentId, patientId)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Permission not found"));

    permission.setRevokedAt(Instant.now());
    permission.setActive(false);

    patientPermissionRepository.save(permission);
  }

  public boolean hasPermission(UUID studentId, Long patientId) {
    return patientPermissionRepository
        .findTopByStudentIdAndPatientIdAndActiveTrueOrderByGrantedAtDesc(studentId, patientId)
        .isPresent();
  }
}

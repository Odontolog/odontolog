package br.ufal.ic.odontolog.repositories;

import br.ufal.ic.odontolog.models.PatientPermission;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientPermissionRepository extends JpaRepository<PatientPermission, Long> {
  List<PatientPermission> findByPatientIdAndActiveTrue(Long patientId);

  Optional<PatientPermission> findTopByStudentIdAndPatientIdAndActiveTrueOrderByGrantedAtDesc(
      UUID studentId, Long patientId);
}

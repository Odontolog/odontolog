package br.ufal.ic.odontolog.repositories;

import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.PreProcedure;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PreProcedureRepository extends JpaRepository<PreProcedure, Long> {
  List<PreProcedure> findByPatientId(Long patientId);

  Optional<PreProcedure> findByIdAndPatient(Long preProcedureId, Patient patient);
}

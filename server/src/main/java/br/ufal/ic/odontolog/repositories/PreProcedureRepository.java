package br.ufal.ic.odontolog.repositories;

import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.PreProcedure;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PreProcedureRepository extends JpaRepository<PreProcedure, Long> {
    List<PreProcedure> findByPatientId(Long patientId);
}

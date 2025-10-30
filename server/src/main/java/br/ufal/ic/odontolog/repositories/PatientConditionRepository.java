package br.ufal.ic.odontolog.repositories;

import br.ufal.ic.odontolog.models.PatientCondition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientConditionRepository extends JpaRepository<PatientCondition, Long> {}

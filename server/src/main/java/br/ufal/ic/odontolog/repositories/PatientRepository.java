package br.ufal.ic.odontolog.repositories;

import br.ufal.ic.odontolog.models.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {}

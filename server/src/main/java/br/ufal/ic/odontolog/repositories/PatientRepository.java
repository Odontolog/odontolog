package br.ufal.ic.odontolog.repositories;

import br.ufal.ic.odontolog.models.Patient;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, UUID> {}

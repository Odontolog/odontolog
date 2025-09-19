package br.ufal.ic.odontolog.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufal.ic.odontolog.models.Patient;

public interface PatientRepository extends JpaRepository<Patient, UUID> {

}

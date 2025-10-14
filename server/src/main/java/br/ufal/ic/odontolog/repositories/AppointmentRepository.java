package br.ufal.ic.odontolog.repositories;

import br.ufal.ic.odontolog.models.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {}

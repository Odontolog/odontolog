package br.ufal.ic.odontolog.repositories;

import br.ufal.ic.odontolog.models.Supervisor;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupervisorRepository extends JpaRepository<Supervisor, UUID> {
    Optional<Supervisor> findByEmail(String email);
}

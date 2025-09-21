package br.ufal.ic.odontolog.repositories;

import br.ufal.ic.odontolog.models.PreProcedure;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PreProcedureRepository extends JpaRepository<PreProcedure, UUID> {}

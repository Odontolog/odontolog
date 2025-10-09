package br.ufal.ic.odontolog.repositories;

import br.ufal.ic.odontolog.models.Procedure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcedureRepository extends JpaRepository<Procedure, Long> {}

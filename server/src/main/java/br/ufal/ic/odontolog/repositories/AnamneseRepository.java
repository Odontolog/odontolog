package br.ufal.ic.odontolog.repositories;

import br.ufal.ic.odontolog.models.Anamnese;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnamneseRepository extends JpaRepository<Anamnese, Long> {}

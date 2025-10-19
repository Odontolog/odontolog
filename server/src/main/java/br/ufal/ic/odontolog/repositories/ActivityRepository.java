package br.ufal.ic.odontolog.repositories;

import br.ufal.ic.odontolog.models.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityRepository extends JpaRepository<Activity, Long> {}

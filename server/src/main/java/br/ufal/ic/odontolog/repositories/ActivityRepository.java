package br.ufal.ic.odontolog.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufal.ic.odontolog.models.Activity;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

}

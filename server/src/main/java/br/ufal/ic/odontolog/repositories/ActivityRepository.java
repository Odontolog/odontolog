package br.ufal.ic.odontolog.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufal.ic.odontolog.models.Activity;

public interface ActivityRepository extends JpaRepository<Activity, UUID> {

}

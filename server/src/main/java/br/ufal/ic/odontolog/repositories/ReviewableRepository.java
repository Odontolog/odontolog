package br.ufal.ic.odontolog.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufal.ic.odontolog.models.Reviewable;

public interface ReviewableRepository extends JpaRepository<Reviewable, UUID> {

}

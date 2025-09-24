package br.ufal.ic.odontolog.repositories;

import br.ufal.ic.odontolog.models.Reviewable;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewableRepository extends JpaRepository<Reviewable, UUID> {

}

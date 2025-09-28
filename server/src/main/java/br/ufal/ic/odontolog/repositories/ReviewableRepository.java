package br.ufal.ic.odontolog.repositories;

import br.ufal.ic.odontolog.models.Reviewable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ReviewableRepository
        extends JpaRepository<Reviewable, Long>, JpaSpecificationExecutor<Reviewable> {
}

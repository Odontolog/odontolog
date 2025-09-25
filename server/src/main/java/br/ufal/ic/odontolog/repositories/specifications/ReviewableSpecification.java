package br.ufal.ic.odontolog.repositories.specifications;

import java.util.Optional;

import org.springframework.data.jpa.domain.Specification;

import br.ufal.ic.odontolog.models.Reviewable;
import br.ufal.ic.odontolog.models.Supervisor;

public class ReviewableSpecification {
    public static Specification<Reviewable> isReviewedBy(Supervisor supervisor) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.isMember(supervisor, root.get("reviewers"));
    }
}

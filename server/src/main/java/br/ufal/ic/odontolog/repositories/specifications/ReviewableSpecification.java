package br.ufal.ic.odontolog.repositories.specifications;

import br.ufal.ic.odontolog.enums.ReviewStatus;
import br.ufal.ic.odontolog.models.Review;
import br.ufal.ic.odontolog.models.Reviewable;
import br.ufal.ic.odontolog.models.Supervisor;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

public class ReviewableSpecification {
  public static Specification<Reviewable> isReviewedBy(Supervisor supervisor) {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.isMember(supervisor, root.get("reviewers"));
  }

  public static Specification<Reviewable> hasNameLike(String name) {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.like(
            criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
  }

  public static Specification<Reviewable> isAwaitingReviewBy(Supervisor supervisor) {
    return (root, query, criteriaBuilder) -> {
      query.distinct(true);

      Join<Reviewable, Review> reviewJoin = root.join("reviews");

      Predicate supervisorPredicate =
          criteriaBuilder.equal(reviewJoin.get("supervisor"), supervisor);
      Predicate statusPredicate =
          criteriaBuilder.equal(reviewJoin.get("reviewStatus"), ReviewStatus.PENDING);

      return criteriaBuilder.and(supervisorPredicate, statusPredicate);
    };
  }
}

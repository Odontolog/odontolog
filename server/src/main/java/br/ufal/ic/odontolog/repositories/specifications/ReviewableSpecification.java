package br.ufal.ic.odontolog.repositories.specifications;

import br.ufal.ic.odontolog.enums.ProcedureStatus;
import br.ufal.ic.odontolog.enums.ReviewStatus;
import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import br.ufal.ic.odontolog.models.*;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

public class ReviewableSpecification {
  public static Specification<Reviewable> isReviewedBy(Supervisor supervisor) {
    return (root, query, criteriaBuilder) -> {
      query.distinct(true);
      Join<Reviewable, Review> reviewJoin = root.join("reviews");
      return criteriaBuilder.equal(reviewJoin.get("supervisor"), supervisor);
    };
  }

  public static Specification<Reviewable> isAssignedTo(User student) {
    return (root, query, cb) -> cb.equal(root.get("assignee"), student);
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

  public static Specification<Reviewable> isInReview() {
    return (root, query, cb) -> {
      Predicate procedureInReview =
          cb.and(
              cb.equal(root.type(), Procedure.class),
              cb.equal(cb.treat(root, Procedure.class).get("status"), ProcedureStatus.IN_REVIEW));

      Predicate tpInReview =
          cb.and(
              cb.equal(root.type(), TreatmentPlan.class),
              cb.equal(
                  cb.treat(root, TreatmentPlan.class).get("status"),
                  TreatmentPlanStatus.IN_REVIEW));

      return cb.or(procedureInReview, tpInReview);
    };
  }
}

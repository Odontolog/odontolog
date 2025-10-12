package br.ufal.ic.odontolog.states.treatmentPlan;

import br.ufal.ic.odontolog.enums.ReviewStatus;
import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import br.ufal.ic.odontolog.exceptions.ReviewSubmissionException;
import br.ufal.ic.odontolog.models.Review;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import br.ufal.ic.odontolog.models.User;
import java.util.Set;
import java.util.stream.Collectors;

public class TreatmentPlanStates {
  public static class DraftState implements TreatmentPlanState {
    public TreatmentPlanStatus getStatus() {
      return TreatmentPlanStatus.DRAFT;
    }

    @Override
    public void assignUser(TreatmentPlan treatmentPlan, User user) {
      treatmentPlan.setAssignee(user);
    }

    @Override
    public void setReviewers(TreatmentPlan treatmentPlan, Set<Supervisor> reviewers) {
      Set<Supervisor> currentReviewers = treatmentPlan.getReviewers();

      Set<Supervisor> reviewersToAdd =
          reviewers.stream()
              .filter(reviewer -> !currentReviewers.contains(reviewer))
              .collect(Collectors.toSet());

      Set<Supervisor> reviewersToRemove =
          currentReviewers.stream()
              .filter(reviewer -> !reviewers.contains(reviewer))
              .collect(Collectors.toSet());

      reviewersToAdd.forEach(treatmentPlan::addReviewer);
      reviewersToRemove.forEach(treatmentPlan::removeReviewer);
    }

    @Override
    public void submitForReview(TreatmentPlan treatmentPlan) {
      if (treatmentPlan.getAssignee() == null) {
        throw new ReviewSubmissionException("Cannot submit for review without an assigned user.");
      }

      if (treatmentPlan.getReviewers() == null || treatmentPlan.getReviewers().isEmpty()) {
        throw new ReviewSubmissionException("Cannot submit for review without assigned reviewers.");
      }

      treatmentPlan.setStatus(TreatmentPlanStatus.IN_REVIEW);

      treatmentPlan.getReviews().stream()
          .filter(
              review ->
                  review.getReviewStatus() == ReviewStatus.DRAFT
                      || review.getReviewStatus() == ReviewStatus.REJECTED)
          .forEach(review -> review.setReviewStatus(ReviewStatus.PENDING));
    }
  }

  public static class InProgressState implements TreatmentPlanState {
    public TreatmentPlanStatus getStatus() {
      return TreatmentPlanStatus.IN_PROGRESS;
    }
  }

  public static class InReviewState implements TreatmentPlanState {
    public TreatmentPlanStatus getStatus() {
      return TreatmentPlanStatus.IN_REVIEW;
    }

    public void submitSupervisorReview(
        TreatmentPlan treatmentPlan,
        Supervisor supervisor,
        String comments,
        Integer grade,
        Boolean approved) {
      // TODO: CERTAMENTE eu deveria implementar testes unitários para este método
      // não fiz porque preciso entregar essa funcionalidade logo. ;-;
      Review review =
          treatmentPlan
              .getReviewFor(supervisor)
              .orElseThrow(
                  () -> new IllegalStateException("Review not found for the current supervisor"));

      review.setComments(comments);
      review.setGrade(grade);
      review.setReviewStatus(approved ? ReviewStatus.APPROVED : ReviewStatus.REJECTED);

      updateOverallStatus(treatmentPlan);
    }

    private boolean allReviewsSubmitted(TreatmentPlan treatmentPlan) {
      return treatmentPlan.getReviews().stream()
          .allMatch(
              review ->
                  review.getReviewStatus() == ReviewStatus.APPROVED
                      || review.getReviewStatus() == ReviewStatus.REJECTED);
    }

    private boolean allReviewsApproved(TreatmentPlan treatmentPlan) {
      return treatmentPlan.getReviews().stream()
          .allMatch(review -> review.getReviewStatus() == ReviewStatus.APPROVED);
    }

    private void updateOverallStatus(TreatmentPlan treatmentPlan) {
      if (allReviewsSubmitted(treatmentPlan)) {
        if (allReviewsApproved(treatmentPlan)) {
          treatmentPlan.approve();
        } else {
          treatmentPlan.reject();
        }
      }
    }
  }

  public static class DoneState implements TreatmentPlanState {
    public TreatmentPlanStatus getStatus() {
      return TreatmentPlanStatus.DONE;
    }
  }
}

package br.ufal.ic.odontolog.states.treatmentPlan;

import br.ufal.ic.odontolog.enums.ReviewStatus;
import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import br.ufal.ic.odontolog.models.Review;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import br.ufal.ic.odontolog.models.User;

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
    public void submitForReview(TreatmentPlan treatmentPlan) {
      if (treatmentPlan.getAssignee() == null) {
        throw new IllegalStateException("Cannot submit for review without an assigned user.");
      }

      if (treatmentPlan.getReviewers() == null || treatmentPlan.getReviewers().isEmpty()) {
        throw new IllegalStateException("Cannot submit for review without assigned reviewers.");
      }

      treatmentPlan.setStatus(TreatmentPlanStatus.IN_REVIEW);

      for (Supervisor reviewer : treatmentPlan.getReviewers()) {
        treatmentPlan
            .getReviews()
            .add(
                Review.builder()
                    .supervisor(reviewer)
                    .reviewable(treatmentPlan)
                    .reviewStatus(ReviewStatus.PENDING)
                    .build());
      }
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
  }

  public static class DoneState implements TreatmentPlanState {
    public TreatmentPlanStatus getStatus() {
      return TreatmentPlanStatus.DONE;
    }
  }
}

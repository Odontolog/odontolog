package br.ufal.ic.odontolog.states.procedure;

import br.ufal.ic.odontolog.enums.ProcedureStatus;
import br.ufal.ic.odontolog.enums.ReviewStatus;
import br.ufal.ic.odontolog.exceptions.ReviewSubmissionException;
import br.ufal.ic.odontolog.models.Procedure;
import br.ufal.ic.odontolog.models.Review;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.models.User;
import java.math.BigDecimal;
import java.util.Set;

public class ProcedureStates {
  public static class DraftState implements ProcedureState {
    @Override
    public ProcedureStatus getStatus() {
      return ProcedureStatus.DRAFT;
    }
  }

  public static class NotStartedState implements ProcedureState {
    @Override
    public ProcedureStatus getStatus() {
      return ProcedureStatus.NOT_STARTED;
    }

    @Override
    public void startProcedure(Procedure procedure) {
      procedure.setStatus(ProcedureStatus.IN_PROGRESS);
    }

    @Override
    public void assignUser(Procedure procedure, User user) {
      procedure.setAssignee(user);
    }

    @Override
    public void setReviewers(Procedure procedure, Set<Supervisor> supervisors) {
      procedure.updateReviewers(procedure, supervisors);
    }
  }

  public static class InProgressState implements ProcedureState {
    @Override
    public ProcedureStatus getStatus() {
      return ProcedureStatus.IN_PROGRESS;
    }

    @Override
    public void setReviewers(Procedure procedure, Set<Supervisor> supervisors) {
      procedure.updateReviewers(procedure, supervisors);
    }

    @Override
    public void submitForReview(Procedure procedure) {
      if (procedure.getAssignee() == null) {
        throw new ReviewSubmissionException("Cannot submit for review without an assigned user.");
      }

      if (procedure.getReviewers() == null || procedure.getReviewers().isEmpty()) {
        throw new ReviewSubmissionException("Cannot submit for review without assigned reviewers.");
      }

      procedure.setStatus(ProcedureStatus.IN_REVIEW);

      procedure.getReviews().stream()
          .filter(
              review ->
                  review.getReviewStatus() == ReviewStatus.DRAFT
                      || review.getReviewStatus() == ReviewStatus.REJECTED)
          .forEach(review -> review.setReviewStatus(ReviewStatus.PENDING));
    }
  }

  public static class InReviewState implements ProcedureState {
    @Override
    public ProcedureStatus getStatus() {
      return ProcedureStatus.IN_REVIEW;
    }

    public void submitSupervisorReview(
        Procedure procedure,
        Supervisor supervisor,
        String comments,
        BigDecimal grade,
        Boolean approved) {
      // TODO: CERTAMENTE eu deveria implementar testes unitários para este método x2
      Review review =
          procedure
              .getReviewFor(supervisor)
              .orElseThrow(
                  () -> new IllegalStateException("Review not found for the current supervisor"));

      review.setComments(comments);
      review.setGrade(grade);
      review.setReviewStatus(approved ? ReviewStatus.APPROVED : ReviewStatus.REJECTED);

      updateOverallStatus(procedure);
    }

    private void updateOverallStatus(Procedure procedure) {
      if (procedure.allReviewsSubmitted()) {
        if (procedure.allReviewsApproved()) {
          procedure.approve();
        } else {
          procedure.reject();
        }
      }
    }
  }

  public static class CompletedState implements ProcedureState {
    @Override
    public ProcedureStatus getStatus() {
      return ProcedureStatus.COMPLETED;
    }
  }
}

package br.ufal.ic.odontolog.states.procedure;

import br.ufal.ic.odontolog.enums.ProcedureStatus;
import br.ufal.ic.odontolog.models.Procedure;
import br.ufal.ic.odontolog.models.User;

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
    public void assignUser(Procedure procedure, User user) {
      procedure.setAssignee(user);
    }
  }

  public static class InProgressState implements ProcedureState {
    @Override
    public ProcedureStatus getStatus() {
      return ProcedureStatus.IN_PROGRESS;
    }
  }

  public static class InReviewState implements ProcedureState {
    @Override
    public ProcedureStatus getStatus() {
      return ProcedureStatus.IN_REVIEW;
    }
  }

  public static class CompletedState implements ProcedureState {
    @Override
    public ProcedureStatus getStatus() {
      return ProcedureStatus.COMPLETED;
    }
  }
}

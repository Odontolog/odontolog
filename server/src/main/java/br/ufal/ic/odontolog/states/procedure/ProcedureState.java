package br.ufal.ic.odontolog.states.procedure;

import br.ufal.ic.odontolog.enums.ProcedureStatus;
import br.ufal.ic.odontolog.models.Procedure;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.models.User;
import java.math.BigDecimal;
import java.util.Set;

public interface ProcedureState {
  public ProcedureStatus getStatus();

  public default void assignUser(Procedure procedure, User user) {
    throw new UnsupportedOperationException("Operation not allowed in the current state.");
  }

  public default void setReviewers(Procedure procedure, Set<Supervisor> supervisors) {
    throw new UnsupportedOperationException("Operation not allowed in the current state.");
  }

  public default void submitForReview(Procedure procedure) {
    throw new UnsupportedOperationException("Operation not allowed in the current state.");
  }

  public default void submitSupervisorReview(
      Procedure procedure,
      Supervisor supervisor,
      String comments,
      BigDecimal grade,
      Boolean approved) {
    throw new UnsupportedOperationException("Operation not allowed in the current state.");
  }

  public default void startProcedure(Procedure procedure) {
    throw new UnsupportedOperationException("Operation not allowed in the current state.");
  }
}

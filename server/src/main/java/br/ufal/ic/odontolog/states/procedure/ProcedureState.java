package br.ufal.ic.odontolog.states.procedure;

import br.ufal.ic.odontolog.enums.ProcedureStatus;
import br.ufal.ic.odontolog.models.Procedure;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.models.User;
import java.util.Set;

public interface ProcedureState {
  public ProcedureStatus getStatus();

  public default void assignUser(Procedure procedure, User user) {
    throw new UnsupportedOperationException("Operation not allowed in the current state.");
  }

  public default void setReviewers(Procedure procedure, Set<Supervisor> supervisors) {
    throw new UnsupportedOperationException("Operation not allowed in the current state.");
  }
}

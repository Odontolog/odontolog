package br.ufal.ic.odontolog.states.procedure;

import br.ufal.ic.odontolog.enums.ProcedureStatus;
import br.ufal.ic.odontolog.models.Procedure;
import br.ufal.ic.odontolog.models.User;

public interface ProcedureState {
  public ProcedureStatus getStatus();

  public default void assignUser(Procedure procedure, User user) {
    throw new UnsupportedOperationException("Operation not allowed in the current state.");
  }
}

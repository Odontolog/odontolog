package br.ufal.ic.odontolog.states.treatmentPlan;

import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import br.ufal.ic.odontolog.models.User;
import java.util.Set;

public interface TreatmentPlanState {
  public TreatmentPlanStatus getStatus();

  public default void assignUser(TreatmentPlan treatmentPlan, User user) {
    throw new UnsupportedOperationException("Operation not allowed in the current state.");
  }

  public default void submitForReview(TreatmentPlan treatmentPlan) {
    throw new UnsupportedOperationException("Operation not allowed in the current state.");
  }

  public default void setReviewers(TreatmentPlan treatmentPlan, Set<Supervisor> supervisors) {
    throw new UnsupportedOperationException("Operation not allowed in the current state.");
  }
}

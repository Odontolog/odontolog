package br.ufal.ic.odontolog.states.treatmentPlan;

import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
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

      // TODO: Should i create a ActivityLog entry here?
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

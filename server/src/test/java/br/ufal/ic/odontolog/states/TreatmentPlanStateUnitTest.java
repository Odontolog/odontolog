package br.ufal.ic.odontolog.states;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import br.ufal.ic.odontolog.models.TreatmentPlan;
import br.ufal.ic.odontolog.models.User;
import br.ufal.ic.odontolog.states.treatmentPlan.TreatmentPlanState;
import br.ufal.ic.odontolog.states.treatmentPlan.TreatmentPlanStates;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class TreatmentPlanStateUnitTest {
  @Test
  public void givenDraftState_whenAssignUser_thenAssignUser() {
    // Arrange
    TreatmentPlan treatmentPlan = mock(TreatmentPlan.class);
    User user = mock(User.class);

    TreatmentPlanState state = new TreatmentPlanStates.DraftState();

    // Act
    state.assignUser(treatmentPlan, user);

    // Assert
    verify(treatmentPlan).setAssignee(user);
  }

  @Test
  public void givenInProgressState_whenAssignUser_thenThrowException() {
    // Arrange
    TreatmentPlan treatmentPlan = mock(TreatmentPlan.class);
    User user = mock(User.class);

    TreatmentPlanState state = new TreatmentPlanStates.InProgressState();

    // Act and Assert
    assertThrows(UnsupportedOperationException.class, () -> state.assignUser(treatmentPlan, user));
  }

  @Test
  public void givenInReviewState_whenAssignUser_thenThrowException() {
    // Arrange
    TreatmentPlan treatmentPlan = mock(TreatmentPlan.class);
    User user = mock(User.class);

    TreatmentPlanState state = new TreatmentPlanStates.InReviewState();

    // Act and Assert
    assertThrows(UnsupportedOperationException.class, () -> state.assignUser(treatmentPlan, user));
  }

  @Test
  public void givenDoneState_whenAssignUser_thenThrowException() {
    // Arrange
    TreatmentPlan treatmentPlan = mock(TreatmentPlan.class);
    User user = mock(User.class);

    TreatmentPlanState state = new TreatmentPlanStates.DoneState();

    // Act and Assert
    assertThrows(UnsupportedOperationException.class, () -> state.assignUser(treatmentPlan, user));
  }
}

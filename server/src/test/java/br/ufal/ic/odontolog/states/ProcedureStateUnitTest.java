package br.ufal.ic.odontolog.states;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import br.ufal.ic.odontolog.models.Procedure;
import br.ufal.ic.odontolog.models.User;
import br.ufal.ic.odontolog.states.procedure.ProcedureState;
import br.ufal.ic.odontolog.states.procedure.ProcedureStates;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class ProcedureStateUnitTest {
  @Test
  public void givenDraftState_whenAssignUser_thenThrowException() {
    // Arrange
    Procedure procedure = mock(Procedure.class);
    User user = mock(User.class);

    ProcedureState state = new ProcedureStates.DraftState();

    // Act and Assert
    assertThrows(
        UnsupportedOperationException.class,
        () -> {
          state.assignUser(procedure, user);
        });
  }

  @Test
  public void givenNotStartedState_whenAssignUser_thenAssignUser() {
    // Arrange
    Procedure procedure = mock(Procedure.class);
    User user = mock(User.class);

    ProcedureState state = new ProcedureStates.NotStartedState();

    // Act
    state.assignUser(procedure, user);

    // Assert
    verify(procedure).setAssignee(user);
  }

  @Test
  public void givenInProgressState_whenAssignUser_thenThrowException() {
    // Arrange
    Procedure procedure = mock(Procedure.class);
    User user = mock(User.class);

    ProcedureState state = new ProcedureStates.InProgressState();

    // Act and Assert
    assertThrows(
        UnsupportedOperationException.class,
        () -> {
          state.assignUser(procedure, user);
        });
  }

  @Test
  public void givenInReviewState_whenAssignUser_thenThrowException() {
    // Arrange
    Procedure procedure = mock(Procedure.class);
    User user = mock(User.class);

    ProcedureState state = new ProcedureStates.InReviewState();

    // Act and Assert
    assertThrows(
        UnsupportedOperationException.class,
        () -> {
          state.assignUser(procedure, user);
        });
  }

  @Test
  public void givenCompletedState_whenAssignUser_thenThrowException() {
    // Arrange
    Procedure procedure = mock(Procedure.class);
    User user = mock(User.class);

    ProcedureState state = new ProcedureStates.CompletedState();

    // Act and Assert
    assertThrows(
        UnsupportedOperationException.class,
        () -> {
          state.assignUser(procedure, user);
        });
  }
}

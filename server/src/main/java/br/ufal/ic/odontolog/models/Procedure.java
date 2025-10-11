package br.ufal.ic.odontolog.models;

import br.ufal.ic.odontolog.enums.ProcedureStatus;
import br.ufal.ic.odontolog.states.procedure.ProcedureState;
import br.ufal.ic.odontolog.states.procedure.ProcedureStates;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "procedures")
public abstract class Procedure extends Reviewable {
  private Integer plannedSession;

  @ManyToOne
  @JoinColumn(name = "patient_id", nullable = false)
  private Patient patient;

  @Enumerated(EnumType.STRING)
  private ProcedureStatus status;

  @Transient private ProcedureState state;

  @ManyToMany(
      cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
  @JoinTable(
      name = "procedures_attachments",
      joinColumns = @JoinColumn(name = "procedure_id"),
      inverseJoinColumns = @JoinColumn(name = "attachment_id"))
  private final Set<Attachment> attachments = new java.util.HashSet<>();

  // TODO: Improve this, mapping the study sector to a enum.
  private String studySector;

  // TODO: Improve this, mapping the tooth to a enum.
  // TODO: Use ElementCollection instead of this.
  private final Set<String> teeth = new HashSet<>();

  @Embedded private ProcedureDetail procedureDetail;

  public void addTooth(String tooth) {
    this.teeth.add(tooth);
  }

  public abstract String getProcedureType();

  public ProcedureState getState() {
    switch (this.status) {
      case DRAFT:
        return new ProcedureStates.DraftState();
      case NOT_STARTED:
        return new ProcedureStates.NotStartedState();
      case IN_PROGRESS:
        return new ProcedureStates.InProgressState();
      case IN_REVIEW:
        return new ProcedureStates.InReviewState();
      case COMPLETED:
        return new ProcedureStates.CompletedState();
      default:
        throw new IllegalStateException("Unexpected value: " + this.status);
    }
  }

  public void setState(ProcedureState state) {
    this.state = state;
    this.status = state.getStatus();
  }

  @Override
  public void assignUser(User user) {
    this.getState().assignUser(this, user);
  }
}

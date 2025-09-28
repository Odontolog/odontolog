package br.ufal.ic.odontolog.models;

import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import br.ufal.ic.odontolog.states.treatmentPlan.TreatmentPlanState;
import br.ufal.ic.odontolog.states.treatmentPlan.TreatmentPlanStates;
import jakarta.persistence.*;
import java.util.Set;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor()
@Table(name = "treatment_plans")
public class TreatmentPlan extends Reviewable {
  // TODO: Add state machine to manage the status transitions
  // For now, we will just use the enum directly
  @Enumerated(EnumType.STRING)
  private TreatmentPlanStatus status;

  @Transient
  private TreatmentPlanState state;

  @ManyToOne
  @JoinColumn(name = "patient_id", nullable = false)
  private Patient patient;

  @OneToMany(mappedBy = "treatmentPlan", cascade = CascadeType.ALL, orphanRemoval = true)
  private final Set<TreatmentPlanProcedure> procedures = new java.util.HashSet<>();

  public void addProcedure(TreatmentPlanProcedure treatmentPlanProcedure) {
    this.procedures.add(treatmentPlanProcedure);
    treatmentPlanProcedure.setTreatmentPlan(this);
  }

  public TreatmentPlanState getState() {
    switch (this.status) {
      case DRAFT:
        return new TreatmentPlanStates.DraftState();
      case IN_PROGRESS:
        return new TreatmentPlanStates.InProgressState();
      case IN_REVIEW:
        return new TreatmentPlanStates.InReviewState();
      case DONE:
        return new TreatmentPlanStates.DoneState();
      default:
        throw new IllegalStateException("Unexpected value: " + this.status);
    }
  }

  public void setState(TreatmentPlanState state) {
    this.state = state;
    this.status = state.getStatus();
  }
}

package br.ufal.ic.odontolog.models;

import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import jakarta.persistence.*;
import java.util.Set;
import lombok.Builder;
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

  @ManyToOne
  @JoinColumn(name = "patient_id", nullable = false)
  private Patient patient;

  @OneToMany(mappedBy = "treatmentPlan", cascade = CascadeType.ALL, orphanRemoval = true)
  @Builder.Default
  private Set<TreatmentPlanProcedure> procedures = new java.util.HashSet<>();

  public void addProcedure(TreatmentPlanProcedure treatmentPlanProcedure) {
    this.procedures.add(treatmentPlanProcedure);
    treatmentPlanProcedure.setTreatmentPlan(this);
  }
}

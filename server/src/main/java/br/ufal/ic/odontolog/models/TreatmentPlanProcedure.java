package br.ufal.ic.odontolog.models;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
@DiscriminatorValue("TREATMENT_PLAN_PROCEDURE")
public class TreatmentPlanProcedure extends Procedure {
    @ManyToOne
    @JoinColumn(name = "treatment_plan_id")
    @NotNull
    private TreatmentPlan treatmentPlan;
}

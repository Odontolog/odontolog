package br.ufal.ic.odontolog.models;

import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "treatment_plans")
public class TreatmentPlan {
    @Id
    private Long id;

    private TreatmentPlanStatus status;
}

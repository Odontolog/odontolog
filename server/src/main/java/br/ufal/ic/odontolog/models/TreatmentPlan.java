package br.ufal.ic.odontolog.models;

import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor()
@Table(name = "treatment_plans")
public class TreatmentPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TreatmentPlanStatus status;

    @OneToMany(mappedBy = "treatmentPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TreatmentPlanProcedure> procedures = new HashSet<>();

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "reviewable_id", referencedColumnName = "id", nullable = false)
    private Reviewable reviewable;

    public TreatmentPlan(TreatmentPlanStatus status, Reviewable reviewable) {
        this.status = status;
        this.reviewable = reviewable;
    }

    public void addProcedure(TreatmentPlanProcedure treatmentPlanProcedure) {
        this.procedures.add(treatmentPlanProcedure);
        treatmentPlanProcedure.setTreatmentPlan(this);
    }
}

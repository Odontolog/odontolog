package br.ufal.ic.odontolog.repositories;

import br.ufal.ic.odontolog.models.TreatmentPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TreatmentPlanRepository extends JpaRepository<TreatmentPlan, Long> {
}

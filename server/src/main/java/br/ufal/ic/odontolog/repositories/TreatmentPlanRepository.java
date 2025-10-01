package br.ufal.ic.odontolog.repositories;

import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TreatmentPlanRepository extends JpaRepository<TreatmentPlan, Long> {
  List<TreatmentPlan> findByPatient(Patient patient);
}

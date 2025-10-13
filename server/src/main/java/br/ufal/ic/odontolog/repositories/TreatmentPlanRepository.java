package br.ufal.ic.odontolog.repositories;

import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import br.ufal.ic.odontolog.models.TreatmentPlanProcedure;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TreatmentPlanRepository extends JpaRepository<TreatmentPlan, Long> {
  List<TreatmentPlan> findByPatient(Patient patient);

  @Query("SELECT p FROM TreatmentPlanProcedure p WHERE p.treatmentPlan.id = :planId AND p.deleted = false")
  Set<TreatmentPlanProcedure> findActiveProceduresByPlanId(@Param("planId") Long planId);
    
  default Optional<TreatmentPlan> findByIdWithActiveProcedures(Long id) {
      Optional<TreatmentPlan> plan = findById(id);
      
      if (plan.isPresent()) {
          Set<TreatmentPlanProcedure> activeProcedures = findActiveProceduresByPlanId(id);
          plan.get().getProcedures().clear();
          plan.get().getProcedures().addAll(activeProcedures);
      }
      
      return plan;
  }
}

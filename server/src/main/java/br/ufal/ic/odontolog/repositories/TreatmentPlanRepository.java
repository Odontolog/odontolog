package br.ufal.ic.odontolog.repositories;

import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TreatmentPlanRepository extends JpaRepository<TreatmentPlan, Long> {
  List<TreatmentPlan> findByPatient(Patient patient);

  @Query("""
    SELECT tp FROM TreatmentPlan tp
    LEFT JOIN FETCH tp.procedures p
    WHERE tp.id = :id
      AND (p.deleted = false OR p IS NULL)
  """)
  Optional<TreatmentPlan> findByIdWithActiveProcedures(@Param("id") Long id);
}

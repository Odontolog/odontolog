package br.ufal.ic.odontolog.repositories;

import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PatientRepository extends JpaRepository<Patient, Long> {

  @Query(
      """
      SELECT p FROM Patient p
      WHERE (:query IS NULL OR :query = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')))
      ORDER BY p.name
    """)
  Page<Patient> searchPatients(@Param("query") String query, Pageable pageable);

  @Query(
      """
    SELECT tp FROM TreatmentPlan tp
    WHERE tp.patient.id IN :patientIds
      AND tp.createdAt = (
          SELECT MAX(tp2.createdAt)
          FROM TreatmentPlan tp2
          WHERE tp2.patient.id = tp.patient.id
      )
    """)
  List<TreatmentPlan> findLastTreatmentPlans(@Param("patientIds") List<Long> patientIds);

  @Query("SELECT p FROM Patient p WHERE p.deleted = false")
  List<Patient> findAllActive();

  @Query("SELECT p FROM Patient p WHERE p.id = :id AND p.deleted = false")
  Optional<Patient> findActiveById(Long id);
}

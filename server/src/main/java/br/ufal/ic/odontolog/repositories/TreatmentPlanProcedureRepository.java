package br.ufal.ic.odontolog.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufal.ic.odontolog.models.TreatmentPlanProcedure;

public interface TreatmentPlanProcedureRepository extends JpaRepository<TreatmentPlanProcedure, Long> {

}

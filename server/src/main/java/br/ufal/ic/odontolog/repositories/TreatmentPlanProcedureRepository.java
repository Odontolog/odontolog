package br.ufal.ic.odontolog.repositories;

import br.ufal.ic.odontolog.models.TreatmentPlanProcedure;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TreatmentPlanProcedureRepository
    extends JpaRepository<TreatmentPlanProcedure, Long> {}

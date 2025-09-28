package br.ufal.ic.odontolog.mappers;

import br.ufal.ic.odontolog.dtos.TreatmentPlanDTO;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import java.util.List;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TreatmentPlanMapper {
  TreatmentPlanDTO toDTO(TreatmentPlan treatmentPlan);

  List<TreatmentPlanDTO> toDTOs(List<TreatmentPlan> treatmentPlans);
}

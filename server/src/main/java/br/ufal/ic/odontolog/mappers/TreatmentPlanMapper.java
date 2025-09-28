package br.ufal.ic.odontolog.mappers;

import br.ufal.ic.odontolog.dtos.TreatmentPlanDTO;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TreatmentPlanMapper {
  @Mapping(target = "patientId", source = "patient.id")
  TreatmentPlanDTO toDTO(TreatmentPlan treatmentPlan);

  List<TreatmentPlanDTO> toDTOs(List<TreatmentPlan> treatmentPlans);
}

package br.ufal.ic.odontolog.mappers;

import br.ufal.ic.odontolog.dtos.TreatmentPlanDTO;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.MappingInheritanceStrategy;

@Mapper(
    componentModel = "spring",
    mappingInheritanceStrategy = MappingInheritanceStrategy.AUTO_INHERIT_FROM_CONFIG,
    uses = {ProcedureMapper.class, PatientMapper.class, ReviewableMapper.class})
public interface TreatmentPlanMapper {
  TreatmentPlanDTO toDTO(TreatmentPlan treatmentPlan);

  List<TreatmentPlanDTO> toDTOs(List<TreatmentPlan> treatmentPlans);
}

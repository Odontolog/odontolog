package br.ufal.ic.odontolog.mappers;

import br.ufal.ic.odontolog.dtos.TreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanShortDTO;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.MapperConfig;
import org.mapstruct.MappingInheritanceStrategy;

@Mapper(
    componentModel = "spring",
    uses = {ProcedureMapper.class, PatientMapper.class, ReviewableMapper.class})
@MapperConfig(
    componentModel = "spring",
    mappingInheritanceStrategy = MappingInheritanceStrategy.AUTO_INHERIT_FROM_CONFIG)
public interface TreatmentPlanMapper {
  TreatmentPlanDTO toDTO(TreatmentPlan treatmentPlan);

  TreatmentPlanShortDTO toShortDTO(TreatmentPlan treatmentPlan);

  List<TreatmentPlanDTO> toDTOs(List<TreatmentPlan> treatmentPlans);

  List<TreatmentPlanShortDTO> toShortDTOs(List<TreatmentPlan> treatmentPlans);
}

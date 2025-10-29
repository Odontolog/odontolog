package br.ufal.ic.odontolog.mappers;

import br.ufal.ic.odontolog.dtos.anamnese.AnamneseConditionDTO;
import br.ufal.ic.odontolog.models.PatientCondition;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PatientConditionMapper {

  @Mapping(target = "condition", expression = "java(pc.getCondition().name())")
  @Mapping(target = "description", expression = "java(pc.getCondition().getDescription())")
  AnamneseConditionDTO toDTO(PatientCondition pc);
}

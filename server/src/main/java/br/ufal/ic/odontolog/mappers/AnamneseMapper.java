package br.ufal.ic.odontolog.mappers;

import br.ufal.ic.odontolog.dtos.anamnese.AnamneseDTO;
import br.ufal.ic.odontolog.models.Anamnese;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
    componentModel = "spring",
    uses = {PatientConditionMapper.class, AnamneseActivityMapper.class})
public interface AnamneseMapper {

  @Mapping(source = "id", target = "patientId")
  AnamneseDTO toDTO(Anamnese anamnese);
}

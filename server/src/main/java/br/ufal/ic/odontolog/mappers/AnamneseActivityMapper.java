package br.ufal.ic.odontolog.mappers;

import br.ufal.ic.odontolog.dtos.anamnese.AnamneseActivityDTO;
import br.ufal.ic.odontolog.models.AnamneseActivity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
    componentModel = "spring",
    uses = {UserMapper.class})
public interface AnamneseActivityMapper {

  @Mapping(target = "type", expression = "java(deriveUiType(entity))")
  AnamneseActivityDTO toDTO(AnamneseActivity entity);

  default String deriveUiType(AnamneseActivity entity) {
    if (entity == null || entity.getMetadata() == null) return "EDIT_CONDITIONS";
    Object uiType = entity.getMetadata().get("uiType");
    return (uiType instanceof String s) ? s : "EDIT_CONDITIONS";
  }
}

package br.ufal.ic.odontolog.mappers;

import br.ufal.ic.odontolog.dtos.SupervisorDTO;
import br.ufal.ic.odontolog.models.Supervisor;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SupervisorMapper {
  SupervisorDTO toDTO(Supervisor supervisor);
}

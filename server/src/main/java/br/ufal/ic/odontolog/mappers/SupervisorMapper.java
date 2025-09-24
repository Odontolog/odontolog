package br.ufal.ic.odontolog.mappers;

import org.mapstruct.Mapper;

import br.ufal.ic.odontolog.dtos.SupervisorDTO;
import br.ufal.ic.odontolog.models.Supervisor;

@Mapper(componentModel = "spring")
public interface SupervisorMapper {
    SupervisorDTO toDTO(Supervisor supervisor);
}

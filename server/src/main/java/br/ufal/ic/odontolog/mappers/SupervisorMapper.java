package br.ufal.ic.odontolog.mappers;

import br.ufal.ic.odontolog.dtos.SupervisorDTO;
import br.ufal.ic.odontolog.dtos.SupervisorUpdateDTO;
import br.ufal.ic.odontolog.models.Supervisor;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SupervisorMapper {
  SupervisorDTO toDTO(Supervisor supervisor);

  List<SupervisorDTO> toDTOList(List<Supervisor> supervisors);

  Supervisor toEntity(SupervisorUpdateDTO dto, @MappingTarget Supervisor supervisor);
}
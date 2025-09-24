package br.ufal.ic.odontolog.mappers;

import java.util.List;

import org.mapstruct.Mapper;

import br.ufal.ic.odontolog.dtos.ProcedureDTO;
import br.ufal.ic.odontolog.models.Procedure;

@Mapper(componentModel = "spring")
public interface ProcedureMapper {
    ProcedureDTO toDTO(Procedure procedure);

    List<ProcedureDTO> toDTOs(List<Procedure> procedures);
}

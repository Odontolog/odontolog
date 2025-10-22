package br.ufal.ic.odontolog.mappers;

import br.ufal.ic.odontolog.dtos.PreProcedureDTO;
import br.ufal.ic.odontolog.dtos.PreProcedureShortDTO;
import br.ufal.ic.odontolog.models.PreProcedure;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PreProcedureMapper {
  PreProcedureDTO toDTO(PreProcedure preProcedure);

  PreProcedureShortDTO toShortDTO(PreProcedure preProcedure);
}

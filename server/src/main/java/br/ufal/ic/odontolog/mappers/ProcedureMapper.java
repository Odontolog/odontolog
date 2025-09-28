package br.ufal.ic.odontolog.mappers;

import br.ufal.ic.odontolog.dtos.ProcedureDTO;
import br.ufal.ic.odontolog.dtos.ProcedureShortDTO;
import br.ufal.ic.odontolog.models.Procedure;
import java.util.List;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProcedureMapper {
  ProcedureDTO toDTO(Procedure procedure);

  List<ProcedureDTO> toDTOs(List<Procedure> procedures);

  ProcedureShortDTO toShortDTO(Procedure procedure);

  List<ProcedureShortDTO> toShortDTOs(List<Procedure> procedures);
}

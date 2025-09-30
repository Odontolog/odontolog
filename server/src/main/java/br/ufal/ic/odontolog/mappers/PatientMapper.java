package br.ufal.ic.odontolog.mappers;

import br.ufal.ic.odontolog.dtos.PatientShortDTO;
import br.ufal.ic.odontolog.models.Patient;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PatientMapper {
  PatientShortDTO toShortDTO(Patient patient);
}

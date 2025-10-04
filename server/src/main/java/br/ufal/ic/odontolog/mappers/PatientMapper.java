package br.ufal.ic.odontolog.mappers;

import br.ufal.ic.odontolog.dtos.PatientDTO;
import br.ufal.ic.odontolog.dtos.PatientShortDTO;
import br.ufal.ic.odontolog.models.Patient;
import java.util.List;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PatientMapper {
  PatientShortDTO toShortDTO(Patient patient);

  PatientDTO toDTO(Patient patient);

  List<PatientDTO> toDTOList(List<Patient> patients);
}

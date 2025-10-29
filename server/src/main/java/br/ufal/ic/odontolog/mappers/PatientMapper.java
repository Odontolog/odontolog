package br.ufal.ic.odontolog.mappers;

import br.ufal.ic.odontolog.dtos.PatientDTO;
import br.ufal.ic.odontolog.dtos.PatientShortDTO;
import br.ufal.ic.odontolog.dtos.PatientUpsertDTO;
import br.ufal.ic.odontolog.models.Patient;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PatientMapper {
  PatientShortDTO toShortDTO(Patient patient);

  PatientDTO toDTO(Patient patient);

  List<PatientDTO> toDTOList(List<Patient> patients);

  Patient toEntity(PatientUpsertDTO dto);

  void updateEntityFromDto(PatientUpsertDTO dto, @MappingTarget Patient entity);
}

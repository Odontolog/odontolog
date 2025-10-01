package br.ufal.ic.odontolog.mappers;

import java.util.List;
import java.util.Set;

import org.mapstruct.Mapper;

import br.ufal.ic.odontolog.dtos.ActivityDTO;
import br.ufal.ic.odontolog.models.Activity;

@Mapper(componentModel = "spring")
public interface ActivityMapper {
    ActivityDTO toDTO(Activity activity);

    List<ActivityDTO> toDTOs(Set<Activity> activities);
}

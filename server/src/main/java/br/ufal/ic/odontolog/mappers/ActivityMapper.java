package br.ufal.ic.odontolog.mappers;

import br.ufal.ic.odontolog.dtos.ActivityDTO;
import br.ufal.ic.odontolog.models.Activity;
import java.util.List;
import java.util.Set;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ActivityMapper {
  ActivityDTO toDTO(Activity activity);

  List<ActivityDTO> toDTOs(Set<Activity> activities);
}

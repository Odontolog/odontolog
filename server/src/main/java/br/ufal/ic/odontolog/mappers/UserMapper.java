package br.ufal.ic.odontolog.mappers;

import br.ufal.ic.odontolog.dtos.UserResponseDTO;
import br.ufal.ic.odontolog.models.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
  UserResponseDTO toResponseDTO(User user);
}

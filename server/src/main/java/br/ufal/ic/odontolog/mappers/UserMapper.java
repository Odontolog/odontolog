package br.ufal.ic.odontolog.mappers;

import org.mapstruct.Mapper;

import br.ufal.ic.odontolog.dtos.UserResponseDTO;
import br.ufal.ic.odontolog.models.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponseDTO toResponseDTO(User user);
}

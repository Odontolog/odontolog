package br.ufal.ic.odontolog.dtos;

import br.ufal.ic.odontolog.enums.Role;
import br.ufal.ic.odontolog.models.User;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Data
public class UserResponseDTO {
    private UUID id;
    private String name;
    private String email;
    private Role role;
    private String photoUrl;
    private boolean enabled;
}
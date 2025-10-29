package br.ufal.ic.odontolog.dtos;

import br.ufal.ic.odontolog.enums.Role;
import java.util.UUID;
import lombok.Data;

@Data
public class UserResponseDTO {
  private UUID id;
  private String name;
  private String email;
  private Role role;
  private String photoUrl;
  private boolean enabled;
  private boolean firstAccess;
}

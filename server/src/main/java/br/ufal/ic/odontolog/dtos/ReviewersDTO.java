package br.ufal.ic.odontolog.dtos;

import jakarta.validation.constraints.NotEmpty;
import java.util.Set;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewersDTO {

  @NotEmpty(message = "O conjunto de supervisores não pode estar vazio.")
  private Set<UUID> supervisorIds;
}

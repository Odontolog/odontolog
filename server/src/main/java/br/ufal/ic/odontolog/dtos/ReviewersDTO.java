package br.ufal.ic.odontolog.dtos;

import java.util.Set;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewersDTO {
  private Set<UUID> supervisorIds;
}

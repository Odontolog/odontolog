package br.ufal.ic.odontolog.dtos;

import java.util.UUID;
import lombok.Data;

@Data
public class ReviewableAssignUserRequestDTO {
  private UUID userId;
}

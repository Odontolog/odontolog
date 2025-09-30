package br.ufal.ic.odontolog.dtos;

import java.util.UUID;
import lombok.Data;

@Data
public class TreatmentPlanAssignUserRequestDTO {
  private UUID userId;
}

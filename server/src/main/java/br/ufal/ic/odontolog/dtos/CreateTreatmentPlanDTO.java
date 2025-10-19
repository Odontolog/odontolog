package br.ufal.ic.odontolog.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTreatmentPlanDTO {
  @NotNull private Long patientId;
}

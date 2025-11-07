package br.ufal.ic.odontolog.dtos.anamnese;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AnamneseAntecedentsUpsertDTO {
  @NotNull private String antecedents;
}

package br.ufal.ic.odontolog.dtos.anamnese;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AnamneseNotesUpsertDTO {
  @NotNull private String notes;
}

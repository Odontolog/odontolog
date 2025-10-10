package br.ufal.ic.odontolog.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdateProcedureStudySectorDTO {
  @NotNull private String studySector;
}

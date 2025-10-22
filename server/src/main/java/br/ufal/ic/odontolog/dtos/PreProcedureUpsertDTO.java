package br.ufal.ic.odontolog.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PreProcedureUpsertDTO {
  @NotBlank private String name;
}

package br.ufal.ic.odontolog.dtos;

import jakarta.validation.constraints.NotNull;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdateProcedureTeethDTO {
  @NotNull private Set<String> teeth;
}

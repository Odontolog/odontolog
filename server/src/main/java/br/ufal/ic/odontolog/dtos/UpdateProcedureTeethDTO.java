package br.ufal.ic.odontolog.dtos;

import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdateProcedureTeethDTO {
  private Set<String> teeth;
}

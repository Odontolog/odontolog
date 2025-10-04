package br.ufal.ic.odontolog.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Data;

@Data
public class ProcedureUpsertDTO {
  @NotBlank private String name;

  // Matches front "tooth" array; we keep the same name for payload compatibility
  @NotNull @NotEmpty private List<String> tooth;

  @NotNull
  @Min(0)
  private Integer plannedSession;

  @NotBlank private String studySector;
}

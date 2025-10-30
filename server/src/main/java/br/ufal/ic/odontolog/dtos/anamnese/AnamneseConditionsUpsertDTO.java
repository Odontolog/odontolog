package br.ufal.ic.odontolog.dtos.anamnese;

import br.ufal.ic.odontolog.enums.ClinicalCondition;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Data;

@Data
public class AnamneseConditionsUpsertDTO {
  @NotNull private List<ConditionUpsertItem> conditions;

  @Data
  public static class ConditionUpsertItem {
    @NotNull private ClinicalCondition condition;
    @NotNull private Boolean hasCondition;
    @NotNull private String notes;
  }
}

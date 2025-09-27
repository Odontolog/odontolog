package br.ufal.ic.odontolog.dtos;

import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class TreatmentPlanDTO extends ReviewableDTO {
  private TreatmentPlanStatus status;
}

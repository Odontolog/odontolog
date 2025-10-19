package br.ufal.ic.odontolog.dtos;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class TreatmentPlanProcedureDTO extends ProcedureDTO {
  private Long treatmentPlanId;
}

package br.ufal.ic.odontolog.dtos;

import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class TreatmentPlanDTO extends ReviewableDTO {
  private TreatmentPlanStatus status;
  private UUID patientId;
}

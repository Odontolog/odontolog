package br.ufal.ic.odontolog.dtos;

import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import java.util.List;
import lombok.*;

@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class TreatmentPlanDTO extends ReviewableDTO {
  private TreatmentPlanStatus status;
  private List<ProcedureShortDTO> procedures;
}

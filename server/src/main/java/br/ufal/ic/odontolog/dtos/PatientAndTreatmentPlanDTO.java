package br.ufal.ic.odontolog.dtos;

import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientAndTreatmentPlanDTO {
  private Long id;
  private String avatarUrl;
  private String name;
  private Long lastTreatmentPlanId;
  private TreatmentPlanStatus lastTreatmentPlanStatus;
  private Instant lastTreatmentPlanUpdatedAt;
}

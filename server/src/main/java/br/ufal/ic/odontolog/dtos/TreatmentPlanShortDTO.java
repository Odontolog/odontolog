package br.ufal.ic.odontolog.dtos;

import br.ufal.ic.odontolog.enums.ReviewableType;
import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import br.ufal.ic.odontolog.models.User;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeName;
import java.time.Instant;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@JsonTypeName("TREATMENT_PLAN")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "@type")
@NoArgsConstructor
public class TreatmentPlanShortDTO extends ReviewableShortDTO {
  private Long id;
  private TreatmentPlanStatus status;
  private User assignee;
  private PatientShortDTO patient;
  private Instant createdAt;
  private Instant updatedAt;
  private String notes;
  private ReviewableType type;
}

package br.ufal.ic.odontolog.dtos;

import br.ufal.ic.odontolog.enums.ProcedureStatus;
import br.ufal.ic.odontolog.enums.ProcedureType;
import br.ufal.ic.odontolog.models.Attachment;
import br.ufal.ic.odontolog.models.ProcedureDetail;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import java.util.Set;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "@type")
@JsonSubTypes({
  @JsonSubTypes.Type(value = TreatmentPlanProcedureDTO.class, name = "TREATMENT_PLAN_PROCEDURE"),
  @JsonSubTypes.Type(value = PreProcedureDTO.class, name = "PRE_PROCEDURE")
})
public class ProcedureDTO extends ReviewableDTO {
  private Integer plannedSession;
  private ProcedureStatus status;
  private String studySector;
  private Set<Attachment> attachments;
  private Set<String> teeth;
  private ProcedureDetail procedureDetail;
  private ProcedureType procedureType;
}

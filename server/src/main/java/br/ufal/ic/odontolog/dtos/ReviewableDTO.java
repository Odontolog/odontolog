package br.ufal.ic.odontolog.dtos;

import br.ufal.ic.odontolog.enums.ReviewableType;
import br.ufal.ic.odontolog.models.User;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import lombok.Data;

@Data
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "@type")
@JsonSubTypes({
    @JsonSubTypes.Type(value = TreatmentPlanDTO.class, name = "TREATMENT_PLAN"),
    @JsonSubTypes.Type(value = ProcedureDTO.class, name = "PROCEDURE")
})
public class ReviewableDTO {
  private Long id;
  private String name;
  private ReviewableType type;
  private User author;
  private User assignee;
  private Instant createdAt;
  private Instant updatedAt;
  private List<ReviewDTO> reviews;
  private Set<SupervisorDTO> reviewers;
  private String notes;
  private List<ActivityDTO> history;
}

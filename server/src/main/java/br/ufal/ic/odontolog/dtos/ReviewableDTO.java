package br.ufal.ic.odontolog.dtos;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import br.ufal.ic.odontolog.enums.ReviewableType;
import br.ufal.ic.odontolog.models.User;
import lombok.Data;

@Data
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "@type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = TreatmentPlanDTO.class, name = "TREATMENT_PLAN"),
        @JsonSubTypes.Type(value = ProcedureDTO.class, name = "PROCEDURE")
})
public class ReviewableDTO {
    private ReviewableType type;
    private UUID id;
    private User author;
    private User assignee;
    private Instant createdAt;
    private Instant updatedAt;
    private List<ReviewDTO> reviews;
    private String notes;
    private List<ActivityDTO> history;
}

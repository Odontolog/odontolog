package br.ufal.ic.odontolog.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewableSubmitSupervisorReviewDTO {
  @NotNull private String comments;

  @NotNull private Integer grade;

  @NotNull private Boolean approved;
}

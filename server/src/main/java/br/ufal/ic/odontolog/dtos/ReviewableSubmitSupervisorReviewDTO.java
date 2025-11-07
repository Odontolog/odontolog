package br.ufal.ic.odontolog.dtos;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.Data;

@Data
public class ReviewableSubmitSupervisorReviewDTO {
  @NotNull private String comments;

  @NotNull private BigDecimal grade;

  @NotNull private Boolean approved;
}

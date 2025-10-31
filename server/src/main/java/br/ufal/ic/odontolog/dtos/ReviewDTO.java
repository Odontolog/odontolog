package br.ufal.ic.odontolog.dtos;

import br.ufal.ic.odontolog.enums.ReviewStatus;
import br.ufal.ic.odontolog.models.Supervisor;
import lombok.Data;

@Data
public class ReviewDTO {
  private Long id;
  private String comments;
  private Float grade;
  private ReviewStatus reviewStatus;
  private Supervisor supervisor;
}

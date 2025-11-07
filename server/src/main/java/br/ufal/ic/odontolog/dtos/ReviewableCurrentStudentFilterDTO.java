package br.ufal.ic.odontolog.dtos;

import lombok.Data;

@Data
public class ReviewableCurrentStudentFilterDTO {
  private String name;
  private Boolean isInReview;
}

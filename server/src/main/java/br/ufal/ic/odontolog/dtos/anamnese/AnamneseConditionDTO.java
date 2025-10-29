package br.ufal.ic.odontolog.dtos.anamnese;

import lombok.Data;

@Data
public class AnamneseConditionDTO {
  private Long id;
  private String condition;
  private String description;
  private String category;
  private Boolean hasCondition;
  private String notes;
}

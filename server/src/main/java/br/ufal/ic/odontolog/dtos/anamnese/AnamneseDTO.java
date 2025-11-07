package br.ufal.ic.odontolog.dtos.anamnese;

import java.util.List;
import lombok.Data;

@Data
public class AnamneseDTO {
  private Long patientId;
  private String mainComplaint;
  private String historyOfPresentIllness;
  private String antecedents;
  private String notes;
  private List<AnamneseActivityDTO> history;
  private List<AnamneseConditionDTO> conditions;
}

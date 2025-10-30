package br.ufal.ic.odontolog.models;

import br.ufal.ic.odontolog.enums.ClinicalCondition;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "patient_conditions")
public class PatientCondition {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "anamnese_id", nullable = false)
  private Anamnese anamnese;

  @Enumerated(EnumType.STRING)
  private ClinicalCondition condition;

  private String notes;

  private String category;

  private Boolean hasCondition;
}

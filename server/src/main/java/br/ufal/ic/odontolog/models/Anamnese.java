package br.ufal.ic.odontolog.models;

import jakarta.persistence.*;
import java.util.Set;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor()
@Table(name = "anamneses")
public class Anamnese {
  @Id private Long id;

  @OneToOne
  @MapsId
  @JoinColumn(name = "id")
  private Patient patient;

  private String notes;

  @OneToMany(
      mappedBy = "anamnese",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  @Builder.Default
  private Set<AnamneseActivity> history = new java.util.HashSet<>();

  @OneToMany(
      mappedBy = "anamnese",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  @Builder.Default
  private Set<PatientCondition> conditions = new java.util.HashSet<>();
}

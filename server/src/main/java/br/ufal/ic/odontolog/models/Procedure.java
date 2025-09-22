package br.ufal.ic.odontolog.models;

import br.ufal.ic.odontolog.enums.ProcedureStatus;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "procedures")
public abstract class Procedure extends Reviewable {
  private String name;
  private Integer planned_session;

  @ManyToOne
  @JoinColumn(name = "patient_id", nullable = false)
  private Patient patient;

  // TODO: Add state machine to manage the status transitions
  // For now, we will just use the enum directly
  @Enumerated(EnumType.STRING)
  private ProcedureStatus status;

  @ManyToMany(
      cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
  @JoinTable(
      name = "procedures_attachments",
      joinColumns = @JoinColumn(name = "procedure_id"),
      inverseJoinColumns = @JoinColumn(name = "attachment_id"))
  private final Set<Attachment> attachments = new java.util.HashSet<>();

  // TODO: Improve this, mapping the study sector to a enum.
  private String studySector;

  // TODO: Improve this, mapping the tooth to a enum.
  // TODO: Use ElementCollection instead of this.
  private final Set<String> teeth = new HashSet<>();

  @Embedded private ProcedureDetail procedureDetail;
}

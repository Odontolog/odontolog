package br.ufal.ic.odontolog.models;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import java.util.Set;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class Supervisor extends User {
  String specialization;

  // TODO: Add supervisor's SIAPE validation
  String siape;

  @ManyToMany
  @JoinTable(
      name = "users_reviewables",
      joinColumns = @JoinColumn(name = "supervisor_id"),
      inverseJoinColumns = @JoinColumn(name = "reviewables_id"))
  Set<Reviewable> reviewables;
}

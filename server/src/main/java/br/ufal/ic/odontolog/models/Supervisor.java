package br.ufal.ic.odontolog.models;

import br.ufal.ic.odontolog.enums.Role;
import jakarta.persistence.Entity;
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
  Set<Reviewable> reviewables;
}

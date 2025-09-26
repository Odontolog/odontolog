package br.ufal.ic.odontolog.models;

import br.ufal.ic.odontolog.enums.Role;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import java.util.Set;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Supervisor extends User {
  String specialization;

  // TODO: Add supervisor's SIAPE validation
  String siape;

  @ManyToMany Set<Reviewable> reviewables;

  public Supervisor(
      String name, String email, String password, String specialization, String siape) {
    super(name, email, password, Role.SUPERVISOR);
    this.specialization = specialization;
    this.siape = siape;
  }
}

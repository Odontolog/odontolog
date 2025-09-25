package br.ufal.ic.odontolog.models;

import br.ufal.ic.odontolog.enums.Role;
import jakarta.persistence.Entity;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Supervisor extends User {
  String specialization;

  // TODO: Add supervisor's SIAPE validation
  String siape;

  public Supervisor(
      String name, String email, String password, String specialization, String siape, String photoUrl) {
    super(name, email, password, Role.SUPERVISOR, photoUrl);
    this.specialization = specialization;
    this.siape = siape;
  }
}

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

    public Supervisor(String name, String email, String specialization, String siape) {
        super(name, email, Role.SUPERVISOR);
        this.specialization = specialization;
        this.siape = siape;
    }
}

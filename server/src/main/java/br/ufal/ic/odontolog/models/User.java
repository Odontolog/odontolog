package br.ufal.ic.odontolog.models;

import br.ufal.ic.odontolog.enums.Role;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {
    // TODO: Add UserDetails and other Spring Security related fields
    @Id
    private Long id;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String name;
    private String email;
}

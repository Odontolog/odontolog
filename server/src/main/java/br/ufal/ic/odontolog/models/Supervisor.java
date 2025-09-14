package br.ufal.ic.odontolog.models;

import jakarta.persistence.Entity;
import lombok.Data;

@Entity
@Data
public class Supervisor extends User {
    String specialization;
    String siape;
}

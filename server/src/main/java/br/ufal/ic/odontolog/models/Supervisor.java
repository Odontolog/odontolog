package br.ufal.ic.odontolog.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
public class Supervisor extends User {
    String specialization;
    String siape;
}

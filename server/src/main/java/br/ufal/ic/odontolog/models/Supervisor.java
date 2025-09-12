package br.ufal.ic.odontolog.models;

import jakarta.persistence.Entity;

@Entity
public class Supervisor extends User {
    String specialization;
    String siape;
}

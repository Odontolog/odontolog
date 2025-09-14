package br.ufal.ic.odontolog.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Reviewable {
    @Id
    private Long id;


}

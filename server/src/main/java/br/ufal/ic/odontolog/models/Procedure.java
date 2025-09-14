package br.ufal.ic.odontolog.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Entity
@Data
public class Procedure {
    @Id
    private Long id;
    private String name;

    @OneToOne
    @JoinColumn(name = "reviewable_id", referencedColumnName = "id")
    private Reviewable reviewable;
}

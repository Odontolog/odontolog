package br.ufal.ic.odontolog.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class Review {
    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name = "reviewable_id", nullable = false)
    private Reviewable reviewable;
}

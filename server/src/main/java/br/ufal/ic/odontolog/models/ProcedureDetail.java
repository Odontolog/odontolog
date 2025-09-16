package br.ufal.ic.odontolog.models;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProcedureDetail {
    private String diagnostic;

    // This entity is not mapped to a table
    // It is used to store the details of a procedure
    // Probably will have more fields in the future.
}

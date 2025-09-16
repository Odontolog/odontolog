package br.ufal.ic.odontolog.models;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
// @DiscriminatorValue("PRE_PROCEDURE")
@Table(name = "pre_procedures")
public class PreProcedure extends Procedure {
    //
}

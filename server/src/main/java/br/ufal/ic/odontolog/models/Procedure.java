package br.ufal.ic.odontolog.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

import br.ufal.ic.odontolog.enums.ProcedureStatus;
import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "procedures")
// @DiscriminatorColumn(name = "type", discriminatorType =
// DiscriminatorType.STRING)
public abstract class Procedure extends Reviewable {
        private String name;
        private Integer planned_session;

        // TODO: Add state machine to manage the status transitions
        // For now, we will just use the enum directly
        @Enumerated(EnumType.STRING)
        private ProcedureStatus status;

        @ManyToMany(cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH })
        @JoinTable(name = "procedures_attachments", joinColumns = @JoinColumn(name = "procedure_id"), inverseJoinColumns = @JoinColumn(name = "attachment_id"))
        private final Set<Attachment> attachments = new java.util.HashSet<>();

        // TODO: Improve this, mapping the study sector to a enum.
        private String studySector;

        // TODO: Improve this, mapping the tooth to a enum.
        // TODO: Use ElementCollection instead of this.
        private final Set<String> teeth = new HashSet<>();

        @Embedded
        private ProcedureDetail procedureDetail;
}

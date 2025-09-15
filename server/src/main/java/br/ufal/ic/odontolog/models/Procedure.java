package br.ufal.ic.odontolog.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@DiscriminatorColumn(name = "type",
        discriminatorType = DiscriminatorType.STRING)
public abstract class Procedure {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Integer planned_session;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "reviewable_id", referencedColumnName = "id", nullable = false)
    private Reviewable reviewable;

    @ManyToMany(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinTable(
            name = "procedures_attachments",
            joinColumns = @JoinColumn(name = "procedure_id"),
            inverseJoinColumns = @JoinColumn(name = "attachment_id")
    )
    private Set<Attachment> attachments = new HashSet<>();

    // TODO: Improve this, mapping the study sector to a enum.
    private String studySector;

    // TODO: Improve this, mapping the tooth to a enum.
    // TODO: Use ElementCollection instead of this.
    private Set<String> tooth = new HashSet<>();

    @Embedded
    private ProcedureDetail procedureDetail;
}

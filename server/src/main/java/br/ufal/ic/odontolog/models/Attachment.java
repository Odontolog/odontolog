package br.ufal.ic.odontolog.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;


@Entity
@Data
@NoArgsConstructor
@SuperBuilder
public class Attachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;

    // TODO: Probably we must use a URL instead of a String
    // using String for now.
    private String location;

    @ManyToOne
    @JoinColumn(name = "uploader_id")
    private User uploader;

    // Size in bytes
    private Integer size;
}

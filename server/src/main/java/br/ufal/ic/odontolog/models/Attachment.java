package br.ufal.ic.odontolog.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
@Table(name = "attachments")
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

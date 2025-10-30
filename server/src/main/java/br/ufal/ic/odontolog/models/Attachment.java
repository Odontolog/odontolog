package br.ufal.ic.odontolog.models;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;

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
  private String filetype;
  private String location;
  private String objectKey;
  private String description;

  @ManyToOne
  @JoinColumn(name = "uploader_id")
  private User uploader;

  @CreationTimestamp private Instant createdAt;

  // Size in bytes
  private Integer size;

  @ManyToOne
  @JoinColumn(name = "patient_id")
  private Patient patient;
}

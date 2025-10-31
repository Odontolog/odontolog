package br.ufal.ic.odontolog.models;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "patient_permissions")
@SQLRestriction("active = true")
public class PatientPermission {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "student_id")
  private Student student;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "patient_id")
  private Patient patient;

  private Instant grantedAt;

  private Instant revokedAt;

  @Column(name = "active", nullable = false)
  private boolean active = true;
}

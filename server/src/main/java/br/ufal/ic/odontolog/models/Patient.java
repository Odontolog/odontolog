package br.ufal.ic.odontolog.models;

import br.ufal.ic.odontolog.enums.Ethnicity;
import br.ufal.ic.odontolog.enums.MaritalStatus;
import br.ufal.ic.odontolog.enums.Sex;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor()
@Table(name = "patients")
public class Patient {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  private String address;

  // TODO: Add validation for CPF
  private String CPF;

  private String avatarUrl;

  // TODO: Add validation for phone number
  private String phoneNumber;

  // TODO: Add validation for RG
  private String RG;

  private String city;
  private String state;

  @Enumerated(EnumType.STRING)
  private Ethnicity ethnicity;

  // TODO: This must be Sex or Gender?
  @Enumerated(EnumType.STRING)
  private Sex sex;

  private LocalDate birthDate;

  @Enumerated(EnumType.STRING)
  private MaritalStatus maritalStatus;

  private String occupation;

  @OneToMany(mappedBy = "patient")
  private final Set<TreatmentPlan> treatmentPlans = new HashSet<>();

  @OneToMany(mappedBy = "patient")
  private final Set<Procedure> procedures = new HashSet<>();

  private LocalDate appointmentDate;

  @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
  private final Set<Attachment> attachments = new HashSet<>();

  public void addAttachment(Attachment attachment) {
    attachment.setPatient(this);
    this.attachments.add(attachment);
  }

  @Column(nullable = false)
  private boolean deleted = false;

  public void softDelete() {
    this.deleted = true;
  }
}

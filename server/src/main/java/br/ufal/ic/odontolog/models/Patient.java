package br.ufal.ic.odontolog.models;

import br.ufal.ic.odontolog.enums.MaritalStatus;
import br.ufal.ic.odontolog.enums.Sex;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor()
@Table(name = "patients")
public class Patient {
  @Id @GeneratedValue @UuidGenerator private UUID id;
  private String name;
  private String address;

  // TODO: Add validation for CPF
  private String CPF;

  // TODO: Add validation for phone number
  private String phoneNumber;

  // TODO: Add validation for RG
  private String RG;

  private String city;
  private String state;
  private String race;

  // TODO: This must be Sex or Gender?
  @Enumerated(EnumType.STRING)
  private Sex sex;

  private String birthDate;

  @Enumerated(EnumType.STRING)
  private MaritalStatus maritalStatus;

  private String profession;

  @OneToMany(mappedBy = "patient")
  private final Set<TreatmentPlan> treatmentPlans = new HashSet<>();

  @OneToMany(mappedBy = "patient")
  private final Set<Procedure> procedures = new HashSet<>();
}

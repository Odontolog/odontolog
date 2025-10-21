package br.ufal.ic.odontolog.models;

import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class Student extends User {
  Integer clinicNumber;
  String enrollmentCode;
  Integer enrollmentYear;
  Integer enrollmentSemester;
}

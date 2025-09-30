package br.ufal.ic.odontolog.models;

import br.ufal.ic.odontolog.enums.Role;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Student extends User {
  final Role role = Role.STUDENT;
  int clinicNumber;
  String enrollmentCode;
  int enrollmentYear;
  int enrollmentSemester;
}

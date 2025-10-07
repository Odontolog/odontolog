package br.ufal.ic.odontolog.dtos;

import java.util.UUID;
import lombok.Data;

@Data
public class StudentDTO {
  private UUID id;
  private String email;
  private String name;
  private int clinicNumber;
  private String enrollmentCode;
  private int enrollmentYear;
  private int enrollmentSemester;
  private String avatarUrl;
}

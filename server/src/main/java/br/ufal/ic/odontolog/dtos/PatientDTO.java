package br.ufal.ic.odontolog.dtos;

import java.time.LocalDate;

import br.ufal.ic.odontolog.enums.MaritalStatus;
import br.ufal.ic.odontolog.enums.Sex;
import lombok.Data;

@Data
public class PatientDTO {
  private Long id;
  private String name;
  private String address;
  private String avatarUrl;
  private String CPF;
  private String phoneNumber;
  private String RG;
  private String city;
  private String state;
  private String race;
  private Sex sex;
  private LocalDate birthDate;
  private MaritalStatus maritalStatus;
  private String profession;
}

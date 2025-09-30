package br.ufal.ic.odontolog.dtos;

import br.ufal.ic.odontolog.enums.MaritalStatus;
import br.ufal.ic.odontolog.enums.Sex;
import java.util.List;
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
  private String birthDate;
  private MaritalStatus maritalStatus;
  private String profession;
}

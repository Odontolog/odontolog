package br.ufal.ic.odontolog.dtos;

import br.ufal.ic.odontolog.enums.Ethnicity;
import br.ufal.ic.odontolog.enums.MaritalStatus;
import br.ufal.ic.odontolog.enums.Sex;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.Data;

@Data
public class PatientUpsertDTO {

  @NotBlank private String name;

  private String address;

  private String avatarUrl;

  @NotBlank private String CPF;

  private String phoneNumber;

  private String RG;

  private String city;
  private String state;

  @NotNull private Ethnicity ethnicity;

  @NotNull private Sex sex;

  @NotNull private LocalDate birthDate;

  private MaritalStatus maritalStatus;

  private String occupation;
}

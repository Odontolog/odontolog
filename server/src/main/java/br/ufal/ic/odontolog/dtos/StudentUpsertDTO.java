package br.ufal.ic.odontolog.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StudentUpsertDTO {

  @NotBlank private String name;

  @NotBlank @Email private String email;

  @NotNull private Integer clinicNumber;

  @NotBlank private String enrollmentCode;

  @NotNull private Integer enrollmentYear;

  @NotNull private Integer enrollmentSemester;

  private String photoUrl;
}

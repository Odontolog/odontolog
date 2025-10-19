package br.ufal.ic.odontolog.dtos;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SupervisorUpdateDTO {

  @NotBlank(message = "Must have a name")
  private String name;

  @NotBlank(message = "Must have a specialization")
  private String specialization;
}

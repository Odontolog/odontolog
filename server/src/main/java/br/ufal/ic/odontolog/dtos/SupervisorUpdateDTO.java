<<<<<<< HEAD
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
=======
package br.ufal.ic.odontolog.dtos;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SupervisorUpdateDTO {

  @NotBlank(message = "Nome é obrigatório")
  private String name;

  @NotBlank(message = "Especialização é obrigatória")
  private String specialization;
}
>>>>>>> c5fa9efc8db75c6416a3bd8457b6600d7a225ad4

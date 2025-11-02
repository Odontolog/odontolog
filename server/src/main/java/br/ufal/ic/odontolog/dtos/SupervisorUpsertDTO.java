package br.ufal.ic.odontolog.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SupervisorUpsertDTO {

  @NotBlank private String name;

  @NotBlank @Email private String email;

  @NotBlank private String specialization;

  @NotBlank private String siape;

  private String photoUrl;
}

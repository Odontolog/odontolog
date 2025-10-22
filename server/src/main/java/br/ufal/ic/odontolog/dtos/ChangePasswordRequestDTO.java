// ...new file...
package br.ufal.ic.odontolog.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ChangePasswordRequestDTO {
  @NotBlank(message = "Necessário ter uma nova senha ")
  @Size(min = 6, message = "A senha precisa ter ao menos 6 caracteres")
  private String newPassword;

  @NotBlank(message = "Necessário ter a confirmação da nova senha")
  private String confirmPassword;
}

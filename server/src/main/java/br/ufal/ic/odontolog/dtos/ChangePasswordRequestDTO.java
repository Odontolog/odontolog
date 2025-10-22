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
  @NotBlank(message = "newPassword is required")
  @Size(min = 6, message = "password must be at least 6 characters")
  private String newPassword;

  @NotBlank(message = "confirmPassword is required")
  private String confirmPassword;
}

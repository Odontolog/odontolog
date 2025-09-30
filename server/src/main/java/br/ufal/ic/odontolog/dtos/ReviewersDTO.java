<<<<<<< HEAD
package br.ufal.ic.odontolog.dtos;

import jakarta.validation.constraints.NotEmpty;
import java.util.Set;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewersDTO {

    @NotEmpty(message = "The supervisor set cannot be empty.")
    private Set<UUID> supervisorIds;
}
=======
package br.ufal.ic.odontolog.dtos;

import jakarta.validation.constraints.NotEmpty;
import java.util.Set;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewersDTO {

  @NotEmpty(message = "O conjunto de supervisores não pode estar vazio.")
  private Set<UUID> supervisorIds;
}
>>>>>>> c5fa9efc8db75c6416a3bd8457b6600d7a225ad4

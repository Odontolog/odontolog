package br.ufal.ic.odontolog.dtos;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddReviewersDTO {

    @NotEmpty(message = "A lista de supervisores não pode estar vazia.")
    private List<UUID> supervisorIds;
}

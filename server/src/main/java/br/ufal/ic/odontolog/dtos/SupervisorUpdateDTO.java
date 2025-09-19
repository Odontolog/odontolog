package br.ufal.ic.odontolog.dtos;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
public class SupervisorUpdateDTO {

    @NotBlank(message = "Nome é obrigatório")
    private String name;
}
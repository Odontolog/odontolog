package br.ufal.ic.odontolog.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SupervisorResponseDTO {
    private String id;
    private String name;
    private String email;
    private String photoUrl;
}

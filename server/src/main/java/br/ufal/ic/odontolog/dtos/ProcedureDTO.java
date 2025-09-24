package br.ufal.ic.odontolog.dtos;

import br.ufal.ic.odontolog.enums.ProcedureStatus;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ProcedureDTO extends ReviewableDTO {
    private ProcedureStatus status;
}

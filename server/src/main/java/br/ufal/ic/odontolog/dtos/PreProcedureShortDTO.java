package br.ufal.ic.odontolog.dtos;

import br.ufal.ic.odontolog.enums.ProcedureStatus;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class PreProcedureShortDTO extends ProcedureShortDTO {
//    private Long id;
//    private ProcedureStatus status;
//    private String name;
//    private String notes;
//    private UserResponseDTO assignee;
//    private PatientShortDTO patient;
//    private Instant updatedAt;
//    private Boolean deleted;
}

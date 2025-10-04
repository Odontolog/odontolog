package br.ufal.ic.odontolog.dtos;

import br.ufal.ic.odontolog.enums.ProcedureStatus;
import java.time.Instant;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcedureShortDTO extends ReviewableShortDTO {
  private Long id;
  private ProcedureStatus status;
  private String name;
  private String studySector;
  private int plannedSession;
  private UserResponseDTO assignee;
  private PatientShortDTO patient;
  private List<String> teeth;
  private Instant updatedAt;
  private List<ReviewDTO> reviews;
  private String notes;
  private String type;
  private String procedureType;
}

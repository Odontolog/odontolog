package br.ufal.ic.odontolog.dtos.anamnese;

import br.ufal.ic.odontolog.dtos.UserResponseDTO;
import java.time.Instant;
import java.util.Map;
import lombok.Data;

@Data
public class AnamneseActivityDTO {
  private Long id;
  // We are mapping it MANUAL
  // Frontend expects EDIT_NOTES or EDIT_CONDITIONS
  private String type;
  private UserResponseDTO actor;
  private String description;
  private Map<String, Object> metadata;
  private Instant createdAt;
}

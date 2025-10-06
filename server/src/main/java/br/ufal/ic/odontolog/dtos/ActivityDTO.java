package br.ufal.ic.odontolog.dtos;

import br.ufal.ic.odontolog.enums.ActivityType;
import br.ufal.ic.odontolog.models.User;
import java.time.Instant;
import java.util.HashMap;
import lombok.Data;

@Data
public class ActivityDTO {
  private Long id;
  private ActivityType type;
  private User actor;
  private String description;
  private HashMap<String, Object> metadata;
  private Instant createdAt;
}

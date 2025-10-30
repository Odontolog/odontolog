package br.ufal.ic.odontolog.models;

import br.ufal.ic.odontolog.enums.ActivityType;
import java.time.Instant;
import java.util.Map;

public interface GenericActivity {
  Long getId();

  ActivityType getType();

  User getActor();

  String getDescription();

  Instant getCreatedAt();

  Map<String, Object> getMetadata();
}

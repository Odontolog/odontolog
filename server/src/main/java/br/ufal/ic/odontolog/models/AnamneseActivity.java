package br.ufal.ic.odontolog.models;

import br.ufal.ic.odontolog.enums.ActivityType;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.Map;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "anamnese_activities")
public class AnamneseActivity implements GenericActivity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Enumerated(EnumType.STRING)
  private ActivityType type;

  @ManyToOne
  @JoinColumn(name = "actor_id")
  private User actor;

  @ManyToOne
  @JoinColumn(name = "anamnese_id")
  private Anamnese anamnese;

  private String description;

  // TODO: Improve this approach to store metadata, correctly mapping based on the
  // type of activity.
  // Also see https://www.baeldung.com/java-jackson-polymorphic-deserialization
  // and https://www.baeldung.com/hibernate-persist-json-object
  @JdbcTypeCode(SqlTypes.JSON)
  @Column(columnDefinition = "jsonb") // PostgreSQL specific setting
  private Map<String, Object> metadata;

  @CreationTimestamp private Instant createdAt;
}

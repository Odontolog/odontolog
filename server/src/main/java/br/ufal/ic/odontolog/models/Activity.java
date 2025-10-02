package br.ufal.ic.odontolog.models;

import br.ufal.ic.odontolog.enums.ActivityType;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.HashMap;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@Table(name = "activities")
public class Activity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Enumerated(EnumType.STRING)
  private ActivityType type;

  @ManyToOne
  @JoinColumn(name = "actor_id")
  private User actor;

  @ManyToOne
  @JoinColumn(name = "reviewable_id")
  private Reviewable reviewable;

  private String description;

  // TODO: Improve this approach to store metadata, correctly mapping based on the
  // type of activity.
  // Also see https://www.baeldung.com/java-jackson-polymorphic-deserialization
  // and https://www.baeldung.com/hibernate-persist-json-object
  @JdbcTypeCode(SqlTypes.JSON)
  @Column(columnDefinition = "jsonb") // PostgreSQL specific setting
  private HashMap<String, Object> metadata;

  @CreationTimestamp private Instant createdAt;
}

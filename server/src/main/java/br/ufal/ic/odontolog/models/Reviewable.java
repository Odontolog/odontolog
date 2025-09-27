package br.ufal.ic.odontolog.models;

import br.ufal.ic.odontolog.enums.ReviewableType;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

@Getter
@Setter
@Entity
@SuperBuilder
@NoArgsConstructor()
@Table(name = "reviewables")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Reviewable {
  @Id @GeneratedValue @UuidGenerator private UUID id;

  @ManyToOne
  @JoinColumn(name = "author_id")
  private User author;

  private String name;

  @ManyToOne
  @JoinColumn(name = "assignee_id")
  private User assignee;

  @ManyToMany private Set<Supervisor> reviewers;

  @CreationTimestamp private Instant createdAt;

  @UpdateTimestamp private Instant updatedAt;

  // FIXME: I don't know if this cascade type is correct. Check if this is
  // necessary.
  // Or if I should use CascadeType.PERSIST only.
  @OneToMany(
      mappedBy = "reviewable",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private final Set<Review> reviews = new java.util.HashSet<>();

  private String notes;

  @OneToMany(
      mappedBy = "reviewable",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private final Set<Activity> history = new java.util.HashSet<>();

  @Enumerated(EnumType.STRING)
  private ReviewableType type;

  public void addReview(Review review) {
    this.reviews.add(review);
    review.setReviewable(this);
  }
}

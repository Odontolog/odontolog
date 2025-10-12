package br.ufal.ic.odontolog.models;

import br.ufal.ic.odontolog.enums.ReviewStatus;
import br.ufal.ic.odontolog.enums.ReviewableType;
import jakarta.persistence.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.*;

@Getter
@Setter
@Entity
@SuperBuilder
@NoArgsConstructor()
@Table(name = "reviewables")
@Inheritance(strategy = InheritanceType.JOINED)
@SQLRestriction("deleted = false")
public abstract class Reviewable {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "author_id")
  private User author;

  private String name;

  @ManyToOne
  @JoinColumn(name = "assignee_id")
  private User assignee;

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
  @Builder.Default
  private Set<Review> reviews = new java.util.HashSet<>();

  private String notes;

  @OneToMany(
      mappedBy = "reviewable",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  @Builder.Default
  private Set<Activity> history = new java.util.HashSet<>();

  @Enumerated(EnumType.STRING)
  private ReviewableType type;

  @Column(name = "deleted", nullable = false)
  private boolean deleted = false;

  public void addReview(Review review) {
    this.reviews.add(review);
    review.setReviewable(this);
  }

  @Transient
  public Set<Supervisor> getReviewers() {
    return this.reviews.stream().map(Review::getSupervisor).collect(Collectors.toUnmodifiableSet());
  }

  public void addReviewer(Supervisor supervisor) {
    Review review =
        Review.builder()
            .supervisor(supervisor)
            .reviewable(this)
            .reviewStatus(ReviewStatus.DRAFT)
            .build();
    this.addReview(review);
  }

  public void removeReviewer(Supervisor supervisor) {
    this.reviews.removeIf(review -> review.getSupervisor().equals(supervisor));
  }

  public abstract void assignUser(User user);

  public abstract void setReviewers(Set<Supervisor> supervisors);
}

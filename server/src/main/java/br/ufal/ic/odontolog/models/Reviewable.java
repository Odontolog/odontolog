package br.ufal.ic.odontolog.models;

import br.ufal.ic.odontolog.enums.ReviewableStatus;
import br.ufal.ic.odontolog.enums.ReviewableType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@Entity
@SuperBuilder
@NoArgsConstructor()
@Table(name = "reviewables")
@Inheritance(strategy = InheritanceType.JOINED)
public class Reviewable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;

    @ManyToOne
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    // FIXME: I don't know if this cascade type is correct. Check if this is
    // necessary.
    // Or if I should use CascadeType.PERSIST only.
    @OneToMany(mappedBy = "reviewable", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Review> reviews;

    private String notes;

    @OneToMany(mappedBy = "reviewable", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Activity> history;

    @Enumerated(EnumType.STRING)
    private ReviewableType type;

    @Enumerated(EnumType.STRING)
    // FIXME: Remove this, and use the status from the subclasses.
    private ReviewableStatus reviewableStatus;

    public Reviewable(User author, User assignee, String notes, ReviewableType type,
            ReviewableStatus reviewableStatus) {
        this.author = author;
        this.assignee = assignee;
        this.notes = notes;
        this.type = type;
        this.reviewableStatus = reviewableStatus;
    }

    public void addReview(Review review) {
        this.reviews.add(review);
        review.setReviewable(this);
    }
}

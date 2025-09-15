package br.ufal.ic.odontolog.models;

import br.ufal.ic.odontolog.enums.ReviewableStatus;
import br.ufal.ic.odontolog.enums.ReviewableType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.List;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor()
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

    @OneToMany(mappedBy = "reviewable")
    private Set<Review> reviews;

    private String notes;

    @OneToMany(mappedBy = "reviewable")
    private List<Activity> history;

    @Enumerated(EnumType.STRING)
    private ReviewableType type;

    @Enumerated(EnumType.STRING)
    private ReviewableStatus status;

    public Reviewable(User author, User assignee, String notes, ReviewableType type, ReviewableStatus status) {
        this.author = author;
        this.assignee = assignee;
        this.notes = notes;
        this.type = type;
        this.status = status;
    }
}

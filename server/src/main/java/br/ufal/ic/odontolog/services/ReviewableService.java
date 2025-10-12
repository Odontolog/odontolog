package br.ufal.ic.odontolog.services;

import br.ufal.ic.odontolog.dtos.ActivityDTO;
import br.ufal.ic.odontolog.dtos.ReviewDTO;
import br.ufal.ic.odontolog.dtos.ReviewableAssignUserRequestDTO;
import br.ufal.ic.odontolog.dtos.ReviewableCurrentSupervisorFilterDTO;
import br.ufal.ic.odontolog.dtos.ReviewableDTO;
import br.ufal.ic.odontolog.dtos.ReviewableShortDTO;
import br.ufal.ic.odontolog.dtos.ReviewableSubmitSupervisorReviewDTO;
import br.ufal.ic.odontolog.dtos.ReviewersDTO;
import br.ufal.ic.odontolog.enums.ActivityType;
import br.ufal.ic.odontolog.exceptions.ResourceNotFoundException;
import br.ufal.ic.odontolog.exceptions.UnprocessableRequestException;
import br.ufal.ic.odontolog.mappers.ActivityMapper;
import br.ufal.ic.odontolog.mappers.ReviewMapper;
import br.ufal.ic.odontolog.mappers.ReviewableMapper;
import br.ufal.ic.odontolog.models.*;
import br.ufal.ic.odontolog.repositories.ReviewableRepository;
import br.ufal.ic.odontolog.repositories.SupervisorRepository;
import br.ufal.ic.odontolog.repositories.UserRepository;
import br.ufal.ic.odontolog.repositories.specifications.ReviewableSpecification;
import br.ufal.ic.odontolog.utils.CurrentUserProvider;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewableService {
  private final ReviewableRepository reviewableRepository;
  private final SupervisorRepository supervisorRepository;
  private final UserRepository userRepository;
  private final ReviewableMapper reviewableMapper;
  private final CurrentUserProvider currentUserProvider;
  private final ActivityMapper activityMapper;
  private final ReviewMapper reviewMapper;

  @Transactional(readOnly = true)
  public Page<ReviewableShortDTO> findForCurrentSupervisor(
      Pageable pageable,
      UserDetails currentUserDetails,
      ReviewableCurrentSupervisorFilterDTO filter) {
    Supervisor supervisor =
        supervisorRepository
            .findByEmail(currentUserDetails.getUsername())
            .orElseThrow(
                () ->
                    new UnprocessableRequestException(
                        "Supervisor profile not found for the current user"));

    Specification<Reviewable> spec = ReviewableSpecification.isReviewedBy(supervisor);

    if (filter.getName() != null && !filter.getName().isBlank()) {
      spec = spec.and(ReviewableSpecification.hasNameLike(filter.getName()));
    }

    if (filter.getAwaitingMyReview() != null && filter.getAwaitingMyReview()) {
      spec = spec.and(ReviewableSpecification.isAwaitingReviewBy(supervisor));
    }

    Page<Reviewable> page = reviewableRepository.findAll(spec, pageable);
    Page<ReviewableShortDTO> dtoPage = page.map(reviewableMapper::toShortDTO);

    return dtoPage;
  }

  @Transactional
  public ReviewableDTO updateSupervisorsFromReviewables(Long reviewableId, ReviewersDTO request) {
    Reviewable reviewable =
        reviewableRepository
            .findById(reviewableId)
            .orElseThrow(() -> new UnprocessableRequestException("Reviewable not found"));

    Set<Supervisor> supervisors =
        new HashSet<>(supervisorRepository.findAllById(request.getSupervisorIds()));

    Set<UUID> invalidIds =
        request.getSupervisorIds().stream()
            .filter(id -> supervisors.stream().noneMatch(s -> s.getId().equals(id)))
            .collect(Collectors.toSet());

    if (!invalidIds.isEmpty()) {
      throw new UnprocessableRequestException(
          "The following supervisor IDs do not exist: " + invalidIds);
    }

    addActivitiesForSupervisorUpdate(reviewable, supervisors);
    reviewable.setReviewers(supervisors);
    reviewableRepository.save(reviewable);

    return reviewableMapper.toDTO(reviewable);
  }

  @Transactional
  public ReviewableDTO updateNotes(Long id, String newNotes) {
    Reviewable reviewable =
        reviewableRepository
            .findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Reviewable not found"));

    String oldNotes = reviewable.getNotes();
    reviewable.setNotes(newNotes);

    User currentUser = currentUserProvider.getCurrentUser();

    HashMap<String, Object> metadata = new HashMap<>();
    metadata.put("data", newNotes);
    metadata.put("oldData", oldNotes);

    Activity activity =
        Activity.builder()
            .actor(currentUser)
            .type(ActivityType.EDITED)
            .description(
                String.format(
                    "Observações atualizadas por %s (%s)",
                    currentUser.getName(), currentUser.getEmail()))
            .reviewable(reviewable)
            .metadata(metadata)
            .build();
    reviewable.getHistory().add(activity);

    reviewableRepository.save(reviewable);

    return reviewableMapper.toDTO(reviewable);
  }

  @Transactional(readOnly = true)
  public List<ActivityDTO> getReviewableHistory(Long reviewableId) {
    Reviewable reviewable =
        reviewableRepository
            .findById(reviewableId)
            .orElseThrow(() -> new ResourceNotFoundException("Reviewable not found"));

    return activityMapper.toDTOs(reviewable.getHistory());
  }

  @Transactional
  public ReviewableDTO assignUserToReviewable(
      ReviewableAssignUserRequestDTO requestDTO, Long reviewableId) {
    User currentUser = currentUserProvider.getCurrentUser();

    User user =
        userRepository
            .findById(requestDTO.getUserId())
            .orElseThrow(() -> new UnprocessableRequestException("Provided User not found"));

    Reviewable reviewable =
        reviewableRepository
            .findById(reviewableId)
            .orElseThrow(() -> new ResourceNotFoundException("Reviewable not found"));

    reviewable.assignUser(user);

    String description = buildAssignDescription(currentUser, reviewable, user);
    Activity activity =
        Activity.builder()
            .actor(currentUser)
            .type(ActivityType.EDITED)
            .description(description)
            .reviewable(reviewable)
            .build();
    reviewable.getHistory().add(activity);
    reviewableRepository.save(reviewable);

    return reviewableMapper.toDTO(reviewable);
  }

  private String buildAssignDescription(User currentUser, Reviewable reviewable, User assignee) {
    StringBuilder descriptionBuilder = new StringBuilder();
    descriptionBuilder.append(
        String.format(
            "%s atribuído a %s #%s por %s (%s)",
            assignee.getName(),
            reviewable.getName(),
            reviewable.getId(),
            currentUser.getName(),
            currentUser.getEmail()));

    return descriptionBuilder.toString();
  }

  private void addActivitiesForSupervisorUpdate(
      Reviewable reviewable, Set<Supervisor> newSupervisors) {
    User currentUser = currentUserProvider.getCurrentUser();
    Set<Supervisor> currentSupervisors = new HashSet<>(reviewable.getReviewers());

    Set<Supervisor> added = new HashSet<>(newSupervisors);
    added.removeAll(currentSupervisors);

    Set<Supervisor> removed = new HashSet<>(currentSupervisors);
    removed.removeAll(newSupervisors);

    if (!added.isEmpty()) {
      Activity addedActivity =
          Activity.builder()
              .actor(currentUser)
              .type(ActivityType.EDITED)
              .description(buildSupervisorsAddedDescription(currentUser, reviewable, added))
              .reviewable(reviewable)
              .build();
      reviewable.getHistory().add(addedActivity);
    }

    if (!removed.isEmpty()) {
      Activity removedActivity =
          Activity.builder()
              .actor(currentUser)
              .type(ActivityType.EDITED)
              .description(buildSupervisorsRemovedDescription(currentUser, reviewable, removed))
              .reviewable(reviewable)
              .build();
      reviewable.getHistory().add(removedActivity);
    }
  }

  private String buildSupervisorsAddedDescription(
      User currentUser, Reviewable reviewable, Set<Supervisor> added) {
    String names = added.stream().map(Supervisor::getName).collect(Collectors.joining(", "));
    return String.format(
        "%s selecionado%s para validação de %s #%s por %s (%s)",
        names,
        added.size() > 1 ? "s" : "",
        reviewable.getName(),
        reviewable.getId(),
        currentUser.getName(),
        currentUser.getEmail());
  }

  private String buildSupervisorsRemovedDescription(
      User currentUser, Reviewable reviewable, Set<Supervisor> removed) {
    String names = removed.stream().map(Supervisor::getName).collect(Collectors.joining(", "));
    return String.format(
        "%s removido%s da validação de %s #%s por %s (%s)",
        names,
        removed.size() > 1 ? "s" : "",
        reviewable.getName(),
        reviewable.getId(),
        currentUser.getName(),
        currentUser.getEmail());
  }

  public ReviewDTO submitSupervisorReview(
      Long reviewableId, ReviewableSubmitSupervisorReviewDTO requestDTO, UserDetails currentUser) {
    Supervisor supervisor =
        supervisorRepository
            .findByEmail(currentUser.getUsername())
            .orElseThrow(
                () ->
                    new UnprocessableRequestException(
                        "Supervisor profile not found for the current user"));

    Reviewable reviewable =
        reviewableRepository
            .findById(reviewableId)
            .orElseThrow(() -> new ResourceNotFoundException("Reviewable not found"));

    if (!reviewable.getReviewers().contains(supervisor)) {
      throw new UnprocessableRequestException("You are not a reviewer for this reviewable");
    }

    reviewable.submitSupervisorReview(
        supervisor, requestDTO.getComments(), requestDTO.getGrade(), requestDTO.getApproved());

    Activity activity = buildReviewSubmittedActivity(supervisor, reviewable, requestDTO);
    reviewable.getHistory().add(activity);

    reviewableRepository.save(reviewable);

    return reviewMapper.toDTO(reviewable.getReviewFor(supervisor).get());
  }

  private Activity buildReviewSubmittedActivity(
      User currentUser, Reviewable reviewable, ReviewableSubmitSupervisorReviewDTO requestDTO) {
    String description =
        String.format(
            "Avaliação submetida para %s #%s por %s (%s)",
            reviewable.getName(),
            reviewable.getId(),
            currentUser.getName(),
            currentUser.getEmail());

    HashMap<String, Object> metadata = new HashMap<>();
    metadata.put("reviewNotes", requestDTO.getComments());
    metadata.put("reviewGrade", requestDTO.getGrade());
    metadata.put("reviewApproved", requestDTO.getApproved());

    var type =
        requestDTO.getApproved() ? ActivityType.REVIEW_APPROVED : ActivityType.REVIEW_REJECTED;

    return Activity.builder()
        .actor(currentUser)
        .type(type)
        .description(description)
        .reviewable(reviewable)
        .metadata(metadata)
        .build();
  }
}

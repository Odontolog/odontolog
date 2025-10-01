package br.ufal.ic.odontolog.services;

import br.ufal.ic.odontolog.dtos.ReviewableCurrentSupervisorFilterDTO;
import br.ufal.ic.odontolog.dtos.ReviewableDTO;
import br.ufal.ic.odontolog.dtos.ReviewersDTO;
import br.ufal.ic.odontolog.exceptions.UnprocessableRequestException;
import br.ufal.ic.odontolog.mappers.ReviewableMapper;
import br.ufal.ic.odontolog.models.Reviewable;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.repositories.ReviewableRepository;
import br.ufal.ic.odontolog.repositories.SupervisorRepository;
import br.ufal.ic.odontolog.repositories.specifications.ReviewableSpecification;
import java.util.HashSet;
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
  private final ReviewableMapper reviewableMapper;

  @Transactional(readOnly = true)
  public Page<ReviewableDTO> findForCurrentSupervisor(
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
    Page<ReviewableDTO> dtoPage = page.map(reviewableMapper::toDTO);

    return dtoPage;
  }

  @Transactional
  public ReviewableDTO addSupervisorsToReviewable(Long reviewableId, ReviewersDTO request) {
    if (request == null
        || request.getSupervisorIds() == null
        || request.getSupervisorIds().isEmpty()) {
      throw new UnprocessableRequestException("At least one supervisor ID must be provided");
    }

    Reviewable reviewable =
        reviewableRepository
            .findById(reviewableId)
            .orElseThrow(() -> new UnprocessableRequestException("Reviewable not found"));

    Set<UUID> requestedIds = new HashSet<>(request.getSupervisorIds());

    Set<Supervisor> supervisorsToAdd =
        new HashSet<>(supervisorRepository.findAllById(requestedIds));

    Set<UUID> foundIds =
        supervisorsToAdd.stream().map(Supervisor::getId).collect(Collectors.toSet());

    Set<UUID> invalidIds =
        requestedIds.stream().filter(id -> !foundIds.contains(id)).collect(Collectors.toSet());

    if (!invalidIds.isEmpty()) {
      throw new UnprocessableRequestException(
          "The following supervisor IDs do not exist: " + invalidIds);
    }

    Set<UUID> currentlyLinkedIds =
        reviewable.getReviewers().stream().map(Supervisor::getId).collect(Collectors.toSet());

    Set<UUID> alreadyLinked =
        foundIds.stream().filter(currentlyLinkedIds::contains).collect(Collectors.toSet());

    if (!alreadyLinked.isEmpty()) {
      throw new UnprocessableRequestException(
          "The following supervisor IDs are already linked to this reviewable: " + alreadyLinked);
    }

    reviewable.getReviewers().addAll(supervisorsToAdd);
    reviewableRepository.save(reviewable);

    return reviewableMapper.toDTO(reviewable);
  }

  @Transactional
  public ReviewableDTO removeSupervisorsFromReviewable(Long reviewableId, ReviewersDTO request) {
    if (request == null
        || request.getSupervisorIds() == null
        || request.getSupervisorIds().isEmpty()) {
      throw new UnprocessableRequestException("At least one supervisor ID must be provided");
    }

    Reviewable reviewable =
        reviewableRepository
            .findById(reviewableId)
            .orElseThrow(() -> new UnprocessableRequestException("Reviewable not found"));

    Set<Supervisor> supervisorsToRemove =
        reviewable.getReviewers().stream()
            .filter(s -> request.getSupervisorIds().contains(s.getId()))
            .collect(Collectors.toSet());

    Set<UUID> invalidIds =
        request.getSupervisorIds().stream()
            .filter(id -> reviewable.getReviewers().stream().noneMatch(s -> s.getId().equals(id)))
            .collect(Collectors.toSet());

    if (!invalidIds.isEmpty()) {
      throw new UnprocessableRequestException(
          "The following supervisor IDs are invalid or not linked to this reviewable: "
              + invalidIds);
    }

    reviewable.getReviewers().removeAll(supervisorsToRemove);
    reviewableRepository.save(reviewable);

    return reviewableMapper.toDTO(reviewable);
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

    reviewable.setReviewers(supervisors);
    reviewableRepository.save(reviewable);

    return reviewableMapper.toDTO(reviewable);
  }
}

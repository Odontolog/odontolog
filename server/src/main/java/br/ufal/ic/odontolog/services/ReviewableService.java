package br.ufal.ic.odontolog.services;

import br.ufal.ic.odontolog.dtos.AddReviewersDTO;
import br.ufal.ic.odontolog.dtos.ReviewableCurrentSupervisorFilterDTO;
import br.ufal.ic.odontolog.dtos.ReviewableDTO;
import br.ufal.ic.odontolog.exceptions.UnprocessableRequestException;
import br.ufal.ic.odontolog.mappers.ReviewableMapper;
import br.ufal.ic.odontolog.models.Reviewable;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.repositories.ReviewableRepository;
import br.ufal.ic.odontolog.repositories.SupervisorRepository;
import br.ufal.ic.odontolog.repositories.specifications.ReviewableSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

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
  public ReviewableDTO addSupervisorsToReviewable(UUID reviewableId, AddReviewersDTO request) {
    Reviewable reviewable =
            reviewableRepository
                    .findById(reviewableId)
                    .orElseThrow(() -> new UnprocessableRequestException("Reviewable não encontrado"));

    var supervisors = supervisorRepository.findAllById(request.getSupervisorIds());

    if (supervisors.isEmpty()) {
      throw new UnprocessableRequestException("Nenhum supervisor encontrado com os IDs fornecidos");
    }

    reviewable.getReviewers().addAll(supervisors);

    reviewableRepository.save(reviewable);

    return reviewableMapper.toDTO(reviewable);
  }


}

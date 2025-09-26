package br.ufal.ic.odontolog.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import br.ufal.ic.odontolog.dtos.ReviewableDTO;
import br.ufal.ic.odontolog.exceptions.UnprocessableRequestException;
import br.ufal.ic.odontolog.mappers.ReviewableMapper;
import br.ufal.ic.odontolog.models.Reviewable;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.repositories.ReviewableRepository;
import br.ufal.ic.odontolog.repositories.SupervisorRepository;
import br.ufal.ic.odontolog.repositories.specifications.ReviewableSpecification;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewableService {
    private final ReviewableRepository reviewableRepository;
    private final SupervisorRepository supervisorRepository;
    private final ReviewableMapper reviewableMapper;

    public Page<ReviewableDTO> findForCurrentSupervisor(Pageable pageable, UserDetails currentUserDetails) {
        Supervisor supervisor = supervisorRepository.findByEmail(currentUserDetails.getUsername())
                .orElseThrow(
                        () -> new UnprocessableRequestException("Supervisor profile not found for the current user"));

        Specification<Reviewable> spec = ReviewableSpecification.isReviewedBy(supervisor);

        Page<Reviewable> page = reviewableRepository.findAll(spec, pageable);
        Page<ReviewableDTO> dtoPage = page.map(reviewableMapper::toDTO);

        return dtoPage;
    }
}

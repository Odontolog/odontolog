package br.ufal.ic.odontolog.controllers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.ufal.ic.odontolog.dtos.ReviewableDTO;
import br.ufal.ic.odontolog.mappers.ReviewableMapper;
import br.ufal.ic.odontolog.models.Reviewable;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.repositories.ReviewableRepository;
import br.ufal.ic.odontolog.repositories.SupervisorRepository;
import br.ufal.ic.odontolog.repositories.UserRepository;
import br.ufal.ic.odontolog.repositories.specifications.ReviewableSpecification;
import br.ufal.ic.odontolog.services.ReviewableService;
import lombok.RequiredArgsConstructor;

@RestController()
@RequestMapping("/api/reviewables")
@RequiredArgsConstructor
public class ReviewableController {
    private final ReviewableService reviewableService;

    // TODO: This must be restricted to Supervisors role only
    // TODO: Add exception handling for cases like Supervisor not found
    @PreAuthorize("hasRole('ROLE_SUPERVISOR')")
    @GetMapping("/me")
    public ResponseEntity<PagedModel<ReviewableDTO>> getCurrentSupervisorReviewables(
            Pageable pageable,
            @AuthenticationPrincipal UserDetails currentUser) {

        var response = reviewableService.findForCurrentSupervisor(pageable, currentUser);
        var pagedModel = new PagedModel<>(response);

        return ResponseEntity.ok(pagedModel);
    }
}

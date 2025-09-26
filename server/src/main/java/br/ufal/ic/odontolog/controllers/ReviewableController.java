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

import br.ufal.ic.odontolog.dtos.ReviewableCurrentSupervisorFilterDTO;
import br.ufal.ic.odontolog.dtos.ReviewableDTO;
import br.ufal.ic.odontolog.services.ReviewableService;
import lombok.RequiredArgsConstructor;

@RestController()
@RequestMapping("/api/reviewables")
@RequiredArgsConstructor
public class ReviewableController {
    private final ReviewableService reviewableService;

    @PreAuthorize("hasRole('SUPERVISOR')")
    @GetMapping("/me")
    public ResponseEntity<PagedModel<ReviewableDTO>> getCurrentSupervisorReviewables(
            Pageable pageable,
            ReviewableCurrentSupervisorFilterDTO filter,
            @AuthenticationPrincipal UserDetails currentUser) {
        var response = reviewableService.findForCurrentSupervisor(pageable, currentUser, filter);
        var pagedModel = new PagedModel<>(response);

        return ResponseEntity.ok(pagedModel);
    }
}

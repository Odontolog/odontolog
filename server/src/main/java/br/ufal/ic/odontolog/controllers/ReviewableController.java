package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.api.ReviewableApi;
import br.ufal.ic.odontolog.dtos.ReviewersDTO;
import br.ufal.ic.odontolog.dtos.ReviewableCurrentSupervisorFilterDTO;
import br.ufal.ic.odontolog.dtos.ReviewableDTO;
import br.ufal.ic.odontolog.services.ReviewableService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController()
@RequestMapping("/api/reviewables")
@RequiredArgsConstructor
public class ReviewableController implements ReviewableApi {
  private final ReviewableService reviewableService;

  @PreAuthorize("hasAnyRole('SUPERVISOR', 'STUDENT')")
  @GetMapping("/me")
  public ResponseEntity<PagedModel<ReviewableDTO>> getCurrentSupervisorReviewables(
      Pageable pageable,
      ReviewableCurrentSupervisorFilterDTO filter,
      @AuthenticationPrincipal UserDetails currentUser) {
    var response = reviewableService.findForCurrentSupervisor(pageable, currentUser, filter);
    var pagedModel = new PagedModel<>(response);

    return ResponseEntity.ok(pagedModel);
  }

  @PreAuthorize("hasAnyRole('SUPERVISOR', 'STUDENT')")
  @PostMapping("/{reviewableId}/reviewers")
  public ResponseEntity<ReviewableDTO> addReviewers(
          @PathVariable UUID reviewableId,
          @Valid @RequestBody ReviewersDTO request) {

    var updated = reviewableService.addSupervisorsToReviewable(reviewableId, request);
    return ResponseEntity.ok(updated);
  }

  @PreAuthorize("hasAnyRole('SUPERVISOR', 'STUDENT')")
  @DeleteMapping("/{reviewableId}/reviewers")
  public ResponseEntity<ReviewableDTO> removeReviewers(
          @PathVariable UUID reviewableId,
          @Valid @RequestBody ReviewersDTO request) {

    var updated = reviewableService.removeSupervisorsFromReviewable(reviewableId, request);
    return ResponseEntity.ok(updated);
  }

  @PreAuthorize("hasAnyRole('SUPERVISOR', 'STUDENT')")
  @PutMapping("/{reviewableId}/reviewers")
  public ResponseEntity<ReviewableDTO> updateReviewers(
          @PathVariable UUID reviewableId,
          @Valid @RequestBody ReviewersDTO request) {

    var updated = reviewableService.updateReviewers(reviewableId, request);
    return ResponseEntity.ok(updated);
  }

}

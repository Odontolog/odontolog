package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.api.ReviewableApi;
import br.ufal.ic.odontolog.dtos.*;
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

@RestController()
@RequestMapping("/api/reviewables")
@RequiredArgsConstructor
public class ReviewableController implements ReviewableApi {
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

  @PreAuthorize("hasAnyRole('SUPERVISOR', 'STUDENT')")
  @PostMapping("/{reviewableId}/reviewers")
  public ResponseEntity<ReviewableDTO> addReviewers(
      @PathVariable Long reviewableId, @Valid @RequestBody ReviewersDTO request) {

    var updated = reviewableService.addSupervisorsToReviewable(reviewableId, request);
    return ResponseEntity.ok(updated);
  }

  @PreAuthorize("hasAnyRole('SUPERVISOR', 'STUDENT')")
  @DeleteMapping("/{reviewableId}/reviewers")
  public ResponseEntity<ReviewableDTO> removeReviewers(
      @PathVariable Long reviewableId, @Valid @RequestBody ReviewersDTO request) {

    var updated = reviewableService.removeSupervisorsFromReviewable(reviewableId, request);
    return ResponseEntity.ok(updated);
  }

  @PreAuthorize("hasAnyRole('SUPERVISOR', 'STUDENT')")
  @PutMapping("/{reviewableId}/reviewers")
  public ResponseEntity<ReviewableDTO> updateReviewers(
      @PathVariable Long reviewableId, @Valid @RequestBody ReviewersDTO request) {

    var updated = reviewableService.updateSupervisorsFromReviewables(reviewableId, request);
    return ResponseEntity.ok(updated);
  }

  @PatchMapping("/{reviewableId}/notes")
  @PreAuthorize("hasAnyRole('STUDENT','SUPERVISOR')")
  public ReviewableDTO updateNotes(
      @PathVariable Long reviewableId, @RequestBody UpdateNotesRequestDTO request) {
    return reviewableService.updateNotes(reviewableId, request.getNotes());
  }
}

package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.api.ReviewableApi;
import br.ufal.ic.odontolog.dtos.*;
import br.ufal.ic.odontolog.services.ReviewableService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
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

  @GetMapping("/me")
  @PreAuthorize("hasRole('SUPERVISOR')")
  public ResponseEntity<PagedModel<ReviewableShortDTO>> getCurrentSupervisorReviewables(
      Pageable pageable,
      ReviewableCurrentSupervisorFilterDTO filter,
      @AuthenticationPrincipal UserDetails currentUser) {
    var response = reviewableService.findForCurrentSupervisor(pageable, currentUser, filter);
    var pagedModel = new PagedModel<>(response);

    return ResponseEntity.ok(pagedModel);
  }

  @PreAuthorize("hasAnyRole('STUDENT', 'SUPERVISOR', 'ADMIN')")
  @GetMapping("/student")
  public ResponseEntity<PagedModel<ReviewableShortDTO>> getStudentReviewables(
      Pageable pageable,
      ReviewableCurrentStudentFilterDTO filter,
      @AuthenticationPrincipal UserDetails currentUser,
      @RequestParam(name = "id", required = false) UUID studentId) {

    var response =
        reviewableService.findStudentReviewables(pageable, currentUser, filter, studentId);

    var pagedModel = new PagedModel<>(response);
    return ResponseEntity.ok(pagedModel);
  }

  @PutMapping("/{reviewableId}/reviewers")
  @PreAuthorize("hasPermission(#reviewableId, 'Reviewable', 'edit')")
  public ResponseEntity<ReviewableDTO> updateReviewers(
      @PathVariable Long reviewableId, @Valid @RequestBody ReviewersDTO request) {

    var updated = reviewableService.updateSupervisorsFromReviewables(reviewableId, request);
    return ResponseEntity.ok(updated);
  }

  @PatchMapping("/{reviewableId}/notes")
  @PreAuthorize("hasPermission(#reviewableId, 'Reviewable', 'edit')")
  public ReviewableDTO updateNotes(
      @PathVariable Long reviewableId, @RequestBody UpdateNotesRequestDTO request) {
    return reviewableService.updateNotes(reviewableId, request.getNotes());
  }

  @GetMapping("/{reviewableId}/history")
  @PreAuthorize("hasPermission(#reviewableId, 'Reviewable', 'edit')")
  public ResponseEntity<List<ActivityDTO>> getReviewableHistory(@PathVariable Long reviewableId) {
    var history = reviewableService.getReviewableHistory(reviewableId);

    return ResponseEntity.ok(history);
  }

  @PostMapping("/{reviewableId}/assignee")
  @PreAuthorize("hasPermission(#reviewableId, 'Reviewable', 'edit')")
  public ResponseEntity<ReviewableDTO> assignUserToReviewable(
      @RequestBody ReviewableAssignUserRequestDTO requestDTO, @PathVariable Long reviewableId) {
    ReviewableDTO updatedReviewable =
        reviewableService.assignUserToReviewable(requestDTO, reviewableId);

    return ResponseEntity.ok(updatedReviewable);
  }

  @PostMapping("/{reviewableId}/submit-for-review")
  @PreAuthorize("hasPermission(#reviewableId, 'Reviewable', 'edit')")
  public ResponseEntity<ReviewableDTO> submitForReview(
      @PathVariable Long reviewableId, @RequestBody SubmitForReviewDTO requestDTO) {
    ReviewableDTO updatedReviewable = reviewableService.submitForReview(reviewableId, requestDTO);

    return ResponseEntity.ok(updatedReviewable);
  }

  @PostMapping("/{reviewableId}/reviews/submit")
  @PreAuthorize("hasRole('SUPERVISOR')")
  public ResponseEntity<ReviewDTO> submitSupervisorReview(
      @PathVariable Long reviewableId,
      @Valid @RequestBody ReviewableSubmitSupervisorReviewDTO requestDTO,
      @AuthenticationPrincipal UserDetails currentUser) {
    ReviewDTO updatedReview =
        reviewableService.submitSupervisorReview(reviewableId, requestDTO, currentUser);

    return ResponseEntity.ok(updatedReview);
  }
}

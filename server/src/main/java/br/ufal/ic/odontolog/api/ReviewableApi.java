package br.ufal.ic.odontolog.api;

import br.ufal.ic.odontolog.dtos.ActivityDTO;
import br.ufal.ic.odontolog.dtos.ReviewDTO;
import br.ufal.ic.odontolog.dtos.ReviewableAssignUserRequestDTO;
import br.ufal.ic.odontolog.dtos.ReviewableCurrentSupervisorFilterDTO;
import br.ufal.ic.odontolog.dtos.ReviewableDTO;
import br.ufal.ic.odontolog.dtos.ReviewableShortDTO;
import br.ufal.ic.odontolog.dtos.ReviewableSubmitSupervisorReviewDTO;
import br.ufal.ic.odontolog.dtos.ReviewersDTO;
import br.ufal.ic.odontolog.dtos.SubmitForReviewDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Reviewables", description = "Endpoints for managing reviewable items")
@SecurityRequirement(name = "bearerAuth")
public interface ReviewableApi {

  @Operation(
      summary = "Fetch reviewable items for the logged-in supervisor",
      description =
          "Returns a paginated list of items that are awaiting review or belong to the authenticated supervisor, based on the provided filters.")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Search completed successfully."),
        @ApiResponse(responseCode = "422", description = "Authenticated supervisor not found."),
      })
  public ResponseEntity<PagedModel<ReviewableShortDTO>> getCurrentSupervisorReviewables(
      @ParameterObject Pageable pageable,
      @ParameterObject ReviewableCurrentSupervisorFilterDTO filter,
      @Parameter(hidden = true) UserDetails currentUser);

  @Operation(
      summary = "Update reviewers for a reviewable item",
      description =
          """
            Updates the list of reviewers for the specified reviewable item.

            Preconditions:

            - The reviewable item must exist in the system.
            - The new reviewers must exist in the system.

            Postconditions:

            - The reviewable item's reviewers will be updated to match the provided list.
            """)
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Reviewers updated successfully."),
        @ApiResponse(responseCode = "404", description = "Reviewable item not found."),
        @ApiResponse(responseCode = "422", description = "Invalid request data."),
      })
  public ResponseEntity<ReviewableDTO> updateReviewers(Long reviewableId, ReviewersDTO request);

  @Operation(
      summary = "Get the review history of a reviewable item",
      description =
          """
            Retrieves the complete history of reviews and actions taken on the specified reviewable item.

            Preconditions:

            - The reviewable item must exist in the system.

            Postconditions:

            - A list of all activities related to the reviewable item will be returned.
            """)
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "History retrieved successfully."),
        @ApiResponse(responseCode = "404", description = "Reviewable item not found."),
      })
  public ResponseEntity<List<ActivityDTO>> getReviewableHistory(Long reviewableId);

  @Operation(
      summary = "Assign user to reviewable",
      description =
          """
            Assigns a user to a specific reviewable.

            Preconditions:
            - (Treatment Plan) The treatment plan must be in the 'DRAFT' state.
            - (Procedure) The procedure must be in the 'NOT STARTED' state.
            - The reviewable must exist in the system.
            - The user must exist in the system.

            Postconditions:
            - The reviewable will be assigned to the specified user.""")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "User assigned successfully."),
        @ApiResponse(responseCode = "422", description = "Invalid request."),
        @ApiResponse(responseCode = "404", description = "Reviewable not found."),
        @ApiResponse(
            responseCode = "400",
            description = "Reviewable is not in a state that allows user assignment.")
      })
  public ResponseEntity<ReviewableDTO> assignUserToReviewable(
      @RequestBody ReviewableAssignUserRequestDTO requestDTO, @Parameter Long reviewableId);

  @Operation(
      summary = "Submit reviewable for review",
      description =
          """
            Submits a reviewable for review by assigned reviewers.

            Preconditions:

            - The reviewable must be in the 'DRAFT' state (if it is a TreatmentPlan) or 'IN_PROGRESS' (if it is a Procedure).
            - The reviewable must have at least one assigned reviewer.
            - The reviewable must have an assigned user.
            - The reviewable must exist in the system.

            Postconditions:

            - The reviewable status will be updated to 'IN_REVIEW'.
            - Review entries will be created for each assigned reviewer with a status of 'PENDING'.""")
  @ApiResponses(
      value = {
        @ApiResponse(
            responseCode = "200",
            description = "Reviewable submitted for review successfully."),
        @ApiResponse(responseCode = "422", description = "Invalid request."),
        @ApiResponse(responseCode = "404", description = "Reviewable not found."),
        @ApiResponse(
            responseCode = "400",
            description = "Reviewable is not in a state that allows submission for review.")
      })
  public ResponseEntity<ReviewableDTO> submitForReview(
      @Parameter Long reviewableId, @RequestBody SubmitForReviewDTO requestDTO);

  @Operation(
      summary = "Submit supervisor review for a reviewable item",
      description =
          """
            Allows a supervisor to submit their review for a specific reviewable item.

            Preconditions:

            - The reviewable item must exist in the system.
            - The authenticated user must be a supervisor assigned to the reviewable item.
            - The reviewable item must be in a state that allows reviews to be submitted.

            Postconditions:

            - The supervisor's review will be recorded and associated with the reviewable item.
            - If all assigned supervisors have submitted their reviews, the reviewable item's status may be updated accordingly.
            """)
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Review submitted successfully."),
        @ApiResponse(responseCode = "404", description = "Reviewable item not found."),
        @ApiResponse(responseCode = "422", description = "Invalid request data."),
        @ApiResponse(
            responseCode = "403",
            description = "Authenticated user is not authorized to review this item."),
      })
  public ResponseEntity<ReviewDTO> submitSupervisorReview(
      @Parameter Long reviewableId,
      @RequestBody ReviewableSubmitSupervisorReviewDTO requestDTO,
      @Parameter(hidden = true) UserDetails currentUser);
}

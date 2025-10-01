package br.ufal.ic.odontolog.api;

import br.ufal.ic.odontolog.dtos.ActivityDTO;
import br.ufal.ic.odontolog.dtos.ReviewableCurrentSupervisorFilterDTO;
import br.ufal.ic.odontolog.dtos.ReviewableDTO;
import br.ufal.ic.odontolog.dtos.ReviewersDTO;
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
  public ResponseEntity<PagedModel<ReviewableDTO>> getCurrentSupervisorReviewables(
      @ParameterObject Pageable pageable,
      @ParameterObject ReviewableCurrentSupervisorFilterDTO filter,
      @Parameter(hidden = true) UserDetails currentUser);

  @Operation(
      summary = "Add reviewers to a reviewable item",
      description =
          """
      Adds one or more reviewers to the specified reviewable item.

      Preconditions:

      - The reviewable item must exist in the system.
      - The reviewers to be added must exist in the system.
      - The reviewers must not already be assigned to the reviewable item.

      Postconditions:

      - The specified reviewers will be associated with the reviewable item.
      """)
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Reviewers added successfully."),
        @ApiResponse(responseCode = "404", description = "Reviewable item not found."),
        @ApiResponse(responseCode = "422", description = "Invalid request data."),
      })
  public ResponseEntity<ReviewableDTO> addReviewers(Long reviewableId, ReviewersDTO request);

  @Operation(
      summary = "Remove reviewers from a reviewable item",
      description =
          """
      Removes one or more reviewers from the specified reviewable item.

      Preconditions:

      - The reviewable item must exist in the system.
      - The reviewers to be removed must exist in the system.
      - The reviewers must be currently assigned to the reviewable item.

      Postconditions:

      - The specified reviewers will be disassociated from the reviewable item.
      """)
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Reviewers removed successfully."),
        @ApiResponse(responseCode = "404", description = "Reviewable item not found."),
        @ApiResponse(responseCode = "422", description = "Invalid request data."),
      })
  public ResponseEntity<ReviewableDTO> removeReviewers(Long reviewableId, ReviewersDTO request);

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
}

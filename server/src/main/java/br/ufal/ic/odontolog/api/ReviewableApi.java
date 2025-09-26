package br.ufal.ic.odontolog.api;

import br.ufal.ic.odontolog.dtos.ReviewableCurrentSupervisorFilterDTO;
import br.ufal.ic.odontolog.dtos.ReviewableDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
}

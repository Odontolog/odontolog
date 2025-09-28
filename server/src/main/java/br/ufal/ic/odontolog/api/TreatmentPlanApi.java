package br.ufal.ic.odontolog.api;

import br.ufal.ic.odontolog.dtos.TreatmentPlanAssignUserRequestDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Treatment Plans", description = "Endpoints for managing treatment plan items")
@SecurityRequirement(name = "bearerAuth")
public interface TreatmentPlanApi {

  @Operation(
      summary = "Assign user to treatment plan",
      description =
          """
                        Assigns a user to a specific treatment plan.

                        Preconditions:
                        - The treatment plan must be in the 'DRAFT' state.
                        - The treatment plan must exist in the system.
                        - The user must exist in the system.

                        Postconditions:
                        - The treatment plan will be assigned to the specified user.""")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "User assigned successfully."),
        @ApiResponse(responseCode = "422", description = "Invalid request."),
        @ApiResponse(responseCode = "404", description = "Treatment Plan not found."),
        @ApiResponse(
            responseCode = "400",
            description = "Treatment Plan is not in a state that allows user assignment.")
      })
  public ResponseEntity<TreatmentPlanDTO> assignUserToTreatmentPlan(
      @RequestBody TreatmentPlanAssignUserRequestDTO requestDTO, @Parameter Long treatment_id);
}

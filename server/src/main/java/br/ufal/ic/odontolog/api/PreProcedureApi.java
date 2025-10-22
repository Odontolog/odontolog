package br.ufal.ic.odontolog.api;

import br.ufal.ic.odontolog.dtos.PreProcedureDTO;
import br.ufal.ic.odontolog.dtos.PreProcedureShortDTO;
import br.ufal.ic.odontolog.dtos.PreProcedureUpsertDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Pre-Procedures", description = "Endpoints for managing pre-procedures")
@SecurityRequirement(name = "bearerAuth")
public interface PreProcedureApi {

    @Operation(
            summary = "Create a new Pre-Procedure for a specific patient",
            description =
                    """
                    Creates a new Pre-Procedure linked to the specified patient.
          
                    Preconditions:
                    - The patient with the given ID must exist.
                    - The authenticated user must have permission to create a Pre-Procedure.
                    - The Pre-Procedure must have a name
          
                    Postconditions:
                    - A new Pre-Procedure will be created with status 'IN_PROGRESS'.
                    - The field 'performedAt' will store the creation timestamp.
                    """)
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "201", description = "Pre-Procedure created successfully."),
                    @ApiResponse(responseCode = "404", description = "Patient not found."),
                    @ApiResponse(responseCode = "422", description = "Invalid request data."),
            })
    ResponseEntity<PreProcedureDTO> createPreProcedure(
            @Parameter(description = "ID of the patient") @PathVariable Long patientId,
            @RequestBody PreProcedureUpsertDTO dto);

    @Operation(
            summary = "Get a specific Pre-Procedure by patient and ID",
            description =
                    """
                    Retrieves a specific Pre-Procedure for a given patient.
          
                    Preconditions:
                    - The patient and Pre-Procedure must exist.
                    - The Pre-Procedure must belong to the specified patient.
          
                    Postconditions:
                    - Returns the complete Pre-Procedure data, including status, diagnostic, and details.
                    """)
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Pre-Procedure retrieved successfully."),
                    @ApiResponse(responseCode = "404", description = "Pre-Procedure or patient not found."),
            })
    ResponseEntity<PreProcedureDTO> getPreProcedureByPatientAndId(
            @Parameter(description = "ID of the patient") @PathVariable Long patientId,
            @Parameter(description = "ID of the pre-procedure") @PathVariable Long preProcedureId);

    @Operation(
            summary = "List all Pre-Procedures for a specific patient",
            description =
                    """
                    Retrieves a list of all Pre-Procedures associated with the specified patient.
          
                    Preconditions:
                    - The patient must exist in the system.
          
                    Postconditions:
                    - Returns a list of Pre-Procedures in short format, ordered by creation date or ID.
                    """)
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Pre-Procedures retrieved successfully."),
                    @ApiResponse(responseCode = "404", description = "Patient not found."),
            })
    ResponseEntity<List<PreProcedureShortDTO>> getPreProceduresForPatient(
            @Parameter(description = "ID of the patient") @PathVariable Long patientId);
}

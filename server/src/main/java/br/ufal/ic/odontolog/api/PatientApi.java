package br.ufal.ic.odontolog.api;

import br.ufal.ic.odontolog.dtos.AppointmentDTO;
import br.ufal.ic.odontolog.dtos.PatientAndTreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.PatientDTO;
import br.ufal.ic.odontolog.dtos.PatientUpsertDTO;
import br.ufal.ic.odontolog.dtos.UploadAttachmentInitResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "Patients", description = "Endpoints for managing patients")
@SecurityRequirement(name = "bearerAuth")
public interface PatientApi {

    @Operation(summary = "Get all patients", description = "Retrieves a list of all patients that are not soft-deleted.")
    @ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Patients retrieved successfully") })
    ResponseEntity<List<PatientDTO>> getAllPatients();

    @Operation(summary = "Search patients by term", description = "Search patients by name or other criteria, limited to the first 10 results.")
    @ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Search completed successfully") })
    ResponseEntity<List<PatientAndTreatmentPlanDTO>> searchPatient(
            @Parameter(description = "Optional search term") @RequestParam(name = "term") Optional<String> searchTerm);

    @Operation(summary = "Get patient by ID", description = "Retrieve a patient by their ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Patient retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Patient not found")
    })
    ResponseEntity<PatientDTO> getPatientById(
            @Parameter(description = "ID of the patient") @PathVariable Long id);

    @Operation(summary = "Get next appointment of a patient", description = "Retrieve the next scheduled appointment of a patient.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Next appointment retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Patient not found")
    })
    ResponseEntity<AppointmentDTO> getNextAppointment(
            @Parameter(description = "ID of the patient") @PathVariable Long id);

    @Operation(summary = "Update next appointment of a patient", description = "Update the next scheduled appointment of a patient.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Next appointment updated successfully"),
            @ApiResponse(responseCode = "404", description = "Patient not found")
    })
    ResponseEntity<AppointmentDTO> updateNextAppointment(
            @Parameter(description = "ID of the patient") @PathVariable Long id,
            @RequestBody AppointmentDTO appointmentDTO);

    @Operation(summary = "Initialize attachment upload", description = """
            Initialize the process for uploading an attachment for a specific patient.

             Preconditions:
             - The patient with the specified ID must exist in the system.
             Postconditions:
             - Returns an upload URL and necessary metadata for uploading the attachment.
            """)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Upload initialization successful."),
            @ApiResponse(responseCode = "404", description = "Patient not found.")
    })
    ResponseEntity<UploadAttachmentInitResponseDTO> initUploadAttachment(
            @Parameter(description = "ID of the patient") @PathVariable Long id);

    @Operation(summary = "Create a new patient", description = "Creates a new patient (prontuário).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Patient created successfully"),
            @ApiResponse(responseCode = "422", description = "Invalid request data")
    })
    ResponseEntity<PatientDTO> createPatient(@RequestBody PatientUpsertDTO dto);

    @Operation(summary = "Update an existing patient", description = "Update the information of an existing patient.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Patient updated successfully"),
            @ApiResponse(responseCode = "404", description = "Patient not found"),
            @ApiResponse(responseCode = "422", description = "Invalid request data")
    })
    ResponseEntity<PatientDTO> updatePatient(
            @PathVariable Long id, @RequestBody PatientUpsertDTO dto);

    @Operation(summary = "Delete a patient", description = "Soft or hard delete a patient by ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Patient deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Patient not found")
    })
    ResponseEntity<Void> deletePatient(
            @Parameter(description = "ID of the patient") @PathVariable Long id,
            @Parameter(description = "Soft delete flag, default is true") @RequestParam(defaultValue = "true") boolean soft);

    @Operation(summary = "Restore a soft-deleted patient", description = "Restore a patient that was soft-deleted.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Patient restored successfully"),
            @ApiResponse(responseCode = "404", description = "Patient not found")
    })
    ResponseEntity<Void> restorePatient(
            @Parameter(description = "ID of the patient") @PathVariable Long id);
}
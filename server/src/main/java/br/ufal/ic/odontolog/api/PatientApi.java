package br.ufal.ic.odontolog.api;

import java.util.List;

import org.springframework.http.ResponseEntity;

import br.ufal.ic.odontolog.dtos.AppointmentDTO;
import br.ufal.ic.odontolog.dtos.PatientDTO;
import br.ufal.ic.odontolog.dtos.UploadAttachmentInitResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

public interface PatientApi {
        @Operation(summary = "Get all patients")
        public ResponseEntity<List<PatientDTO>> getAllPatients();

        @Operation(summary = "Get patient by ID", description = """
                        Retrieve a patient's details using their unique ID.

                         Preconditions:
                         - The patient with the specified ID must exist in the system.
                         Postconditions:
                         - Returns the patient's details including personal information and associated treatment plans.
                        """)
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Patient found and returned successfully."),
                        @ApiResponse(responseCode = "404", description = "Patient with the specified ID does not exist.")
        })
        public ResponseEntity<PatientDTO> getPatientById(Long id);

        @Operation(summary = "Search patients")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Search completed successfully."),
        })
        public ResponseEntity<List<PatientDTO>> searchPatient(String searchTerm);

        @Operation(summary = "Get next appointment", description = """
                        Retrieve the next scheduled appointment for a specific patient.

                         Preconditions:
                         - The patient with the specified ID must exist in the system.
                         Postconditions:
                         - Returns the details of the patient's next appointment, including date and time.
                        """)
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Next appointment retrieved successfully."),
                        @ApiResponse(responseCode = "404", description = "Patient not found.")
        })
        public ResponseEntity<AppointmentDTO> getNextAppointment(Long id);

        @Operation(summary = "Update next appointment", description = """
                        Update the next scheduled appointment for a specific patient.

                         Preconditions:
                         - The patient with the specified ID must exist in the system.
                         - The new appointment details must be valid.
                         Postconditions:
                         - The patient's next appointment is updated with the provided details.
                        """)
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Next appointment updated successfully."),
                        @ApiResponse(responseCode = "404", description = "Patient not found."),
                        @ApiResponse(responseCode = "400", description = "Invalid appointment details provided.")
        })
        public ResponseEntity<AppointmentDTO> updateNextAppointment(Long id, AppointmentDTO appointmentDTO);

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
        public ResponseEntity<UploadAttachmentInitResponseDTO> initUploadAttachment(Long id);
}

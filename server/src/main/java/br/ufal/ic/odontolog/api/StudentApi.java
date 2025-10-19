package br.ufal.ic.odontolog.api;

import br.ufal.ic.odontolog.dtos.StudentDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

@Tag(name = "Students", description = "Endpoints for managing students")
@SecurityRequirement(name = "bearerAuth")
public interface StudentApi {

  @Operation(summary = "Get all students", description = "Retrieve a list of all students.")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Successful retrieval of students"),
        @ApiResponse(responseCode = "404", description = "Not Found")
      })
  public ResponseEntity<List<StudentDTO>> getAllStudents();

  @Operation(
      summary = "Get a student by ID",
      description = "Retrieve a student by their UUID identifier.")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Successful retrieval of student"),
        @ApiResponse(responseCode = "404", description = "Not Found")
      })
  public ResponseEntity<StudentDTO> getStudent(@PathVariable UUID id);
}

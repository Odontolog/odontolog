package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.api.StudentApi;
import br.ufal.ic.odontolog.dtos.StudentDTO;
import br.ufal.ic.odontolog.services.StudentService;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

@PreAuthorize("isAuthenticated()")
@RestController
@RequestMapping("api/students")
public class StudentController implements StudentApi {

  private final StudentService studentService;

  public StudentController(StudentService studentService) {
    this.studentService = studentService;
  }

  @GetMapping
  public ResponseEntity<List<StudentDTO>> getAllStudents() {
    return new ResponseEntity<>(studentService.getStudents(), HttpStatus.OK);
  }

  @GetMapping("/{id}")
  public ResponseEntity<StudentDTO> getStudent(@PathVariable UUID id) {
    return new ResponseEntity<>(studentService.getStudentById(id), HttpStatus.OK);
  }

  @PostMapping
  @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
  public ResponseEntity<StudentDTO> createStudent(@RequestBody @Valid StudentDTO studentDTO) {
    StudentDTO created = studentService.createStudent(studentDTO);
    return new ResponseEntity<>(created, HttpStatus.CREATED);
  }
}

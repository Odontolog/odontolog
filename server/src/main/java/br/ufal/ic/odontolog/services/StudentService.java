package br.ufal.ic.odontolog.services;

import static org.springframework.http.HttpStatus.NOT_FOUND;

import br.ufal.ic.odontolog.dtos.StudentDTO;
import br.ufal.ic.odontolog.mappers.StudentMapper;
import br.ufal.ic.odontolog.models.Student;
import br.ufal.ic.odontolog.repositories.StudentRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class StudentService {

  private final StudentRepository studentRepository;
  private final StudentMapper studentMapper;

  public StudentService(StudentRepository studentRepository, StudentMapper studentMapper) {
    this.studentRepository = studentRepository;
    this.studentMapper = studentMapper;
  }

  public List<StudentDTO> getStudents() {
    List<Student> students = studentRepository.findAll();
    return studentMapper.toDTOs(students);
  }

  public StudentDTO getStudentByEmail(String email) {
    Student student =
        studentRepository
            .findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Student not found"));
    return studentMapper.toDTO(student);
  }
}

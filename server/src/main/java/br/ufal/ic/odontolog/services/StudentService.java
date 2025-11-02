package br.ufal.ic.odontolog.services;

import static org.springframework.http.HttpStatus.NOT_FOUND;

import br.ufal.ic.odontolog.dtos.StudentDTO;
import br.ufal.ic.odontolog.enums.Role;
import br.ufal.ic.odontolog.mappers.StudentMapper;
import br.ufal.ic.odontolog.models.Student;
import br.ufal.ic.odontolog.repositories.StudentRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class StudentService {

  private final StudentRepository studentRepository;
  private final StudentMapper studentMapper;
  private final PasswordEncoder passwordEncoder;

  public StudentService(
      StudentRepository studentRepository,
      StudentMapper studentMapper,
      PasswordEncoder passwordEncoder) {
    this.studentRepository = studentRepository;
    this.studentMapper = studentMapper;
    this.passwordEncoder = passwordEncoder;
  }

  public List<StudentDTO> getStudents() {
    List<Student> students = studentRepository.findAll();
    return studentMapper.toDTOs(students);
  }

  public StudentDTO getStudentById(UUID id) {
    Student student =
        studentRepository
            .findById(id)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Student not found"));
    return studentMapper.toDTO(student);
  }

  public StudentDTO createStudent(StudentDTO studentDTO) {
    Student student = new Student();
    student.setName(studentDTO.getName());
    student.setEmail(studentDTO.getEmail());
    student.setClinicNumber(studentDTO.getClinicNumber());
    student.setEnrollmentCode(studentDTO.getEnrollmentCode());
    student.setEnrollmentYear(studentDTO.getEnrollmentYear());
    student.setEnrollmentSemester(studentDTO.getEnrollmentSemester());
    student.setRole(Role.STUDENT);

    // TODO: using enrolment code as default password
    student.setPassword(passwordEncoder.encode(studentDTO.getEnrollmentCode()));
    studentRepository.save(student);
    return studentMapper.toDTO(student);
  }
}

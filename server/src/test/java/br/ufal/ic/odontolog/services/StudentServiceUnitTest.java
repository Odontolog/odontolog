package br.ufal.ic.odontolog.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

import br.ufal.ic.odontolog.dtos.StudentDTO;
import br.ufal.ic.odontolog.mappers.StudentMapper;
import br.ufal.ic.odontolog.models.Student;
import br.ufal.ic.odontolog.repositories.StudentRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
public class StudentServiceUnitTest {

    @Mock private StudentRepository studentRepository;
    @Mock private StudentMapper studentMapper;
    @InjectMocks private StudentService studentService;

    private Student createStudent(UUID id, String email) {
        Student student = new Student();
        student.setId(id);
        student.setEmail(email);
        // TODO: Adicionar mais campos se necessário
        return student;
    }

    private StudentDTO createStudentDTO(UUID id, String email) {
        StudentDTO dto = new StudentDTO();
        dto.setId(id);
        dto.setEmail(email);
        // TODO: Adicionar mais campos se necessário
        return dto;
    }

    @Test
    public void givenStudentsExist_whenGetStudents_thenReturnDTOList() {
        // Arrange
        UUID id1 = UUID.randomUUID();
        UUID id2 = UUID.randomUUID();

        Student student1 = createStudent(id1, "a@example.com");
        Student student2 = createStudent(id2, "b@example.com");
        List<Student> studentList = List.of(student1, student2);

        StudentDTO dto1 = createStudentDTO(id1, "a@example.com");
        StudentDTO dto2 = createStudentDTO(id2, "b@example.com");
        List<StudentDTO> dtoList = List.of(dto1, dto2);

        when(studentRepository.findAll()).thenReturn(studentList);
        when(studentMapper.toDTOs(studentList)).thenReturn(dtoList);

        // Act
        List<StudentDTO> result = studentService.getStudents();

        // Assert
        assertThat(result).isNotNull();
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getId()).isEqualTo(id1);
        assertThat(result.get(1).getId()).isEqualTo(id2);

        verify(studentRepository, times(1)).findAll();
        verify(studentMapper, times(1)).toDTOs(studentList);
    }

    @Test
    public void givenNoStudentsExist_whenGetStudents_thenReturnEmptyList() {
        // Arrange
        List<Student> emptyStudentList = List.of();
        List<StudentDTO> emptyDTOList = List.of();

        when(studentRepository.findAll()).thenReturn(emptyStudentList);
        when(studentMapper.toDTOs(anyList())).thenReturn(emptyDTOList);

        // Act
        List<StudentDTO> result = studentService.getStudents();

        // Assert
        assertThat(result).isNotNull();
        assertThat(result).isEmpty();

        verify(studentRepository, times(1)).findAll();
        verify(studentMapper, times(1)).toDTOs(emptyStudentList);
    }

    @Test
    public void givenExistingStudent_whenGetStudentByEmail_thenReturnDTO() {
        // Arrange
        String email = "john@example.com";
        UUID id = UUID.randomUUID();

        Student student = createStudent(id, email);
        StudentDTO dto = createStudentDTO(id, email);

        when(studentRepository.findByEmail(email)).thenReturn(Optional.of(student));
        when(studentMapper.toDTO(student)).thenReturn(dto);

        // Act
        StudentDTO result = studentService.getStudentByEmail(email);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(id);
        assertThat(result.getEmail()).isEqualTo(email);

        verify(studentRepository, times(1)).findByEmail(email);
        verify(studentMapper, times(1)).toDTO(student);
    }

    @Test
    public void givenNonExistentStudent_whenGetStudentByEmail_thenThrowNotFoundException() {
        // Arrange
        String nonExistentEmail = "doesnotexist@example.com";
        when(studentRepository.findByEmail(nonExistentEmail)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception =
                assertThrows(
                        ResponseStatusException.class,
                        () -> studentService.getStudentByEmail(nonExistentEmail));

        // Verifica se a exceção tem status 404
        assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(exception.getReason()).contains("Student not found");

        verify(studentRepository, times(1)).findByEmail(nonExistentEmail);
        verify(studentMapper, never()).toDTO(any());
    }
}

package br.ufal.ic.odontolog.mappers;

import br.ufal.ic.odontolog.dtos.StudentDTO;
import br.ufal.ic.odontolog.dtos.StudentUpsertDTO;
import br.ufal.ic.odontolog.models.Student;
import java.util.List;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StudentMapper {

  StudentDTO toDTO(Student student);

  List<StudentDTO> toDTOs(List<Student> students);

  Student toEntity(StudentUpsertDTO dto);
}

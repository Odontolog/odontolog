package br.ufal.ic.odontolog.repositories;

import br.ufal.ic.odontolog.models.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {

}

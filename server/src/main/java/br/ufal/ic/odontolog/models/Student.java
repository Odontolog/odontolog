package br.ufal.ic.odontolog.models;

import br.ufal.ic.odontolog.enums.Role;
import jakarta.persistence.Entity;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Student extends User {
    int clinic_number;
    String enrollment_code;
    int enrollment_year;
    int enrollment_semester;

    public Student(String name, String email, String password, int clinic_number, String enrollment_code, int enrollment_year, int enrollment_semester) {
        super(name, email, password, Role.STUDENT);
        this.clinic_number = clinic_number;
        this.enrollment_code = enrollment_code;
        this.enrollment_year = enrollment_year;
        this.enrollment_semester = enrollment_semester;
    }
}

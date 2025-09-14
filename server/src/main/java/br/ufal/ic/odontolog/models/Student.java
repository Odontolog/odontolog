package br.ufal.ic.odontolog.models;

import jakarta.persistence.Entity;
import lombok.Data;

@Entity
@Data
public class Student extends User {
    int clinic_number;
    String enrollment_code;
    int enrollment_year;
    int enrollment_semester;
}

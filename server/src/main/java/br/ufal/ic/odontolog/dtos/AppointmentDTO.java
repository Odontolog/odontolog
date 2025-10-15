package br.ufal.ic.odontolog.dtos;

import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppointmentDTO {
  private LocalDate appointmentDate;
}

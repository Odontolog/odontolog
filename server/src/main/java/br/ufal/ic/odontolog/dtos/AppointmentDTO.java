package br.ufal.ic.odontolog.dtos;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppointmentDTO {
  @NotNull @FutureOrPresent private LocalDate appointmentDate;
}

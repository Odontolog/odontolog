package br.ufal.ic.odontolog.dtos;

import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.FutureOrPresent;
@Getter
@Setter
public class AppointmentDTO {
  @NotNull
  @FutureOrPresent
  private LocalDate appointmentDate;
}

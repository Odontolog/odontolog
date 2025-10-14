package br.ufal.ic.odontolog.dtos;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppointmentUpdateDTO {
  private LocalDateTime scheduledDate;
}

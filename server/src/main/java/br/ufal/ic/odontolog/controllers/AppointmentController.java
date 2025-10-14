package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.dtos.AppointmentUpdateDTO;
import br.ufal.ic.odontolog.models.Appointment;
import br.ufal.ic.odontolog.services.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

  private final AppointmentService appointmentService;

  @PutMapping("/{id}")
  public ResponseEntity<Appointment> updateAppointmentDate(
      @PathVariable Long id, @RequestBody @Valid AppointmentUpdateDTO dto) {

    Appointment updated = appointmentService.updateAppointmentDate(id, dto);
    return new ResponseEntity<>(updated, HttpStatus.OK);
  }
}

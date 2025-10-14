package br.ufal.ic.odontolog.services;

import br.ufal.ic.odontolog.dtos.AppointmentUpdateDTO;
import br.ufal.ic.odontolog.exceptions.ResourceNotFoundException;
import br.ufal.ic.odontolog.models.Appointment;
import br.ufal.ic.odontolog.repositories.AppointmentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AppointmentService {

  private final AppointmentRepository appointmentRepository;

  @Transactional
  public Appointment updateAppointmentDate(Long id, AppointmentUpdateDTO dto) {
    Appointment appointment =
        appointmentRepository
            .findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

    appointment.setScheduledDate(dto.getScheduledDate());
    return appointmentRepository.save(appointment);
  }
}

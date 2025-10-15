package br.ufal.ic.odontolog.services;

import static org.springframework.http.HttpStatus.NOT_FOUND;

import br.ufal.ic.odontolog.dtos.AppointmentDTO;
import br.ufal.ic.odontolog.dtos.PatientDTO;
import br.ufal.ic.odontolog.exceptions.ResourceNotFoundException;
import br.ufal.ic.odontolog.mappers.PatientMapper;
import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.repositories.PatientRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PatientService {

  private final PatientRepository patientRepository;
  private final PatientMapper patientMapper;

  public PatientService(PatientRepository patientRepository, PatientMapper patientMapper) {
    this.patientRepository = patientRepository;
    this.patientMapper = patientMapper;
  }

  public List<PatientDTO> getPatients() {
    List<Patient> patients = patientRepository.findAll();
    return patientMapper.toDTOList(patients);
  }

  public PatientDTO getPatientById(Long id) {
    Patient patient =
        patientRepository
            .findById(id)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Patient not found"));
    return patientMapper.toDTO(patient);
  }

  public AppointmentDTO getNextAppointment(Long id) {
    Patient patient =
        patientRepository
            .findById(id)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Patient not found"));

    AppointmentDTO appointmentDTO = new AppointmentDTO();
    appointmentDTO.setAppointmentDate(patient.getAppointmentDate());
    return appointmentDTO;
  }

  @Transactional
  public Patient updateNextAppointment(Long id, AppointmentDTO dto) {
    Patient patient =
        patientRepository
            .findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

    patient.setAppointmentDate(dto.getAppointmentDate());
    return patientRepository.save(patient);
  }
}

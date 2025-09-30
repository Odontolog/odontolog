package br.ufal.ic.odontolog.services;

import static org.springframework.http.HttpStatus.NOT_FOUND;

import br.ufal.ic.odontolog.dtos.PatientDTO;
import br.ufal.ic.odontolog.mappers.PatientMapper;
import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.repositories.PatientRepository;
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
}

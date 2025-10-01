package br.ufal.ic.odontolog.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

import br.ufal.ic.odontolog.dtos.PatientDTO;
import br.ufal.ic.odontolog.mappers.PatientMapper;
import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.repositories.PatientRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus; // Adicionado para verificação de status

@ExtendWith(MockitoExtension.class)
public class PatientServiceUnitTest {

    @Mock private PatientRepository patientRepository;
    @Mock private PatientMapper patientMapper;
    @InjectMocks private PatientService patientService;

    private Patient createPatient(Long id) {
        Patient patient = new Patient();
        patient.setId(id);
        // TODO: Add more fields to test
        return patient;
    }

    private PatientDTO createPatientDTO(Long id) {
        PatientDTO dto = new PatientDTO();
        dto.setId(id);
        // TODO: Add more fields to test
        return dto;
    }

    @Test
    public void givenPatientsExist_whenGetPatients_thenReturnDTOList() {
        // Arrange
        Patient patient1 = createPatient(1L);
        Patient patient2 = createPatient(2L);
        List<Patient> patientList = List.of(patient1, patient2);

        PatientDTO dto1 = createPatientDTO(1L);
        PatientDTO dto2 = createPatientDTO(2L);
        List<PatientDTO> dtoList = List.of(dto1, dto2);

        when(patientRepository.findAll()).thenReturn(patientList);
        when(patientMapper.toDTOList(patientList)).thenReturn(dtoList);

        // Act
        List<PatientDTO> result = patientService.getPatients();

        // Assert
        assertThat(result).isNotNull();
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getId()).isEqualTo(1L);
        assertThat(result.get(1).getId()).isEqualTo(2L);

        verify(patientRepository, times(1)).findAll();
        verify(patientMapper, times(1)).toDTOList(patientList);
    }

    @Test
    public void givenNoPatientsExist_whenGetPatients_thenReturnEmptyList() {
        // Arrange
        List<Patient> emptyPatientList = List.of();
        List<PatientDTO> emptyDTOList = List.of();

        when(patientRepository.findAll()).thenReturn(emptyPatientList);
        // Usamos anyList() para o mapper, pois a lista vazia é trivial
        when(patientMapper.toDTOList(anyList())).thenReturn(emptyDTOList);

        // Act
        List<PatientDTO> result = patientService.getPatients();

        // Assert
        assertThat(result).isNotNull();
        assertThat(result).isEmpty();

        verify(patientRepository, times(1)).findAll();
        verify(patientMapper, times(1)).toDTOList(emptyPatientList);
    }

    @Test
    public void givenExistingPatient_whenGetPatientById_thenReturnDTO() {
        // Arrange
        Patient patient = createPatient(1L);
        PatientDTO dto = createPatientDTO(1L);

        when(patientRepository.findById(1L)).thenReturn(Optional.of(patient));
        when(patientMapper.toDTO(patient)).thenReturn(dto);

        // Act
        PatientDTO result = patientService.getPatientById(1L);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);

        verify(patientRepository, times(1)).findById(1L);
        verify(patientMapper, times(1)).toDTO(patient);
    }

    @Test
    public void givenNonExistentPatient_whenGetPatientById_thenThrowNotFoundException() {
        // Arrange
        Long nonExistentId = 999L;
        when(patientRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> patientService.getPatientById(nonExistentId));

        // Assert Adicional: Verifica se o status HTTP é NOT_FOUND (404)
        assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);

        verify(patientRepository, times(1)).findById(nonExistentId);
        verify(patientMapper, never()).toDTO(any());
    }
}
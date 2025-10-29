package br.ufal.ic.odontolog.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;
import static org.springframework.http.HttpStatus.NOT_FOUND;

import br.ufal.ic.odontolog.dtos.*;
import br.ufal.ic.odontolog.mappers.PatientMapper;
import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import br.ufal.ic.odontolog.repositories.PatientRepository;
import java.time.LocalDate;
import java.util.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
public class PatientServiceUnitTest {

  @Mock
  private PatientRepository patientRepository;
  @Mock
  private PatientMapper patientMapper;
  @InjectMocks
  private PatientService patientService;

  private Patient createPatient(Long id) {
    Patient patient = new Patient();
    patient.setId(id);
    patient.setName("Patient " + id);
    patient.setDeleted(false);
    patient.setAppointmentDate(LocalDate.of(2025, 10, 21));
    return patient;
  }

  private PatientDTO createPatientDTO(Long id) {
    PatientDTO dto = new PatientDTO();
    dto.setId(id);
    dto.setName("Patient " + id);
    return dto;
  }

  @Test
  public void givenPatientsExist_whenGetPatients_thenReturnDTOList() {
    List<Patient> patients = List.of(createPatient(1L), createPatient(2L));
    List<PatientDTO> dtoList = List.of(createPatientDTO(1L), createPatientDTO(2L));

    when(patientRepository.findAllActive()).thenReturn(patients);
    when(patientMapper.toDTOList(patients)).thenReturn(dtoList);

    List<PatientDTO> result = patientService.getPatients();

    assertThat(result).hasSize(2);
    verify(patientRepository).findAllActive();
    verify(patientMapper).toDTOList(patients);
  }

  @Test
  public void givenNoPatientsExist_whenGetPatients_thenReturnEmptyList() {
    when(patientRepository.findAllActive()).thenReturn(Collections.emptyList());
    when(patientMapper.toDTOList(anyList())).thenReturn(Collections.emptyList());

    List<PatientDTO> result = patientService.getPatients();

    assertThat(result).isEmpty();
    verify(patientRepository).findAllActive();
  }

  @Test
  public void givenExistingPatient_whenGetPatientById_thenReturnDTO() {
    Patient patient = createPatient(1L);
    PatientDTO dto = createPatientDTO(1L);

    when(patientRepository.findById(1L)).thenReturn(Optional.of(patient));
    when(patientMapper.toDTO(patient)).thenReturn(dto);

    PatientDTO result = patientService.getPatientById(1L);

    assertThat(result.getId()).isEqualTo(1L);
    verify(patientRepository).findById(1L);
  }

  @Test
  public void givenNonExistentPatient_whenGetPatientById_thenThrowException() {
    when(patientRepository.findById(99L)).thenReturn(Optional.empty());

    ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> patientService.getPatientById(99L));

    assertThat(ex.getStatusCode()).isEqualTo(NOT_FOUND);
    verify(patientRepository).findById(99L);
  }

  @Test
  public void whenCreatePatient_thenReturnDTO() {
    PatientUpsertDTO dto = new PatientUpsertDTO();
    Patient patient = createPatient(1L);
    PatientDTO response = createPatientDTO(1L);

    when(patientMapper.toEntity(dto)).thenReturn(patient);
    when(patientMapper.toDTO(patient)).thenReturn(response);

    PatientDTO result = patientService.createPatient(dto);

    assertThat(result.getId()).isEqualTo(1L);
    verify(patientRepository).save(patient);
  }

  @Test
  public void givenExistingPatient_whenUpdate_thenSaveUpdated() {
    PatientUpsertDTO dto = new PatientUpsertDTO();
    Patient patient = createPatient(1L);
    PatientDTO response = createPatientDTO(1L);

    when(patientRepository.findById(1L)).thenReturn(Optional.of(patient));
    when(patientMapper.toDTO(patient)).thenReturn(response);

    PatientDTO result = patientService.updatePatient(1L, dto);

    assertThat(result.getId()).isEqualTo(1L);
    verify(patientMapper).updateEntityFromDto(dto, patient);
    verify(patientRepository).save(patient);
  }

  @Test
  public void givenExistingPatient_whenSoftDelete_thenSetDeletedTrue() {
    Patient patient = createPatient(1L);
    when(patientRepository.findById(1L)).thenReturn(Optional.of(patient));

    patientService.deletePatient(1L, true);

    assertThat(patient.isDeleted()).isTrue();
    verify(patientRepository).save(patient);
  }

  @Test
  public void givenExistingPatient_whenHardDelete_thenRepositoryDeleteCalled() {
    Patient patient = createPatient(1L);
    when(patientRepository.findById(1L)).thenReturn(Optional.of(patient));

    patientService.deletePatient(1L, false);

    verify(patientRepository).delete(patient);
  }

  @Test
  public void givenSoftDeletedPatient_whenRestore_thenDeletedIsFalse() {
    Patient patient = createPatient(1L);
    patient.setDeleted(true);
    when(patientRepository.findById(1L)).thenReturn(Optional.of(patient));

    patientService.restorePatient(1L);

    assertThat(patient.isDeleted()).isFalse();
    verify(patientRepository).save(patient);
  }

  @Test
  public void givenExistingPatient_whenGetNextAppointment_thenReturnAppointmentDTO() {
    Patient patient = createPatient(1L);
    when(patientRepository.findById(1L)).thenReturn(Optional.of(patient));

    AppointmentDTO result = patientService.getNextAppointment(1L);

    assertThat(result.getAppointmentDate()).isEqualTo(patient.getAppointmentDate());
  }

  @Test
  public void givenExistingPatient_whenUpdateNextAppointment_thenDateIsUpdated() {
    Patient patient = createPatient(1L);
    AppointmentDTO dto = new AppointmentDTO();
    dto.setAppointmentDate(LocalDate.of(2025, 10, 22));

    when(patientRepository.findById(1L)).thenReturn(Optional.of(patient));

    AppointmentDTO result = patientService.updateNextAppointment(1L, dto);

    assertThat(result.getAppointmentDate()).isEqualTo(dto.getAppointmentDate());
  }

  @Test
  public void whenSearchForPatients_thenReturnCombinedDTOs() {
    Patient patient = createPatient(1L);
    TreatmentPlan plan = new TreatmentPlan();
    plan.setId(10L);
    plan.setPatient(patient);

    when(patientRepository.searchPatients(any(), any(PageRequest.class)))
        .thenReturn(new PageImpl<>(List.of(patient)));
    when(patientRepository.findLastTreatmentPlans(List.of(1L))).thenReturn(List.of(plan));

    List<PatientAndTreatmentPlanDTO> result = patientService.searchForPatients(Optional.of("test"));

    assertThat(result).hasSize(1);
    assertThat(result.get(0).getId()).isEqualTo(1L);
  }
}

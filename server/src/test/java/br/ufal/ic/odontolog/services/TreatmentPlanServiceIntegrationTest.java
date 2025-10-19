package br.ufal.ic.odontolog.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import br.ufal.ic.odontolog.dtos.CreateTreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanShortDTO;
import br.ufal.ic.odontolog.enums.ActivityType;
import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import br.ufal.ic.odontolog.models.Activity;
import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import br.ufal.ic.odontolog.repositories.PatientRepository;
import br.ufal.ic.odontolog.repositories.SupervisorRepository;
import br.ufal.ic.odontolog.repositories.TreatmentPlanRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class TreatmentPlanServiceIntegrationTest {

  @Autowired private TreatmentPlanService treatmentPlanService;
  @Autowired private PatientRepository patientRepository;
  @Autowired private TreatmentPlanRepository treatmentPlanRepository;
  @Autowired private SupervisorRepository supervisorRepository;

  private Patient patient;

  @BeforeEach
  void setup() {

    patient = patientRepository.save(Patient.builder().name("Patient_Test_001").build());

    supervisorRepository
        .findByEmail("supervisor@test.com")
        .orElseGet(
            () ->
                supervisorRepository.save(
                    Supervisor.builder().email("supervisor@test.com").build()));
  }

  @Test
  @WithMockUser(
      username = "supervisor@test.com",
      roles = {"SUPERVISOR"})
  void createTreatmentPlan_success() {
    CreateTreatmentPlanDTO dto = new CreateTreatmentPlanDTO();
    dto.setPatientId(patient.getId());

    TreatmentPlanDTO plan = treatmentPlanService.createTreatmentPlan(dto);

    assertThat(plan.getId()).isNotNull();
    assertThat(plan.getStatus()).isEqualTo(TreatmentPlanStatus.DRAFT);
    assertThat(plan.getReviewers().size()).isEqualTo(0);

    TreatmentPlan fromDb = treatmentPlanRepository.findById(plan.getId()).orElseThrow();
    assertThat(fromDb.getPatient().getId()).isEqualTo(patient.getId());

    assertThat(fromDb.getHistory()).hasSize(1);

    Activity activity = fromDb.getHistory().iterator().next();
    assertThat(activity.getType()).isEqualTo(ActivityType.CREATED);
    assertThat(activity.getActor().getEmail()).isEqualTo("supervisor@test.com");
    assertThat(activity.getDescription())
        .contains("Plano de Tratamento")
        .contains("criado para")
        .contains(patient.getName());
  }

  @Test
  void createTreatmentPlan_patientNotFound() {
    CreateTreatmentPlanDTO dto = new CreateTreatmentPlanDTO();
    dto.setPatientId(1234L);

    assertThrows(
        EntityNotFoundException.class, () -> treatmentPlanService.createTreatmentPlan(dto));
  }

  @Test
  void getTreatmentPlansByPatientId_returnsPlansForPatient() {
    TreatmentPlan plan =
        TreatmentPlan.builder().patient(patient).status(TreatmentPlanStatus.DRAFT).build();
    plan = treatmentPlanRepository.save(plan);

    List<TreatmentPlanShortDTO> result =
        treatmentPlanService.getTreatmentPlansByPatientId(patient.getId());

    assertThat(result).isNotEmpty();
    assertThat(result.get(0).getId()).isEqualTo(plan.getId());
  }
}

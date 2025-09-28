package br.ufal.ic.odontolog.controllers;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.repositories.PatientRepository;
import br.ufal.ic.odontolog.repositories.SupervisorRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class TreatmentPlanControllerIntegrationTest {

  @Autowired MockMvc mockMvc;
  @Autowired PatientRepository patientRepository;
  @Autowired private SupervisorRepository supervisorRepository;

  private Patient patient;

  @BeforeEach
  void setupPatient() {
    patient = patientRepository.save(Patient.builder().name("Patient_Test_001").build());

    supervisorRepository
        .findByEmail("supervisor@test.com")
        .orElseGet(
            () ->
                supervisorRepository.save(
                    new Supervisor(
                        "Supervisor_Test_001",
                        "supervisor@test.com",
                        "password2",
                        "Surgery",
                        "20250832",
                        "some-url")));
  }

  @Test
  @DisplayName("Deve negar acesso sem token")
  void createWithoutToken() throws Exception {
    var body = """
        {"patientId":"%s"}
        """.formatted(patient.getId());

    mockMvc
        .perform(post("/api/v1/treatment-plan").contentType(APPLICATION_JSON).content(body))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(
      username = "supervisor@test.com",
      roles = {"XALALA"})
  void createWithInvalidRole() throws Exception {
    var body = """
        {"patientId":"%s"}
        """.formatted(patient.getId());

    mockMvc
        .perform(post("/api/v1/treatment-plan").contentType(APPLICATION_JSON).content(body))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(
      username = "supervisor@test.com",
      roles = {"SUPERVISOR"})
  void createWithSupervisorRole() throws Exception {
    var body = """
        {"patientId":"%s"}
        """.formatted(patient.getId());

    mockMvc
        .perform(post("/api/v1/treatment-plan").contentType(APPLICATION_JSON).content(body))
        .andExpect(status().isOk())
        .andReturn();
  }

  @Test
  @WithMockUser(
      username = "supervisor@test.com",
      roles = {"STUDENT"})
  void createWithStudentRole() throws Exception {
    var body = """
        {"patientId":"%s"}
        """.formatted(patient.getId());

    mockMvc
        .perform(post("/api/v1/treatment-plan").contentType(APPLICATION_JSON).content(body))
        .andExpect(status().isOk());
  }

    @Test
    @WithMockUser(
            username = "supervisor@test.com",
            roles = {"STUDENT"})
    void createWithWrongPatient() throws Exception {
        var body = """
        {"patientId":"%s"}
        """.formatted(UUID.randomUUID());

        mockMvc
                .perform(post("/api/v1/treatment-plan").contentType(APPLICATION_JSON).content(body))
                .andExpect(status().is4xxClientError());
    }
}

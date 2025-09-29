package br.ufal.ic.odontolog.controllers;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.ufal.ic.odontolog.dtos.TreatmentPlanDTO;
import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.repositories.PatientRepository;
import br.ufal.ic.odontolog.repositories.SupervisorRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class TreatmentPlanControllerIntegrationTest {

  @Autowired MockMvc mockMvc;
  @Autowired PatientRepository patientRepository;
  @Autowired private SupervisorRepository supervisorRepository;
  @Autowired ObjectMapper objectMapper;

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

  @Test
  @WithMockUser(
      username = "supervisor@test.com",
      roles = {"SUPERVISOR"})
  void createAndGetTreatmentPlan() throws Exception {
    // 1. Cria plano
    var createBody = """
        {"patientId":"%s"}
        """.formatted(patient.getId());

    var postResult =
        mockMvc
            .perform(
                post("/api/v1/treatment-plan").contentType(APPLICATION_JSON).content(createBody))
            .andExpect(status().isOk())
            .andReturn();

    String postJson = postResult.getResponse().getContentAsString();
    TreatmentPlanDTO created = objectMapper.readValue(postJson, TreatmentPlanDTO.class);

    assertThat(created.getId()).isNotNull();
    assertThat(created.getProcedures()).isEqualTo(List.of());

    var getResult =
        mockMvc
            .perform(
                get("/api/v1/treatment-plan/{id}", created.getId()).contentType(APPLICATION_JSON))
            .andExpect(status().isOk())
            .andReturn();

    String getJson = getResult.getResponse().getContentAsString();
    TreatmentPlanDTO fetched = objectMapper.readValue(getJson, TreatmentPlanDTO.class);

    assertThat(fetched.getId()).isEqualTo(created.getId());
    assertThat(fetched.getStatus()).isEqualTo(TreatmentPlanStatus.DRAFT);
    assertThat(fetched.getProcedures()).isEqualTo(List.of());
  }

  @Test
  @WithMockUser(
      username = "supervisor@test.com",
      roles = {"SUPERVISOR"})
  @DisplayName("GET retorna 404 quando plano não existe")
  void getTreatmentPlan_notFound() throws Exception {
    mockMvc
        .perform(
            get("/api/v1/treatment-plan/{id}", UUID.randomUUID()).contentType(APPLICATION_JSON))
        .andExpect(status().isNotFound());
  }
}

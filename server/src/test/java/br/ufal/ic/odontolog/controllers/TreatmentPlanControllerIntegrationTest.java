package br.ufal.ic.odontolog.controllers;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.ufal.ic.odontolog.dtos.TreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanShortDTO;
import br.ufal.ic.odontolog.enums.ReviewableType;
import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import br.ufal.ic.odontolog.repositories.PatientRepository;
import br.ufal.ic.odontolog.repositories.SupervisorRepository;
import br.ufal.ic.odontolog.repositories.TreatmentPlanRepository;
import io.awspring.cloud.s3.S3Template;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class TreatmentPlanControllerIntegrationTest {

    @Autowired
    MockMvc mockMvc;
    @Autowired
    PatientRepository patientRepository;
    @Autowired
    private SupervisorRepository supervisorRepository;
    @Autowired
    ObjectMapper objectMapper;
    @Autowired
    TreatmentPlanRepository treatmentPlanRepository;
    @MockitoBean
    S3Template s3Template;

    private Patient patient;
    private Supervisor supervisor;

    @BeforeEach
    void setupPatient() {
        patient = patientRepository.save(Patient.builder().name("Patient_Test_001").build());

        supervisor = supervisorRepository
                .findByEmail("supervisor@test.com")
                .orElseGet(
                        () -> supervisorRepository.save(
                                Supervisor.builder()
                                        .name("supervisor 1")
                                        .email("supervisor@test.com")
                                        .build()));
    }

    @Test
    @DisplayName("Deve negar acesso sem token")
    void createWithoutToken() throws Exception {
        var body = """
                {"patientId":"%s"}
                """.formatted(patient.getId());

        mockMvc
                .perform(post("/api/treatment-plan").contentType(APPLICATION_JSON).content(body))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "supervisor@test.com", roles = { "XALALA" })
    void createWithInvalidRole() throws Exception {
        var body = """
                {"patientId":"%s"}
                """.formatted(patient.getId());

        mockMvc
                .perform(post("/api/treatment-plan").contentType(APPLICATION_JSON).content(body))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "supervisor@test.com", roles = { "SUPERVISOR" })
    void createWithSupervisorRole() throws Exception {
        var body = """
                {"patientId":"%s"}
                """.formatted(patient.getId());

        mockMvc
                .perform(post("/api/treatment-plan").contentType(APPLICATION_JSON).content(body))
                .andExpect(status().isOk())
                .andReturn();
    }

    @Test
    @WithMockUser(username = "supervisor@test.com", roles = { "STUDENT" })
    void createWithStudentRole() throws Exception {
        var body = """
                {"patientId":"%s"}
                """.formatted(patient.getId());

        mockMvc
                .perform(post("/api/treatment-plan").contentType(APPLICATION_JSON).content(body))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "supervisor@test.com", roles = { "STUDENT" })
    void createWithWrongPatient() throws Exception {
        var body = """
                {"patientId":"%s"}
                """.formatted(UUID.randomUUID());

        mockMvc
                .perform(post("/api/treatment-plan").contentType(APPLICATION_JSON).content(body))
                .andExpect(status().is4xxClientError());
    }

    @Test
    @WithMockUser(username = "supervisor@test.com", roles = { "SUPERVISOR" })
    void createAndGetTreatmentPlan() throws Exception {
        // 1. Cria plano
        var createBody = """
                {"patientId":"%s"}
                """.formatted(patient.getId());

        var postResult = mockMvc
                .perform(post("/api/treatment-plan").contentType(APPLICATION_JSON).content(createBody))
                .andExpect(status().isOk())
                .andReturn();

        String postJson = postResult.getResponse().getContentAsString();
        TreatmentPlanDTO created = objectMapper.readValue(postJson, TreatmentPlanDTO.class);

        assertThat(created.getId()).isNotNull();
        assertThat(created.getProcedures()).isEqualTo(List.of());

        var getResult = mockMvc
                .perform(get("/api/treatment-plan/{id}", created.getId()).contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        String getJson = getResult.getResponse().getContentAsString();
        TreatmentPlanDTO fetched = objectMapper.readValue(getJson, TreatmentPlanDTO.class);

        assertThat(fetched.getId()).isEqualTo(created.getId());
        assertThat(fetched.getStatus()).isEqualTo(TreatmentPlanStatus.DRAFT);
        assertThat(fetched.getProcedures()).isEqualTo(List.of());
    }

    @Test
    @WithMockUser(username = "supervisor@test.com", roles = { "SUPERVISOR" })
    @DisplayName("GET retorna 404 quando plano não existe")
    void getTreatmentPlan_notFound() throws Exception {
        mockMvc
                .perform(get("/api/treatment-plan/{id}", 1234L).contentType(APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "supervisor@test.com", roles = { "SUPERVISOR" })
    void getTreatmentPlansByPatient_returnsPlans() throws Exception {
        TreatmentPlan plan = TreatmentPlan.builder()
                .patient(patient)
                .status(TreatmentPlanStatus.DRAFT)
                .assignee(supervisor)
                .type(ReviewableType.TREATMENT_PLAN)
                .notes("Xalala!")
                .build();

        TreatmentPlan plan2 = TreatmentPlan.builder()
                .patient(patient)
                .status(TreatmentPlanStatus.DRAFT)
                .assignee(supervisor)
                .type(ReviewableType.TREATMENT_PLAN)
                .notes("Xalala2!")
                .build();
        treatmentPlanRepository.saveAll(List.of(plan, plan2));

        String response = mockMvc
                .perform(
                        get("/api/patients/" + patient.getId() + "/treatment-plan")
                                .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        List<TreatmentPlanShortDTO> dtos = objectMapper.readerForListOf(TreatmentPlanShortDTO.class)
                .readValue(response);
        assertThat(dtos.size()).isEqualTo(2);
        assertThat(dtos.stream().anyMatch(dto -> "Xalala!".equals(dto.getNotes()))).isTrue();
        assertThat(dtos.stream().anyMatch(dto -> "Xalala2!".equals(dto.getNotes()))).isTrue();
        assertThat(dtos.stream().allMatch(dto -> dto.getStatus() == TreatmentPlanStatus.DRAFT))
                .isTrue();
        assertThat(dtos.stream().allMatch(dto -> dto.getPatient().getId().equals(patient.getId())))
                .isTrue();
    }
}

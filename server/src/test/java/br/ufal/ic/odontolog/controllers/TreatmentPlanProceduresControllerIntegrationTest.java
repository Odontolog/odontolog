package br.ufal.ic.odontolog.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.ufal.ic.odontolog.dtos.TreatmentPlanDTO;
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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
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
class TreatmentPlanProceduresControllerIntegrationTest {

    @Autowired
    MockMvc mockMvc;
    @Autowired
    PatientRepository patientRepository;
    @Autowired
    SupervisorRepository supervisorRepository;
    @Autowired
    TreatmentPlanRepository treatmentPlanRepository;
    @Autowired
    ObjectMapper objectMapper;
    @MockitoBean
    S3Template s3Template;

    private Patient patient;
    private Supervisor supervisor;
    private TreatmentPlan plan;

    @BeforeEach
    void setup() {
        patient = patientRepository.save(Patient.builder().name("Patient_Proc_Test").build());

        supervisor = supervisorRepository
                .findByEmail("supervisor@test.com")
                .orElseGet(
                        () -> supervisorRepository.save(
                                Supervisor.builder()
                                        .name("supervisor 1")
                                        .email("supervisor@test.com")
                                        .build()));

        plan = treatmentPlanRepository.save(
                TreatmentPlan.builder()
                        .patient(patient)
                        .assignee(supervisor)
                        .type(ReviewableType.TREATMENT_PLAN)
                        .status(TreatmentPlanStatus.DRAFT)
                        .build());
    }

    @Test
    @WithMockUser(username = "supervisor@test.com", roles = { "SUPERVISOR" })
    @DisplayName("Add, update, and remove a procedure in TP")
    void addUpdateRemoveProcedure() throws Exception {
        // Add procedure
        String addBody = """
                {
                  "name": "Restoration",
                  "teeth": ["11","12"],
                  "plannedSession": 2,
                  "studySector": "Dentística"
                }
                """;

        String addResponse = mockMvc
                .perform(
                        post("/api/treatment-plan/{id}/procedures", plan.getId())
                                .contentType(APPLICATION_JSON)
                                .content(addBody))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        TreatmentPlanDTO afterAdd = objectMapper.readValue(addResponse, TreatmentPlanDTO.class);

        assertThat(afterAdd.getProcedures()).hasSize(1);
        assertThat(afterAdd.getProcedures().get(0).getName()).isEqualTo("Restoration");
        assertThat(afterAdd.getProcedures().get(0).getPlannedSession()).isEqualTo(2);
        assertThat(afterAdd.getProcedures().get(0).getStudySector()).isEqualTo("Dentística");
        assertThat(afterAdd.getProcedures().get(0).getTeeth()).containsExactlyInAnyOrder("11", "12");

        Long procedureId = afterAdd.getProcedures().get(0).getId();

        // Update procedure
        String updateBody = """
                {
                  "name": "Restoration Modified",
                  "teeth": ["21"],
                  "plannedSession": 3,
                  "studySector": "Endodontia"
                }
                """;

        String updateResponse = mockMvc
                .perform(
                        put("/api/treatment-plan/{id}/procedures/{pid}", plan.getId(), procedureId)
                                .contentType(APPLICATION_JSON)
                                .content(updateBody))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        TreatmentPlanDTO afterUpdate = objectMapper.readValue(updateResponse, TreatmentPlanDTO.class);
        assertThat(afterUpdate.getProcedures()).hasSize(1);
        assertThat(afterUpdate.getProcedures().get(0).getName()).isEqualTo("Restoration Modified");
        assertThat(afterUpdate.getProcedures().get(0).getPlannedSession()).isEqualTo(3);
        assertThat(afterUpdate.getProcedures().get(0).getStudySector()).isEqualTo("Endodontia");
        assertThat(afterUpdate.getProcedures().get(0).getTeeth()).containsExactly("21");

        mockMvc
                .perform(
                        delete("/api/treatment-plan/{id}/procedures/{pid}", plan.getId(), procedureId)
                                .contentType(APPLICATION_JSON))
                .andExpect(status().isOk());

        // Buscar o plano após a deleção
        String getResponse = mockMvc
                .perform(get("/api/treatment-plan/{id}", plan.getId()).contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        TreatmentPlanDTO afterDelete = objectMapper.readValue(getResponse, TreatmentPlanDTO.class);
        System.out.println(
                objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(afterDelete));

        // O procedimento removido deve estar marcado como deletado
        afterDelete
                .getProcedures()
                .forEach(
                        procedure -> {
                            if (procedure.getId().equals(procedureId)) {
                                System.out.println(procedure.getDeleted());
                                assertThat(procedure.getDeleted()).isTrue();
                            }
                        });
        assertThat(afterDelete.getHistory()).isNotEmpty();
        boolean hasRemovalActivity = afterDelete.getHistory().stream()
                .anyMatch(
                        a -> a.getType().name().equals("EDITED")
                                && a.getDescription()
                                        .toLowerCase()
                                        .contains("removido do plano de tratamento"));
        assertThat(hasRemovalActivity).isTrue().as("hasRemovalActivity");
    }
}

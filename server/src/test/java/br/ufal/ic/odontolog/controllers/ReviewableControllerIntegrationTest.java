package br.ufal.ic.odontolog.controllers;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.ufal.ic.odontolog.dtos.ActivityDTO;
import br.ufal.ic.odontolog.dtos.ReviewableDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanDTO;
import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.repositories.PatientRepository;
import br.ufal.ic.odontolog.repositories.SupervisorRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.stream.Collectors;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
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
public class ReviewableControllerIntegrationTest {
  @Autowired MockMvc mockMvc;
  @Autowired PatientRepository patientRepository;
  @Autowired private SupervisorRepository supervisorRepository;
  @Autowired ObjectMapper objectMapper;

  private Patient patient;
  private Supervisor supervisor;

  @BeforeEach
  void setupPatient() {
    patient = patientRepository.save(Patient.builder().name("Patient_Test_001").build());

    supervisor =
        supervisorRepository
            .findByEmail("supervisor@test.com")
            .orElseGet(
                () ->
                    supervisorRepository.save(
                        Supervisor.builder()
                            .name("supervisor 1")
                            .email("supervisor@test.com")
                            .build()));
  }

  @Test
  @WithMockUser(
      username = "supervisor@test.com",
      roles = {"SUPERVISOR"})
  void updateNotes_createsActivityAndUpdatesNotes() throws Exception {
    var createBody = """
        {"patientId":"%s"}
        """.formatted(patient.getId());

    String postJson =
        mockMvc
            .perform(post("/api/treatment-plan").contentType(APPLICATION_JSON).content(createBody))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
    TreatmentPlanDTO created = objectMapper.readValue(postJson, TreatmentPlanDTO.class);

    var patchBody = """
        {"notes": "New notes value"}
        """;
    String patchJson =
        mockMvc
            .perform(
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch(
                        "/api/reviewables/" + created.getId() + "/notes")
                    .contentType(APPLICATION_JSON)
                    .content(patchBody))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
    ReviewableDTO updated = objectMapper.readValue(patchJson, ReviewableDTO.class);
    assertThat(updated.getNotes()).isEqualTo("New notes value");

    var activities = updated.getHistory();
    activities.sort((a, b) -> a.getCreatedAt().compareTo(b.getCreatedAt()));
    assertThat(activities.size()).isGreaterThan(0);
    var lastActivity = activities.get(activities.size() - 1);
    assertThat(lastActivity.getDescription())
        .isEqualTo(
            "Observações atualizadas por "
                + supervisor.getName()
                + " ("
                + supervisor.getEmail()
                + ")");

    var metadata = lastActivity.getMetadata();

    assertThat(metadata.get("data")).isEqualTo("New notes value");
    assertThat(metadata.get("oldData")).isNull();

    // New round to ensure oldData is also captured
    patchBody = """
        {"notes": "New notes value 2"}
        """;
    patchJson =
        mockMvc
            .perform(
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch(
                        "/api/reviewables/" + created.getId() + "/notes")
                    .contentType(APPLICATION_JSON)
                    .content(patchBody))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
    updated = objectMapper.readValue(patchJson, ReviewableDTO.class);
    assertThat(updated.getNotes()).isEqualTo("New notes value 2");

    activities = updated.getHistory();
    activities.sort((a, b) -> a.getCreatedAt().compareTo(b.getCreatedAt()));
    assertThat(activities.size()).isGreaterThan(1);
    lastActivity = activities.get(activities.size() - 1);
    assertThat(lastActivity.getDescription())
        .isEqualTo(
            "Observações atualizadas por "
                + supervisor.getName()
                + " ("
                + supervisor.getEmail()
                + ")");
  }

  @Test
  @WithMockUser(
      username = "supervisor@test.com",
      roles = {"SUPERVISOR"})
  void updateReviewers_createsActivityForAddAndRemove() throws Exception {
    var createBody = """
      {"patientId":"%s"}
      """.formatted(patient.getId());

    String postJson =
        mockMvc
            .perform(post("/api/treatment-plan").contentType(APPLICATION_JSON).content(createBody))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
    TreatmentPlanDTO created = objectMapper.readValue(postJson, TreatmentPlanDTO.class);

    Supervisor supervisor2 =
        supervisorRepository.save(
            Supervisor.builder().name("supervisor 2").email("supervisor2@test.com").build());

    // Adicionar 2 supervisores
    var putBody1 = """
      {"supervisorIds": ["%s"]}
      """.formatted(supervisor.getId());

    String putJson1 =
        mockMvc
            .perform(
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put(
                        "/api/reviewables/" + created.getId() + "/reviewers")
                    .contentType(APPLICATION_JSON)
                    .content(putBody1))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();

    ReviewableDTO updated1 = objectMapper.readValue(putJson1, ReviewableDTO.class);
    assertThat(updated1.getReviewers().size()).isEqualTo(1);

    var activities1 = updated1.getHistory();
    activities1.sort((a, b) -> a.getCreatedAt().compareTo(b.getCreatedAt()));
    var lastActivity1 = activities1.get(activities1.size() - 1);
    assertThat(lastActivity1.getDescription()).contains("selecionado").contains("supervisor 1");

    // Remover supervisores
    var putBody2 = """
      {"supervisorIds": ["%s"]}
      """.formatted(supervisor2.getId());

    String putJson2 =
        mockMvc
            .perform(
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put(
                        "/api/reviewables/" + created.getId() + "/reviewers")
                    .contentType(APPLICATION_JSON)
                    .content(putBody2))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();

    ReviewableDTO updated2 = objectMapper.readValue(putJson2, ReviewableDTO.class);
    assertThat(updated2.getReviewers().size()).isEqualTo(1);

    var activities2 = updated2.getHistory();
    activities2.sort((a, b) -> a.getCreatedAt().compareTo(b.getCreatedAt()));
    var lastActivities = activities2.subList(activities2.size() - 2, activities2.size());

    List<String> descriptions =
        lastActivities.stream().map(ActivityDTO::getDescription).collect(Collectors.toList());

    assertEquals(2, descriptions.size(), "esperava 2 activities criadas nesta operação");

    assertTrue(
        descriptions.stream().anyMatch(d -> d.contains("removido") && d.contains("supervisor 1")),
        "esperava encontrar uma activity de remoção contendo 'removido' e 'supervisor 1'");
    assertTrue(
        descriptions.stream()
            .anyMatch(d -> d.contains("selecionado") && d.contains("supervisor 2")),
        "esperava encontrar uma activity de adição contendo 'selecionado' e 'supervisor 2'");
  }
}

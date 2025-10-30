package br.ufal.ic.odontolog.controllers;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.ufal.ic.odontolog.enums.Role;
import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.Student;
import br.ufal.ic.odontolog.repositories.PatientRepository;
import br.ufal.ic.odontolog.repositories.StudentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AnamneseControllerIntegrationTest {

  @Autowired MockMvc mockMvc;
  @Autowired ObjectMapper objectMapper;
  @Autowired StudentRepository studentRepository;
  @Autowired PatientRepository patientRepository;
  @Autowired PasswordEncoder passwordEncoder;

  private static final String USERNAME = "student.anamnese@test.com";
  private static final String PASSWORD = "password";

  private Long patientId;

  @BeforeEach
  void setup() {
    // Seed a student user for authentication
    studentRepository
        .findByEmail(USERNAME)
        .orElseGet(
            () ->
                studentRepository.save(
                    Student.builder()
                        .name("Student_Anamnese")
                        .email(USERNAME)
                        .password(passwordEncoder.encode(PASSWORD))
                        .clinicNumber(1)
                        .enrollmentCode("20250001")
                        .enrollmentYear(2025)
                        .enrollmentSemester(1)
                        .photoUrl("some-url")
                        .role(Role.STUDENT)
                        .build()));

    // Create a simple patient for the tests
    if (patientId == null) {
      Patient patient = Patient.builder().name("Patient Test").build();
      patient = patientRepository.save(patient);
      patientId = patient.getId();
    }
  }

  private String loginAndGetToken() throws Exception {
    var body =
        """
        {"username":"%s","password":"%s"}
      """.formatted(USERNAME, PASSWORD);

    var mvcResult =
        mockMvc
            .perform(post("/api/auth/login").contentType(APPLICATION_JSON).content(body))
            .andExpect(status().isOk())
            .andReturn();

    return objectMapper
        .readTree(mvcResult.getResponse().getContentAsString())
        .get("accessToken")
        .asText();
  }

  @Test
  @DisplayName(
      "GET /api/patients/{id}/anamnese deve inicializar e retornar condições com enum e descrição")
  void getShouldInitializeAndReturnConditions() throws Exception {
    String token = loginAndGetToken();

    mockMvc
        .perform(
            get("/api/patients/" + patientId + "/anamnese")
                .header("Authorization", "Bearer " + token))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.patientId").value(patientId.intValue()))
        .andExpect(jsonPath("$.conditions").isArray())
        // Verifica que uma condição conhecida existe e possui descrição e categoria
        .andExpect(
            jsonPath("$.conditions[?(@.condition=='BLOOD_PRESSURE')].description")
                .value(org.hamcrest.Matchers.hasItem("Pressão Arterial")))
        .andExpect(
            jsonPath("$.conditions[?(@.condition=='BLOOD_PRESSURE')].category")
                .value(org.hamcrest.Matchers.hasItem("MEDICAL")));
  }

  @Test
  @DisplayName("PATCH /notes deve atualizar notas e criar atividade EDIT_NOTES")
  void patchNotesShouldUpdateNotesAndCreateActivity() throws Exception {
    String token = loginAndGetToken();

    // Garante que a anamnese existe
    mockMvc
        .perform(
            get("/api/patients/" + patientId + "/anamnese")
                .header("Authorization", "Bearer " + token))
        .andExpect(status().isOk());

    String notesBody = """
        {"notes":"Paciente trouxe exames atualizados."}
      """;

    mockMvc
        .perform(
            patch("/api/patients/" + patientId + "/anamnese/notes")
                .contentType(APPLICATION_JSON)
                .content(notesBody)
                .header("Authorization", "Bearer " + token))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.notes").value("Paciente trouxe exames atualizados."))
        .andExpect(jsonPath("$.history").isArray())
        .andExpect(jsonPath("$.history[0].type").value("EDIT_NOTES"))
        .andExpect(
            jsonPath("$.history[0].metadata.data").value("Paciente trouxe exames atualizados."));
  }

  @Test
  @DisplayName(
      "PUT /conditions deve atualizar condições e criar atividade EDIT_CONDITIONS com updatedFields")
  void putConditionsShouldUpdateAndCreateActivity() throws Exception {
    String token = loginAndGetToken();

    // Atualiza duas condições
    String body =
        """
      {
        "conditions": [
          {"condition":"BLOOD_PRESSURE","hasCondition":true,"notes":"Hipertensão controlada."},
          {"condition":"ENDOCRINE","hasCondition":true,"notes":"Diabetes tipo 2."}
        ]
      }
    """;
    mockMvc
        .perform(
            put("/api/patients/" + patientId + "/anamnese/conditions")
                .contentType(APPLICATION_JSON)
                .content(body)
                .header("Authorization", "Bearer " + token))
        .andExpect(status().isOk())
        // Resposta refletindo atualização
        .andExpect(
            jsonPath("$.conditions[?(@.condition=='BLOOD_PRESSURE')].hasCondition")
                .value(org.hamcrest.Matchers.hasItem(true)))
        .andExpect(
            jsonPath("$.conditions[?(@.condition=='BLOOD_PRESSURE')].notes")
                .value(org.hamcrest.Matchers.hasItem("Hipertensão controlada.")))
        // Histórico incluindo atividade EDIT_CONDITIONS com diffs
        .andExpect(jsonPath("$.history").isArray())
        .andExpect(jsonPath("$.history[0].type").value("EDIT_CONDITIONS"))
        .andExpect(jsonPath("$.history[0].metadata.updatedFields").isArray())
        .andExpect(
            jsonPath("$.history[0].metadata.updatedFields[?(@.condition=='BLOOD_PRESSURE')].notes")
                .exists());
  }

  @Test
  @DisplayName("Sem token, endpoints de escrita devem retornar 403 e GET também exige autenticação")
  void authIsRequired() throws Exception {
    // GET exige autenticação
    mockMvc
        .perform(get("/api/patients/" + patientId + "/anamnese"))
        .andExpect(status().isForbidden());

    // PATCH notes sem token
    mockMvc
        .perform(
            patch("/api/patients/" + patientId + "/anamnese/notes")
                .contentType(APPLICATION_JSON)
                .content("{\"notes\":\"abc\"}"))
        .andExpect(status().isForbidden());

    // PUT conditions sem token
    mockMvc
        .perform(
            put("/api/patients/" + patientId + "/anamnese/conditions")
                .contentType(APPLICATION_JSON)
                .content("{\"conditions\":[]}"))
        .andExpect(status().isForbidden());
  }
}

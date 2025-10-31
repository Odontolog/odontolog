package br.ufal.ic.odontolog.permissions;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.ufal.ic.odontolog.enums.Role;
import br.ufal.ic.odontolog.models.Anamnese;
import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.PatientPermission;
import br.ufal.ic.odontolog.models.Student;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.repositories.AnamneseRepository;
import br.ufal.ic.odontolog.repositories.PatientPermissionRepository;
import br.ufal.ic.odontolog.repositories.PatientRepository;
import br.ufal.ic.odontolog.repositories.StudentRepository;
import br.ufal.ic.odontolog.repositories.SupervisorRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.awspring.cloud.s3.S3Template;
import java.time.Instant;
import org.junit.jupiter.api.BeforeEach;
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
class AnamnesePermissionIntegrationTest {

  @Autowired MockMvc mockMvc;
  @Autowired PatientRepository patientRepository;
  @Autowired SupervisorRepository supervisorRepository;
  @Autowired StudentRepository studentRepository;
  @Autowired AnamneseRepository anamneseRepository;
  @MockitoBean S3Template s3Template;

  @Autowired PatientPermissionRepository patientPermissionRepository;
  @Autowired ObjectMapper objectMapper;

  private Patient patient;
  private Student student;

  @BeforeEach
  void setupPatientAndUsers() {
    patient = patientRepository.save(Patient.builder().name("Patient_Anamnese_Test").build());
    anamneseRepository.save(Anamnese.builder().patient(patient).build());

    supervisorRepository
        .findByEmail("supervisor@test.com")
        .orElseGet(
            () ->
                supervisorRepository.save(
                    Supervisor.builder()
                        .name("supervisor 1")
                        .email("supervisor@test.com")
                        .build()));
    student =
        studentRepository
            .findByEmail("student@test.com")
            .orElseGet(
                () ->
                    studentRepository.save(
                        Student.builder()
                            .name("Student 1")
                            .email("student@test.com")
                            .role(Role.STUDENT)
                            .build()));
  }

  private void grantPermissionToStudent() {
    patientPermissionRepository
        .findTopByStudentIdAndPatientIdAndActiveTrueOrderByGrantedAtDesc(
            student.getId(), patient.getId())
        .orElseGet(
            () -> {
              PatientPermission p = new PatientPermission();
              p.setGrantedAt(Instant.now());
              p.setPatient(patient);
              p.setStudent(student);
              return patientPermissionRepository.save(p);
            });
  }

  // -------------------------
  // GET /api/patients/{patientId}/anamnese
  // -------------------------
  @Test
  @WithMockUser(
      username = "supervisor@test.com",
      roles = {"SUPERVISOR"})
  void getAnamnese_asSupervisor_allowed() throws Exception {
    mockMvc
        .perform(get("/api/patients/{id}/anamnese", patient.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(
      username = "student@test.com",
      roles = {"STUDENT"})
  void getAnamnese_studentWithoutPermission_forbidden() throws Exception {
    mockMvc
        .perform(get("/api/patients/{id}/anamnese", patient.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(
      username = "student@test.com",
      roles = {"STUDENT"})
  void getAnamnese_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    mockMvc
        .perform(get("/api/patients/{id}/anamnese", patient.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  // -------------------------
  // PATCH /api/patients/{patientId}/anamnese/notes
  // -------------------------
  @Test
  @WithMockUser(
      username = "supervisor@test.com",
      roles = {"SUPERVISOR"})
  void patchNotes_asSupervisor_allowed() throws Exception {
    String body = objectMapper.writeValueAsString(java.util.Map.of("notes", "Teste notas"));
    mockMvc
        .perform(
            patch("/api/patients/{id}/anamnese/notes", patient.getId())
                .contentType(APPLICATION_JSON)
                .content(body))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(
      username = "student@test.com",
      roles = {"STUDENT"})
  void patchNotes_studentWithoutPermission_forbidden() throws Exception {
    String body = objectMapper.writeValueAsString(java.util.Map.of("notes", "Teste notas"));
    mockMvc
        .perform(
            patch("/api/patients/{id}/anamnese/notes", patient.getId())
                .contentType(APPLICATION_JSON)
                .content(body))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(
      username = "student@test.com",
      roles = {"STUDENT"})
  void patchNotes_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    String body = objectMapper.writeValueAsString(java.util.Map.of("notes", "Teste notas"));
    mockMvc
        .perform(
            patch("/api/patients/{id}/anamnese/notes", patient.getId())
                .contentType(APPLICATION_JSON)
                .content(body))
        .andExpect(status().isOk());
  }

  // -------------------------
  // PUT /api/patients/{patientId}/anamnese/conditions
  // -------------------------
  @Test
  @WithMockUser(
      username = "supervisor@test.com",
      roles = {"SUPERVISOR"})
  void putConditions_asSupervisor_allowed() throws Exception {
    String body =
        objectMapper.writeValueAsString(
            java.util.Map.of(
                "conditions",
                java.util.List.of(
                    java.util.Map.of(
                        "condition", "INTESTINAL",
                        "hasCondition", true,
                        "notes", "teste"))));
    mockMvc
        .perform(
            put("/api/patients/{id}/anamnese/conditions", patient.getId())
                .contentType(APPLICATION_JSON)
                .content(body))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(
      username = "student@test.com",
      roles = {"STUDENT"})
  void putConditions_studentWithoutPermission_forbidden() throws Exception {
    String body =
        objectMapper.writeValueAsString(
            java.util.Map.of(
                "conditions",
                java.util.List.of(
                    java.util.Map.of(
                        "condition", "INTESTINAL",
                        "hasCondition", true,
                        "notes", "teste"))));
    mockMvc
        .perform(
            put("/api/patients/{id}/anamnese/conditions", patient.getId())
                .contentType(APPLICATION_JSON)
                .content(body))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(
      username = "student@test.com",
      roles = {"STUDENT"})
  void putConditions_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    String body =
        objectMapper.writeValueAsString(
            java.util.Map.of(
                "conditions",
                java.util.List.of(
                    java.util.Map.of(
                        "condition", "INTESTINAL",
                        "hasCondition", true,
                        "notes", "teste"))));
    mockMvc
        .perform(
            put("/api/patients/{id}/anamnese/conditions", patient.getId())
                .contentType(APPLICATION_JSON)
                .content(body))
        .andExpect(status().isOk());
  }
}

package br.ufal.ic.odontolog.permissions;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.ufal.ic.odontolog.enums.Role;
import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.PatientPermission;
import br.ufal.ic.odontolog.models.Student;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.repositories.PatientPermissionRepository;
import br.ufal.ic.odontolog.repositories.PatientRepository;
import br.ufal.ic.odontolog.repositories.StudentRepository;
import br.ufal.ic.odontolog.repositories.SupervisorRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.awspring.cloud.s3.S3Template;

import java.time.Instant;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

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
class PatientPermissionIntegrationTest {

  @Autowired MockMvc mockMvc;
  @MockitoBean S3Template s3Template;
  @Autowired PatientRepository patientRepository;
  @Autowired SupervisorRepository supervisorRepository;
  @Autowired StudentRepository studentRepository;
  @Autowired PatientPermissionRepository patientPermissionRepository;
  @Autowired ObjectMapper objectMapper;

  private Patient patient;
  private Student student;

  @BeforeEach
  void setupPatientAndUsers() {
    patient = patientRepository.save(Patient.builder().name("Patient_Permission_Test").build());

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
    // Não conceder permissão aqui; testes individuais chamam grantPermissionToStudent() quando necessário
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

  // -------------------------------------------------
  // GET /api/patients/{id}
  // -------------------------------------------------
  @Test
  @WithMockUser(username = "supervisor@test.com", roles = {"SUPERVISOR"})
  void getPatientById_asSupervisor_allowed() throws Exception {
    mockMvc.perform(get("/api/patients/{id}", patient.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void getPatientById_studentWithoutPermission_forbidden() throws Exception {
    mockMvc.perform(get("/api/patients/{id}", patient.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void getPatientById_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    mockMvc.perform(get("/api/patients/{id}", patient.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  // -------------------------------------------------
  // GET /api/patients/{id}/next-appointment
  // -------------------------------------------------
  @Test
  @WithMockUser(username = "supervisor@test.com", roles = {"SUPERVISOR"})
  void getNextAppointment_asSupervisor_allowed() throws Exception {
    mockMvc
        .perform(get("/api/patients/{id}/next-appointment", patient.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void getNextAppointment_studentWithoutPermission_forbidden() throws Exception {
    mockMvc
        .perform(get("/api/patients/{id}/next-appointment", patient.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void getNextAppointment_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    mockMvc
        .perform(get("/api/patients/{id}/next-appointment", patient.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  // -------------------------------------------------
  // PUT /api/patients/{id}/next-appointment
  // -------------------------------------------------
  @Test
  @WithMockUser(username = "supervisor@test.com", roles = {"SUPERVISOR"})
  void putNextAppointment_asSupervisor_allowed() throws Exception {
    String body = objectMapper.writeValueAsString(java.util.Map.of("appointmentDate", LocalDate.now().plusYears(1).toString()));
    mockMvc
        .perform(
            put("/api/patients/{id}/next-appointment", patient.getId())
                .contentType(APPLICATION_JSON)
                .content(body))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void putNextAppointment_studentWithoutPermission_forbidden() throws Exception {
    String body = objectMapper.writeValueAsString(java.util.Map.of("appointmentDate", LocalDate.now().plusYears(1).toString()));
    mockMvc
        .perform(
            put("/api/patients/{id}/next-appointment", patient.getId())
                .contentType(APPLICATION_JSON)
                .content(body))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void putNextAppointment_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    String body = objectMapper.writeValueAsString(java.util.Map.of("appointmentDate", LocalDate.now().plusYears(1).toString()));
    mockMvc
        .perform(
            put("/api/patients/{id}/next-appointment", patient.getId())
                .contentType(APPLICATION_JSON)
                .content(body))
        .andExpect(status().isOk());
  }

  // -------------------------------------------------
  // PUT /api/patients/{id}
  // -------------------------------------------------
  private String getMockPatientUpsertBody() throws Exception {
    Map<String, Object> data = new HashMap<>();
        data.put("name", "João da Silva");
        data.put("address", "Rua das Flores, 123");
        data.put("avatarUrl", "https://example.com/avatars/joao.jpg");
        data.put("cpf", "123.456.789-00");
        data.put("phoneNumber", "(11) 98765-4321");
        data.put("rg", "12.345.678-9");
        data.put("city", "São Paulo");
        data.put("state", "SP");
        data.put("ethnicity", "WHITE");
        data.put("sex", "MALE");
        data.put("birthDate", LocalDate.of(1990, 5, 20).toString());
        data.put("maritalStatus", "SINGLE");
        data.put("occupation", "Engenheiro de Software");
    return objectMapper.writeValueAsString(data);
  }


  @Test
  @WithMockUser(username = "supervisor@test.com", roles = {"SUPERVISOR"})
  void putPatient_asSupervisor_allowed() throws Exception {
    String body = getMockPatientUpsertBody();
    mockMvc
        .perform(put("/api/patients/{id}", patient.getId()).contentType(APPLICATION_JSON).content(body))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void putPatient_studentWithoutPermission_forbidden() throws Exception {
    String body = getMockPatientUpsertBody();
    mockMvc
        .perform(put("/api/patients/{id}", patient.getId()).contentType(APPLICATION_JSON).content(body))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void putPatient_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    String body = getMockPatientUpsertBody();
    mockMvc
        .perform(put("/api/patients/{id}", patient.getId()).contentType(APPLICATION_JSON).content(body))
        .andExpect(status().isOk());
  }

  // -------------------------
  // POST /api/patients  (createPatient) - only ADMIN/SUPERVISOR allowed
  // -------------------------
  @Test
  @WithMockUser(username = "supervisor@test.com", roles = {"SUPERVISOR"})
  void createPatient_asSupervisor_allowed() throws Exception {
    String body = getMockPatientUpsertBody();
    mockMvc
        .perform(post("/api/patients").contentType(APPLICATION_JSON).content(body))
        .andExpect(status().isCreated());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void createPatient_studentForbbiden() throws Exception {
    String body = getMockPatientUpsertBody();
    mockMvc
        .perform(post("/api/patients").contentType(APPLICATION_JSON).content(body))
        .andExpect(status().isForbidden());
  }

  // -------------------------
  // PUT /api/patients/{id}/restore  - only ADMIN/SUPERVISOR allowed
  // -------------------------
  @Test
  @WithMockUser(username = "supervisor@test.com", roles = {"SUPERVISOR"})
  void restorePatient_asSupervisor_allowed() throws Exception {
    mockMvc
        .perform(put("/api/patients/{id}/restore", patient.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isNoContent());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void restorePatient_studentForbidden() throws Exception {
    mockMvc
        .perform(put("/api/patients/{id}/restore", patient.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  // -------------------------
  // DELETE /api/patients/{id}  - only ADMIN/SUPERVISOR allowed
  // -------------------------
  @Test
  @WithMockUser(username = "supervisor@test.com", roles = {"SUPERVISOR"})
  void deletePatient_asSupervisor_allowed() throws Exception {
    mockMvc
        .perform(delete("/api/patients/{id}", patient.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isNoContent());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void deletePatient_studentForbidden() throws Exception {
    mockMvc
        .perform(delete("/api/patients/{id}", patient.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }
}


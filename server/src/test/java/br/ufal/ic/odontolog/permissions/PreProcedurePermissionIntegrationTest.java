package br.ufal.ic.odontolog.permissions;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
public class PreProcedurePermissionIntegrationTest {

  @Autowired MockMvc mockMvc;
  @Autowired PatientRepository patientRepository;
  @Autowired SupervisorRepository supervisorRepository;
  @Autowired StudentRepository studentRepository;
  @Autowired PatientPermissionRepository patientPermissionRepository;
  @Autowired ObjectMapper objectMapper;
  @MockitoBean S3Template s3Template;

  private Patient patient;
  private Student student;

  @BeforeEach
  void setup() {
    patient = patientRepository.save(Patient.builder().name("Patient_PreProcedure_Test").build());

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

  private Long createPreProcedureAsSupervisor() throws Exception {
    String body = objectMapper.writeValueAsString(Map.of("name", "Teste pré-procedimento"));

    String response =
        mockMvc
            .perform(
                post("/api/patients/{patientId}/pre-procedures", patient.getId())
                    .contentType(APPLICATION_JSON)
                    .content(body)
                    .with(
                        org.springframework.security.test.web.servlet.request
                            .SecurityMockMvcRequestPostProcessors.user("supervisor@test.com")
                            .roles("SUPERVISOR")))
            .andExpect(status().isCreated())
            .andReturn()
            .getResponse()
            .getContentAsString();

    Map<?, ?> map = objectMapper.readValue(response, Map.class);
    Number idNum = (Number) map.get("id");
    return idNum != null ? idNum.longValue() : null;
  }

  // -------------------------
  // POST /patients/{patientId}/pre-procedures
  // -------------------------
  @Test
  @WithMockUser(
      username = "supervisor@test.com",
      roles = {"SUPERVISOR"})
  void createPreProcedure_asSupervisor_allowed() throws Exception {
    String body = objectMapper.writeValueAsString(Map.of("name", "Teste pré-procedimento"));
    mockMvc
        .perform(
            post("/api/patients/{patientId}/pre-procedures", patient.getId())
                .contentType(APPLICATION_JSON)
                .content(body))
        .andExpect(status().isCreated());
  }

  @Test
  @WithMockUser(
      username = "student@test.com",
      roles = {"STUDENT"})
  void createPreProcedure_studentWithoutPermission_forbidden() throws Exception {
    String body = objectMapper.writeValueAsString(Map.of("name", "Teste pré-procedimento"));
    mockMvc
        .perform(
            post("/api/patients/{patientId}/pre-procedures", patient.getId())
                .contentType(APPLICATION_JSON)
                .content(body))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(
      username = "student@test.com",
      roles = {"STUDENT"})
  void createPreProcedure_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    String body = objectMapper.writeValueAsString(Map.of("name", "Teste pré-procedimento"));
    mockMvc
        .perform(
            post("/api/patients/{patientId}/pre-procedures", patient.getId())
                .contentType(APPLICATION_JSON)
                .content(body))
        .andExpect(status().isCreated());
  }

  // -------------------------
  // GET /patients/{patientId}/pre-procedures/{preProcedureId}
  // -------------------------
  @Test
  @WithMockUser(
      username = "supervisor@test.com",
      roles = {"SUPERVISOR"})
  void getPreProcedureById_asSupervisor_allowed() throws Exception {
    Long id = createPreProcedureAsSupervisor();
    mockMvc
        .perform(
            get("/api/patients/{patientId}/pre-procedures/{preProcedureId}", patient.getId(), id)
                .contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(
      username = "student@test.com",
      roles = {"STUDENT"})
  void getPreProcedureById_studentWithoutPermission_forbidden() throws Exception {
    Long id = createPreProcedureAsSupervisor();
    mockMvc
        .perform(
            get("/api/patients/{patientId}/pre-procedures/{preProcedureId}", patient.getId(), id)
                .contentType(APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(
      username = "student@test.com",
      roles = {"STUDENT"})
  void getPreProcedureById_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    Long id = createPreProcedureAsSupervisor();
    mockMvc
        .perform(
            get("/api/patients/{patientId}/pre-procedures/{preProcedureId}", patient.getId(), id)
                .contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  // -------------------------
  // GET /patients/{patientId}/pre-procedures
  // -------------------------
  @Test
  @WithMockUser(
      username = "supervisor@test.com",
      roles = {"SUPERVISOR"})
  void getPreProceduresForPatient_asSupervisor_allowed() throws Exception {
    createPreProcedureAsSupervisor();
    mockMvc
        .perform(
            get("/api/patients/{patientId}/pre-procedures", patient.getId())
                .contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(
      username = "student@test.com",
      roles = {"STUDENT"})
  void getPreProceduresForPatient_studentWithoutPermission_forbidden() throws Exception {
    createPreProcedureAsSupervisor();
    mockMvc
        .perform(
            get("/api/patients/{patientId}/pre-procedures", patient.getId())
                .contentType(APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(
      username = "student@test.com",
      roles = {"STUDENT"})
  void getPreProceduresForPatient_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    createPreProcedureAsSupervisor();
    mockMvc
        .perform(
            get("/api/patients/{patientId}/pre-procedures", patient.getId())
                .contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }
}

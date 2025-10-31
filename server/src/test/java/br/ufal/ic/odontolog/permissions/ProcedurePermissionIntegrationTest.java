package br.ufal.ic.odontolog.permissions;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.ufal.ic.odontolog.enums.ProcedureStatus;
import br.ufal.ic.odontolog.enums.Role;
import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.PatientPermission;
import br.ufal.ic.odontolog.models.PreProcedure;
import br.ufal.ic.odontolog.models.Procedure;
import br.ufal.ic.odontolog.models.ProcedureDetail;
import br.ufal.ic.odontolog.models.Student;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.repositories.PatientPermissionRepository;
import br.ufal.ic.odontolog.repositories.PatientRepository;
import br.ufal.ic.odontolog.repositories.ProcedureRepository;
import br.ufal.ic.odontolog.repositories.StudentRepository;
import br.ufal.ic.odontolog.repositories.SupervisorRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.awspring.cloud.s3.S3Template;
import java.time.Instant;
import java.util.List;
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
public class ProcedurePermissionIntegrationTest {

  @Autowired MockMvc mockMvc;
  @Autowired PatientRepository patientRepository;
  @Autowired SupervisorRepository supervisorRepository;
  @Autowired StudentRepository studentRepository;
  @Autowired PatientPermissionRepository patientPermissionRepository;
  @Autowired ProcedureRepository procedureRepository;
  @Autowired ObjectMapper objectMapper;
  @MockitoBean S3Template s3Template;

  private Patient patient;
  private Student student;
  private Supervisor supervisor;
  private Procedure procedure;

  @BeforeEach
  void setup() {
    patient = patientRepository.save(Patient.builder().name("Patient_Procedure_Test").build());

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
    
    Procedure proc = new PreProcedure();
    proc.setPatient(patient);
    proc.setAuthor(student);
    proc.setProcedureDetail(new ProcedureDetail(""));
    proc.setStatus(ProcedureStatus.NOT_STARTED);
    procedure = procedureRepository.save(proc);
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
  // GET /api/patients/{patientId}/procedures
  // -------------------------
  @Test
  @WithMockUser(username = "supervisor@test.com", roles = {"SUPERVISOR"})
  void listPatientProcedures_asSupervisor_allowed() throws Exception {
    mockMvc
        .perform(get("/api/patients/{patientId}/procedures", patient.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void listPatientProcedures_studentWithoutPermission_forbidden() throws Exception {
    mockMvc
        .perform(get("/api/patients/{patientId}/procedures", patient.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void listPatientProcedures_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    mockMvc
        .perform(get("/api/patients/{patientId}/procedures", patient.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  // -------------------------
  // GET /api/procedures/{procedureId}
  // -------------------------
  @Test
  @WithMockUser(username = "supervisor@test.com", roles = {"SUPERVISOR"})
  void getProcedureById_asSupervisor_allowed() throws Exception {
    mockMvc
        .perform(get("/api/procedures/{procedureId}", procedure.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void getProcedureById_studentWithoutPermission_forbidden() throws Exception {
    mockMvc
        .perform(get("/api/procedures/{procedureId}", procedure.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void getProcedureById_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    mockMvc
        .perform(get("/api/procedures/{procedureId}", procedure.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  // -------------------------
  // POST /api/procedures/{procedureId}/start
  // -------------------------
  @Test
  @WithMockUser(username = "supervisor@test.com", roles = {"SUPERVISOR"})
  void startProcedure_asSupervisor_allowed() throws Exception {
    mockMvc
        .perform(post("/api/procedures/{procedureId}/start", procedure.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void startProcedure_studentWithoutPermission_forbidden() throws Exception {
    mockMvc
        .perform(post("/api/procedures/{procedureId}/start", procedure.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void startProcedure_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    mockMvc
        .perform(post("/api/procedures/{procedureId}/start", procedure.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  // -------------------------
  // PATCH /api/procedures/{procedureId}/teeth
  // -------------------------
  @Test
  @WithMockUser(username = "supervisor@test.com", roles = {"SUPERVISOR"})
  void updateProcedureTeeth_asSupervisor_allowed() throws Exception {
    String body = objectMapper.writeValueAsString(Map.of("teeth", List.of(11, 12)));
    mockMvc
        .perform(patch("/api/procedures/{procedureId}/teeth", procedure.getId())
            .contentType(APPLICATION_JSON)
            .content(body))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void updateProcedureTeeth_studentWithoutPermission_forbidden() throws Exception {
    String body = objectMapper.writeValueAsString(Map.of("teeth", List.of(11, 12)));
    mockMvc
        .perform(patch("/api/procedures/{procedureId}/teeth", procedure.getId())
            .contentType(APPLICATION_JSON)
            .content(body))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void updateProcedureTeeth_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    String body = objectMapper.writeValueAsString(Map.of("teeth", List.of(11, 12)));
    mockMvc
        .perform(patch("/api/procedures/{procedureId}/teeth", procedure.getId())
            .contentType(APPLICATION_JSON)
            .content(body))
        .andExpect(status().isOk());
  }

  // -------------------------
  // PATCH /api/procedures/{procedureId}/study-sector
  // -------------------------
  @Test
  @WithMockUser(username = "supervisor@test.com", roles = {"SUPERVISOR"})
  void updateProcedureStudySector_asSupervisor_allowed() throws Exception {
    String body = objectMapper.writeValueAsString(Map.of("studySector", "A1"));
    mockMvc
        .perform(patch("/api/procedures/{procedureId}/study-sector", procedure.getId())
            .contentType(APPLICATION_JSON)
            .content(body))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void updateProcedureStudySector_studentWithoutPermission_forbidden() throws Exception {
    String body = objectMapper.writeValueAsString(Map.of("studySector", "A1"));
    mockMvc
        .perform(patch("/api/procedures/{procedureId}/study-sector", procedure.getId())
            .contentType(APPLICATION_JSON)
            .content(body))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void updateProcedureStudySector_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    String body = objectMapper.writeValueAsString(Map.of("studySector", "A1"));
    mockMvc
        .perform(patch("/api/procedures/{procedureId}/study-sector", procedure.getId())
            .contentType(APPLICATION_JSON)
            .content(body))
        .andExpect(status().isOk());
  }

  // -------------------------
  // PATCH /api/procedures/{procedureId}/diagnostic
  // -------------------------
  @Test
  @WithMockUser(username = "supervisor@test.com", roles = {"SUPERVISOR"})
  void updateProcedureDiagnostic_asSupervisor_allowed() throws Exception {
    String body = objectMapper.writeValueAsString(Map.of("diagnostic", "Diagnóstico teste"));
    mockMvc
        .perform(patch("/api/procedures/{procedureId}/diagnostic", procedure.getId())
            .contentType(APPLICATION_JSON)
            .content(body))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void updateProcedureDiagnostic_studentWithoutPermission_forbidden() throws Exception {
    String body = objectMapper.writeValueAsString(Map.of("diagnostic", "Diagnóstico teste"));
    mockMvc
        .perform(patch("/api/procedures/{procedureId}/diagnostic", procedure.getId())
            .contentType(APPLICATION_JSON)
            .content(body))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void updateProcedureDiagnostic_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    String body = objectMapper.writeValueAsString(Map.of("diagnostic", "Diagnóstico teste"));
    mockMvc
        .perform(patch("/api/procedures/{procedureId}/diagnostic", procedure.getId())
            .contentType(APPLICATION_JSON)
            .content(body))
        .andExpect(status().isOk());
  }
}

package br.ufal.ic.odontolog.permissions;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.ufal.ic.odontolog.enums.ProcedureStatus;
import br.ufal.ic.odontolog.enums.Role;
import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.PatientPermission;
import br.ufal.ic.odontolog.models.Student;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import br.ufal.ic.odontolog.models.TreatmentPlanProcedure;
import br.ufal.ic.odontolog.repositories.PatientPermissionRepository;
import br.ufal.ic.odontolog.repositories.PatientRepository;
import br.ufal.ic.odontolog.repositories.StudentRepository;
import br.ufal.ic.odontolog.repositories.SupervisorRepository;
import br.ufal.ic.odontolog.repositories.TreatmentPlanRepository;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.awspring.cloud.s3.S3Template;
import java.time.Instant;
import java.util.HashMap;
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
public class TreatmentPlanPermissionIntegrationTest {

  @Autowired MockMvc mockMvc;
  @Autowired PatientRepository patientRepository;
  @Autowired SupervisorRepository supervisorRepository;
  @Autowired TreatmentPlanRepository treatmentPlanRepository;
  @Autowired StudentRepository studentRepository;
  @Autowired PatientPermissionRepository patientPermissionRepository;
  @Autowired ObjectMapper objectMapper;
  @MockitoBean S3Template s3Template;

  private Patient patient;
  private Student student;
  private TreatmentPlan treatmentPlan;
  private TreatmentPlanProcedure tpProcedure;

  @BeforeEach
  void setup() {
    patient = patientRepository.save(Patient.builder().name("Patient_TP_Permission_Test").build());

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
    
    TreatmentPlan plan = new TreatmentPlan();
    plan.setPatient(patient);
    plan.setAuthor(student);
    plan.setStatus(TreatmentPlanStatus.DRAFT);

    TreatmentPlanProcedure tpproc = new TreatmentPlanProcedure();
    tpproc.setPatient(patient);
    tpproc.setTreatmentPlan(plan);
    tpproc.setStatus(ProcedureStatus.DRAFT);
    tpproc.setName("Procedure 2");
    plan.addProcedure(tpproc);
    treatmentPlan  = treatmentPlanRepository.save(plan);
    tpProcedure = treatmentPlan.getProcedures().iterator().next();
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
  // POST /api/patients/{patientId}/treatment-plan
  // -------------------------
  @Test
  @WithMockUser(username = "supervisor@test.com", roles = {"SUPERVISOR"})
  void createTreatmentPlan_asSupervisor_allowed() throws Exception {
    mockMvc
        .perform(post("/api/patients/{patientId}/treatment-plan", patient.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void createTreatmentPlan_studentWithoutPermission_forbidden() throws Exception {
    mockMvc
        .perform(post("/api/patients/{patientId}/treatment-plan", patient.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void createTreatmentPlan_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    mockMvc
        .perform(post("/api/patients/{patientId}/treatment-plan", patient.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  // -------------------------
  // GET /api/patients/{patientId}/treatment-plan
  // -------------------------
  @Test
  @WithMockUser(username = "supervisor@test.com", roles = {"SUPERVISOR"})
  void listTreatmentPlans_asSupervisor_allowed() throws Exception {
    mockMvc
        .perform(get("/api/patients/{patientId}/treatment-plan", patient.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void listTreatmentPlans_studentWithoutPermission_forbidden() throws Exception {
    mockMvc
        .perform(get("/api/patients/{patientId}/treatment-plan", patient.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void listTreatmentPlans_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    mockMvc
        .perform(get("/api/patients/{patientId}/treatment-plan", patient.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  // -------------------------
  // GET /api/treatment-plan/{treatmentId}
  // -------------------------
  @Test
  @WithMockUser(username = "supervisor@test.com", roles = {"SUPERVISOR"})
  void getTreatmentPlanById_asSupervisor_allowed() throws Exception {
    mockMvc
        .perform(get("/api/treatment-plan/{treatmentId}", treatmentPlan.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void getTreatmentPlanById_studentWithoutPermission_forbidden() throws Exception {
    mockMvc
        .perform(get("/api/treatment-plan/{treatmentId}", treatmentPlan.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void getTreatmentPlanById_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    mockMvc
        .perform(get("/api/treatment-plan/{treatmentId}", treatmentPlan.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  private String getMockTPProcedureUpsertBody() throws Exception {
    Map<String, Object> data = new HashMap<>();
    data.put("name", "Procedimento 1");
    data.put("teeth", List.of(11, 12));
    data.put("studySector", "Endo");
    data.put("plannedSession", "2");
    return objectMapper.writeValueAsString(data);
  }

  // -------------------------
  // POST /treatment-plan/{treatmentId}/procedures
  // -------------------------
  @Test
  @WithMockUser(username = "supervisor@test.com", roles = {"SUPERVISOR"})
  void addProcedure_asSupervisor_allowed() throws Exception {
    String body = getMockTPProcedureUpsertBody();
    mockMvc
        .perform(post("/api/treatment-plan/{treatmentId}/procedures", treatmentPlan.getId())
            .contentType(APPLICATION_JSON)
            .content(body))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void addProcedure_studentWithoutPermission_forbidden() throws Exception {
    String body = getMockTPProcedureUpsertBody();
    mockMvc
        .perform(post("/api/treatment-plan/{treatmentId}/procedures", treatmentPlan.getId())
            .contentType(APPLICATION_JSON)
            .content(body))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void addProcedure_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    String body = getMockTPProcedureUpsertBody();
    mockMvc
        .perform(post("/api/treatment-plan/{treatmentId}/procedures", treatmentPlan.getId())
            .contentType(APPLICATION_JSON)
            .content(body))
        .andExpect(status().isOk());
  }

  // -------------------------
  // PUT /treatment-plan/{treatmentId}/procedures/{procedureId}
  // -------------------------
  @Test
  @WithMockUser(username = "supervisor@test.com", roles = {"SUPERVISOR"})
  void updateProcedure_asSupervisor_allowed() throws Exception {
    String body = getMockTPProcedureUpsertBody();
    mockMvc
        .perform(put("/api/treatment-plan/{treatmentId}/procedures/{procedureId}", treatmentPlan.getId(), tpProcedure.getId())
            .contentType(APPLICATION_JSON)
            .content(body))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void updateProcedure_studentWithoutPermission_forbidden() throws Exception {
    String body = getMockTPProcedureUpsertBody();
    mockMvc
        .perform(put("/api/treatment-plan/{treatmentId}/procedures/{procedureId}", treatmentPlan.getId(), tpProcedure.getId())
            .contentType(APPLICATION_JSON)
            .content(body))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void updateProcedure_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    String body = getMockTPProcedureUpsertBody();
    mockMvc
        .perform(put("/api/treatment-plan/{treatmentId}/procedures/{procedureId}", treatmentPlan.getId(), tpProcedure.getId())
            .contentType(APPLICATION_JSON)
            .content(body))
        .andExpect(status().isOk());
  }

  // -------------------------
  // DELETE /treatment-plan/{treatmentId}/procedures/{procedureId}
  // -------------------------
  @Test
  @WithMockUser(username = "supervisor@test.com", roles = {"SUPERVISOR"})
  void removeProcedure_asSupervisor_allowed() throws Exception {
    mockMvc
        .perform(delete("/api/treatment-plan/{treatmentId}/procedures/{procedureId}", treatmentPlan.getId(), tpProcedure.getId())
            .contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void removeProcedure_studentWithoutPermission_forbidden() throws Exception {
    mockMvc
        .perform(delete("/api/treatment-plan/{treatmentId}/procedures/{procedureId}", treatmentPlan.getId(), tpProcedure.getId())
            .contentType(APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void removeProcedure_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    mockMvc
        .perform(delete("/api/treatment-plan/{treatmentId}/procedures/{procedureId}", treatmentPlan.getId(), tpProcedure.getId())
            .contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }
}

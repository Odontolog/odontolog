package br.ufal.ic.odontolog.permissions;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.ufal.ic.odontolog.enums.Role;
import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.PatientPermission;
import br.ufal.ic.odontolog.models.Student;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import br.ufal.ic.odontolog.repositories.PatientPermissionRepository;
import br.ufal.ic.odontolog.repositories.PatientRepository;
import br.ufal.ic.odontolog.repositories.StudentRepository;
import br.ufal.ic.odontolog.repositories.SupervisorRepository;
import br.ufal.ic.odontolog.repositories.TreatmentPlanRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.awspring.cloud.s3.S3Template;
import java.time.Instant;
import java.util.Map;
import java.util.Set;

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
public class ReviewablePermissionIntegrationTest {

  @Autowired MockMvc mockMvc;
  @Autowired PatientRepository patientRepository;
  @Autowired SupervisorRepository supervisorRepository;
  @Autowired StudentRepository studentRepository;
  @Autowired PatientPermissionRepository patientPermissionRepository;
  @Autowired TreatmentPlanRepository treatmentPlanRepository;
  @Autowired ObjectMapper objectMapper;
  @MockitoBean S3Template s3Template;

  private Patient patient;
  private Supervisor supervisor;
  private Student student;
  private TreatmentPlan treatmentPlan;

  @BeforeEach
  void setup() {
    patient = patientRepository.save(Patient.builder().name("Patient_Reviewable_Test").build());

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

    TreatmentPlan plan = new TreatmentPlan();
    plan.setPatient(patient);
    plan.setAuthor(student);
    plan.setAssignee(student);
    plan.setStatus(TreatmentPlanStatus.DRAFT);
    treatmentPlan = treatmentPlanRepository.save(plan);
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

  private void addReviewer() {
    treatmentPlan.setReviewers(Set.of(supervisor));
  }

  // PUT /api/reviewables/{reviewableId}/reviewers
  @Test
  @WithMockUser(username = "supervisor@test.com", roles = {"SUPERVISOR"})
  void updateReviewers_asSupervisor_allowed() throws Exception {
    String body = objectMapper.writeValueAsString(Map.of("supervisorIds", new String[] {supervisor.getId().toString()}));
    mockMvc
        .perform(put("/api/reviewables/{reviewableId}/reviewers", treatmentPlan.getId())
            .contentType(APPLICATION_JSON)
            .content(body))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void updateReviewers_studentWithoutPermission_forbidden() throws Exception {
    String body = objectMapper.writeValueAsString(Map.of("supervisorIds", new String[] {supervisor.getId().toString()}));
    mockMvc
        .perform(put("/api/reviewables/{reviewableId}/reviewers", treatmentPlan.getId())
            .contentType(APPLICATION_JSON)
            .content(body))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void updateReviewers_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    String body = objectMapper.writeValueAsString(Map.of("supervisorIds", new String[] {supervisor.getId().toString()}));
    mockMvc
        .perform(put("/api/reviewables/{reviewableId}/reviewers", treatmentPlan.getId())
            .contentType(APPLICATION_JSON)
            .content(body))
        .andExpect(status().isOk());
  }

  // PATCH /api/reviewables/{reviewableId}/notes
  @Test
  @WithMockUser(username = "supervisor@test.com", roles = {"SUPERVISOR"})
  void patchNotes_asSupervisor_allowed() throws Exception {
    String body = objectMapper.writeValueAsString(Map.of("notes", "Notas de teste"));
    mockMvc
        .perform(patch("/api/reviewables/{reviewableId}/notes", treatmentPlan.getId())
            .contentType(APPLICATION_JSON)
            .content(body))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void patchNotes_studentWithoutPermission_forbidden() throws Exception {
    String body = objectMapper.writeValueAsString(Map.of("notes", "Notas de teste"));
    mockMvc
        .perform(patch("/api/reviewables/{reviewableId}/notes", treatmentPlan.getId())
            .contentType(APPLICATION_JSON)
            .content(body))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void patchNotes_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    String body = objectMapper.writeValueAsString(Map.of("notes", "Notas de teste"));
    mockMvc
        .perform(patch("/api/reviewables/{reviewableId}/notes", treatmentPlan.getId())
            .contentType(APPLICATION_JSON)
            .content(body))
        .andExpect(status().isOk());
  }

  // GET /api/reviewables/{reviewableId}/history
  @Test
  @WithMockUser(username = "supervisor@test.com", roles = {"SUPERVISOR"})
  void getHistory_asSupervisor_allowed() throws Exception {
    mockMvc
        .perform(get("/api/reviewables/{reviewableId}/history", treatmentPlan.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void getHistory_studentWithoutPermission_forbidden() throws Exception {
    mockMvc
        .perform(get("/api/reviewables/{reviewableId}/history", treatmentPlan.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void getHistory_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    mockMvc
        .perform(get("/api/reviewables/{reviewableId}/history", treatmentPlan.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  // POST /api/reviewables/{reviewableId}/assignee
  @Test
  @WithMockUser(username = "supervisor@test.com", roles = {"SUPERVISOR"})
  void assignUser_asSupervisor_allowed() throws Exception {
    String body = objectMapper.writeValueAsString(Map.of("userId", supervisor.getId().toString()));
    mockMvc
        .perform(post("/api/reviewables/{reviewableId}/assignee", treatmentPlan.getId())
            .contentType(APPLICATION_JSON)
            .content(body))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void assignUser_studentWithoutPermission_forbidden() throws Exception {
    String body = objectMapper.writeValueAsString(Map.of("userId", supervisor.getId().toString()));
    mockMvc
        .perform(post("/api/reviewables/{reviewableId}/assignee", treatmentPlan.getId())
            .contentType(APPLICATION_JSON)
            .content(body))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void assignUser_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    String body = objectMapper.writeValueAsString(Map.of("userId", supervisor.getId().toString()));
    mockMvc
        .perform(post("/api/reviewables/{reviewableId}/assignee", treatmentPlan.getId())
            .contentType(APPLICATION_JSON)
            .content(body))
        .andExpect(status().isOk());
  }

  // POST /api/reviewables/{reviewableId}/submit-for-review
  @Test
  @WithMockUser(username = "supervisor@test.com", roles = {"SUPERVISOR"})
  void submitForReview_asSupervisor_allowed() throws Exception {
    addReviewer();
    String body = objectMapper.writeValueAsString(Map.of("comments", "Por favor revisar"));
    mockMvc
        .perform(post("/api/reviewables/{reviewableId}/submit-for-review", treatmentPlan.getId())
            .contentType(APPLICATION_JSON)
            .content(body))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void submitForReview_studentWithoutPermission_forbidden() throws Exception {
    addReviewer();
    String body = objectMapper.writeValueAsString(Map.of("comments", "Por favor revisar"));
    mockMvc
        .perform(post("/api/reviewables/{reviewableId}/submit-for-review", treatmentPlan.getId())
            .contentType(APPLICATION_JSON)
            .content(body))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void submitForReview_studentWithPermission_allowed() throws Exception {
    addReviewer();
    grantPermissionToStudent();
    String body = objectMapper.writeValueAsString(Map.of("comments", "Por favor revisar"));
    mockMvc
        .perform(post("/api/reviewables/{reviewableId}/submit-for-review", treatmentPlan.getId())
            .contentType(APPLICATION_JSON)
            .content(body))
        .andExpect(status().isOk());
  }
}

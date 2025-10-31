package br.ufal.ic.odontolog.permissions;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
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
public class PatientPermissionPermissionTest {

  @Autowired MockMvc mockMvc;
  @MockitoBean S3Template s3Template;
  @Autowired PatientRepository patientRepository;
  @Autowired SupervisorRepository supervisorRepository;
  @Autowired StudentRepository studentRepository;
  @Autowired PatientPermissionRepository patientPermissionRepository;

  private Patient patient;
  private Student student;

  @BeforeEach
  void setup() {
    patient = patientRepository.save(Patient.builder().name("Patient_Perm_Test").build());

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

  // POST /api/patients/{patientId}/permissions/{studentId}
  @Test
  @WithMockUser(username = "supervisor@test.com", roles = {"SUPERVISOR"})
  void grantPermission_asSupervisor_allowed() throws Exception {
    mockMvc
        .perform(
            post("/api/patients/{patientId}/permissions/{studentId}", patient.getId(), student.getId())
                .contentType(APPLICATION_JSON))
        .andExpect(status().isCreated());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void grantPermission_studentForbidden() throws Exception {
    mockMvc
        .perform(
            post("/api/patients/{patientId}/permissions/{studentId}", patient.getId(), student.getId())
                .contentType(APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  // DELETE /api/patients/{patientId}/permissions/{studentId}
  @Test
  @WithMockUser(username = "supervisor@test.com", roles = {"SUPERVISOR"})
  void revokePermission_asSupervisor_allowed() throws Exception {
    grantPermissionToStudent();

    mockMvc
        .perform(
            delete("/api/patients/{patientId}/permissions/{studentId}", patient.getId(), student.getId())
                .contentType(APPLICATION_JSON))
        .andExpect(status().isNoContent());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void revokePermission_studentForbidden() throws Exception {
    mockMvc
        .perform(
            delete("/api/patients/{patientId}/permissions/{studentId}", patient.getId(), student.getId())
                .contentType(APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  // GET /api/patients/{patientId}/permissions
  @Test
  @WithMockUser(username = "supervisor@test.com", roles = {"SUPERVISOR"})
  void listAllowedStudents_asSupervisor_allowed() throws Exception {
    grantPermissionToStudent();

    mockMvc
        .perform(get("/api/patients/{patientId}/permissions", patient.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
  void listAllowedStudents_studentForbidden() throws Exception {
    mockMvc
        .perform(get("/api/patients/{patientId}/permissions", patient.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }
}

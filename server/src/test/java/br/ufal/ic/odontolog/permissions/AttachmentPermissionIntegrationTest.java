package br.ufal.ic.odontolog.permissions;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.testcontainers.containers.localstack.LocalStackContainer.Service.S3;

import br.ufal.ic.odontolog.config.S3Properties;
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
import java.io.IOException;
import java.net.URI;
import java.time.Instant;
import java.util.Map;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.testcontainers.containers.localstack.LocalStackContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@Testcontainers
class AttachmentPermissionIntegrationTest {
  @Autowired MockMvc mockMvc;
  @Autowired S3Template s3Template;

  @Container
  private static final LocalStackContainer localStack =
      new LocalStackContainer(DockerImageName.parse("localstack/localstack:latest"))
          .withServices(LocalStackContainer.Service.S3);

  private static final String PUBLIC_BUCKET_NAME = "odontolog-test-public";
  private static final String PRIVATE_BUCKET_NAME = "odontolog-test-private";

  @DynamicPropertySource
  static void overrideProperties(DynamicPropertyRegistry registry) {
    registry.add("spring.cloud.aws.s3.enabled", () -> "true");
    registry.add("app.s3.buckets.public-bucket", () -> PUBLIC_BUCKET_NAME);
    registry.add("app.s3.buckets.private-bucket", () -> PRIVATE_BUCKET_NAME);
    registry.add("app.s3.signed-url-timeout", () -> "15m");
    registry.add("spring.cloud.aws.s3.region", () -> localStack.getRegion());
    registry.add("spring.cloud.aws.credentials.access-key", () -> localStack.getAccessKey());
    registry.add("spring.cloud.aws.credentials.secret-key", () -> localStack.getSecretKey());
    registry.add(
        "spring.cloud.aws.s3.endpoint", () -> localStack.getEndpointOverride(S3).toString());
    registry.add("spring.cloud.aws.s3.path-style-access-enabled", () -> "true");
  }

  @Autowired PatientRepository patientRepository;
  @Autowired SupervisorRepository supervisorRepository;
  @Autowired StudentRepository studentRepository;
  @Autowired PatientPermissionRepository patientPermissionRepository;
  @Autowired ObjectMapper objectMapper;
  @Autowired S3Properties s3Properties;

  private Patient patient;
  private Student student;

  @BeforeAll
  static void beforeAll() throws IOException, InterruptedException {
    localStack.execInContainer("awslocal", "s3", "mb", "s3://" + PUBLIC_BUCKET_NAME);
    localStack.execInContainer("awslocal", "s3", "mb", "s3://" + PRIVATE_BUCKET_NAME);
  }

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
    // Não conceder permissão aqui; testes individuais chamam grantPermissionToStudent() quando
    // necessário
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
  // GET /api/patients/{patientId}/attachments
  // -------------------------------------------------
  @Test
  @WithMockUser(
      username = "supervisor@test.com",
      roles = {"SUPERVISOR"})
  void getAttachments_asSupervisor_allowed() throws Exception {
    mockMvc
        .perform(
            get("/api/patients/{id}/attachments", patient.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(
      username = "student@test.com",
      roles = {"STUDENT"})
  void getAttachments_studentWithoutPermission_forbidden() throws Exception {
    mockMvc
        .perform(
            get("/api/patients/{id}/attachments", patient.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(
      username = "student@test.com",
      roles = {"STUDENT"})
  void getAttachments_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    mockMvc
        .perform(
            get("/api/patients/{id}/attachments", patient.getId()).contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  // -------------------------
  // POST /api/patients/{id}/attachments/init-upload
  // -------------------------
  @Test
  @WithMockUser(
      username = "supervisor@test.com",
      roles = {"SUPERVISOR"})
  void initUpload_asSupervisor_allowed() throws Exception {
    mockMvc
        .perform(
            MockMvcRequestBuilders.multipart(
                    "/api/patients/{id}/attachments/init-upload", patient.getId())
                .contentType(APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.uploadUrl").isNotEmpty());
  }

  @Test
  @WithMockUser(
      username = "student@test.com",
      roles = {"STUDENT"})
  void initUpload_studentWithoutPermission_forbidden() throws Exception {
    mockMvc
        .perform(
            post("/api/patients/{id}/attachments/init-upload", patient.getId())
                .contentType(APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(
      username = "student@test.com",
      roles = {"STUDENT"})
  void initUpload_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    mockMvc
        .perform(
            post("/api/patients/{id}/attachments/init-upload", patient.getId())
                .contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  private String getCreateAttachmentBody() throws Exception {
    String jsonInitUpload =
        mockMvc
            .perform(
                MockMvcRequestBuilders.multipart(
                    "/api/patients/{id}/attachments/init-upload", patient.getId()))
            .andExpect(MockMvcResultMatchers.status().isOk())
            .andExpect(MockMvcResultMatchers.jsonPath("$.uploadUrl").isNotEmpty())
            .andExpect(MockMvcResultMatchers.jsonPath("$.objectKey").isNotEmpty())
            .andReturn()
            .getResponse()
            .getContentAsString();

    String uploadUrl = objectMapper.readTree(jsonInitUpload).get("uploadUrl").asText();
    URI uploadUri = URI.create(uploadUrl);
    String objectKey = objectMapper.readTree(jsonInitUpload).get("objectKey").asText();

    // Simula o upload do arquivo para o S3 usando a URL pré-assinada
    RestTemplate restTemplate = new RestTemplate();

    String fileContent = "This is a test attachment content.";
    String filename = "test-attachment.txt";
    Integer fileSize = fileContent.getBytes().length;

    HttpHeaders headers = new HttpHeaders();
    // O S3 espera 'application/octet-stream' ou o 'Content-Type' real
    headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
    headers.add("Content-Disposition", "attachment; filename=\"" + filename + "\"");

    HttpEntity<String> requestEntity = new HttpEntity<>(fileContent, headers);

    ResponseEntity<String> response =
        restTemplate.exchange(uploadUri, HttpMethod.PUT, requestEntity, String.class);

    assertTrue(response.getStatusCode().is2xxSuccessful());

    return objectMapper.writeValueAsString(
        Map.of(
            "filename",
            filename,
            "filetype",
            "text/plain",
            "size",
            fileSize,
            "objectKey",
            objectKey));
  }

  private String getCreateAttachmentBodyFake() throws Exception {
    return objectMapper.writeValueAsString(
        Map.of(
            "filename", "text.txt", "filetype", "text/plain", "size", 123, "objectKey", "la-key"));
  }

  // -------------------------
  // POST /api/patients/{id}/attachments  (createAttachment)
  // -------------------------
  @Test
  @WithMockUser(
      username = "supervisor@test.com",
      roles = {"SUPERVISOR"})
  void createAttachment_asSupervisor_allowed() throws Exception {
    String body = getCreateAttachmentBody();
    mockMvc
        .perform(
            post("/api/patients/{id}/attachments", patient.getId())
                .contentType(APPLICATION_JSON)
                .content(body))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(
      username = "student@test.com",
      roles = {"STUDENT"})
  void createAttachment_studentWithoutPermission_forbidden() throws Exception {
    String body = getCreateAttachmentBodyFake();
    mockMvc
        .perform(
            post("/api/patients/{id}/attachments", patient.getId())
                .contentType(APPLICATION_JSON)
                .content(body))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(
      username = "student@test.com",
      roles = {"STUDENT"})
  void createAttachment_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    String body = getCreateAttachmentBody();
    mockMvc
        .perform(
            post("/api/patients/{id}/attachments", patient.getId())
                .contentType(APPLICATION_JSON)
                .content(body))
        .andExpect(status().isOk());
  }

  private Long createAttachmentAndReturnId() throws Exception {
    String body = getCreateAttachmentBody();
    String response =
        mockMvc
            .perform(
                post("/api/patients/{id}/attachments", patient.getId())
                    .with(user("supervisor@test.com").roles("SUPERVISOR"))
                    .contentType(APPLICATION_JSON)
                    .content(body))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();

    Map<?, ?> map = objectMapper.readValue(response, Map.class);
    Number idNum = (Number) map.get("id");
    return idNum != null ? idNum.longValue() : null;
  }

  // -------------------------
  // GET /api/patients/{patientId}/attachments/{attachmentId}
  // -------------------------
  @Test
  @WithMockUser(
      username = "supervisor@test.com",
      roles = {"SUPERVISOR"})
  void getAttachmentById_asSupervisor_allowed() throws Exception {
    Long attachmentId = createAttachmentAndReturnId();
    mockMvc
        .perform(
            get(
                    "/api/patients/{patientId}/attachments/{attachmentId}",
                    patient.getId(),
                    attachmentId)
                .contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(
      username = "student@test.com",
      roles = {"STUDENT"})
  void getAttachmentById_studentWithoutPermission_forbidden() throws Exception {
    mockMvc
        .perform(
            get("/api/patients/{patientId}/attachments/{attachmentId}", patient.getId(), 100L)
                .contentType(APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(
      username = "student@test.com",
      roles = {"STUDENT"})
  void getAttachmentById_studentWithPermission_allowed() throws Exception {
    grantPermissionToStudent();
    Long attachmentId = createAttachmentAndReturnId();
    mockMvc
        .perform(
            get(
                    "/api/patients/{patientId}/attachments/{attachmentId}",
                    patient.getId(),
                    attachmentId)
                .contentType(APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  @AfterAll
  static void afterAll() {
    localStack.stop();
  }
}

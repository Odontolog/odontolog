package br.ufal.ic.odontolog.controllers;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertTrue;
import static org.testcontainers.containers.localstack.LocalStackContainer.Service.S3;

import br.ufal.ic.odontolog.config.S3Properties;
import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.repositories.PatientRepository;
import br.ufal.ic.odontolog.repositories.SupervisorRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.awspring.cloud.s3.S3Template;
import java.io.IOException;
import java.net.URI;

import org.aspectj.lang.annotation.After;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
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
import org.springframework.web.client.RestTemplate;
import org.testcontainers.containers.localstack.LocalStackContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Testcontainers
public class PatientControllerIntegrationTest {
        @Autowired
        MockMvc mockMvc;
        @Autowired
        S3Template s3Template;

        @Container
        private static final LocalStackContainer localStack = new LocalStackContainer(
                        DockerImageName.parse("localstack/localstack:latest"))
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

        @Autowired
        PatientRepository patientRepository;
        @Autowired
        SupervisorRepository supervisorRepository;
        @Autowired
        S3Properties s3Properties;
        @Autowired
        ObjectMapper objectMapper;

        private Patient patient;
        private Supervisor supervisor;

        @BeforeAll
        static void beforeAll() throws IOException, InterruptedException {
                localStack.execInContainer("awslocal", "s3", "mb", "s3://" + PUBLIC_BUCKET_NAME);
                localStack.execInContainer("awslocal", "s3", "mb", "s3://" + PRIVATE_BUCKET_NAME);
        }

        @BeforeEach
        void setupPatient() {
                patient = patientRepository.save(Patient.builder().name("Patient_Test_001").build());

                supervisor = supervisorRepository
                                .findByEmail("supervisor@test.com")
                                .orElseGet(
                                                () -> supervisorRepository.save(
                                                                Supervisor.builder()
                                                                                .name("supervisor 1")
                                                                                .email("supervisor@test.com")
                                                                                .build()));
        }

        @Test
        @DisplayName("Tests the flow of uploading an attachment for a patient")
        @WithMockUser(username = "supervisor@test.com", roles = { "SUPERVISOR" })
        void uploadAttachment_uploadsFileAndReturnsUrl() throws Exception {
                String jsonInitUpload = mockMvc
                                .perform(
                                                MockMvcRequestBuilders.multipart(
                                                                "/api/patients/{id}/attachments/init-upload",
                                                                patient.getId()))
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

                ResponseEntity<String> response = restTemplate.exchange(uploadUri, HttpMethod.PUT, requestEntity,
                                String.class);

                // Verifica se o upload foi bem-sucedido
                assertTrue(response.getStatusCode().is2xxSuccessful());

                // Verifica se o arquivo foi enviado corretamente
                boolean doesObjectExist = s3Template.objectExists(s3Properties.getBuckets().getPrivateBucket(),
                                objectKey);
                assertTrue(doesObjectExist);

                // Cria o attachment no sistema vinculando ao paciente
                String createAttachmentRequest = """
                                                {
                                                    "filename": "%s",
                                                    "objectKey": "%s",
                                                    "filetype": "text/plain",
                                                    "size": %d
                                                }
                                """
                                .formatted(filename, objectKey, fileSize);

                String createAttachmentResponse = mockMvc
                                .perform(
                                                MockMvcRequestBuilders.post(
                                                                "/api/patients/%s/attachments"
                                                                                .formatted(patient.getId()))
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .content(createAttachmentRequest))
                                .andExpect(MockMvcResultMatchers.status().isOk())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.id").isNotEmpty())
                                .andReturn()
                                .getResponse()
                                .getContentAsString();

                // Checa se é possível obter o attachment via API
                Long attachmentId = objectMapper.readTree(createAttachmentResponse).get("id").asLong();
                String getAttachmentJson = mockMvc
                                .perform(
                                                MockMvcRequestBuilders.get(
                                                                "/api/patients/{patientId}/attachments/{attachmentId}",
                                                                patient.getId(),
                                                                attachmentId))
                                .andExpect(MockMvcResultMatchers.status().isOk())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(attachmentId))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.filename").value("test-attachment.txt"))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.filetype").value("text/plain"))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.objectKey").value(objectKey))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.presignedUrl").isNotEmpty())
                                .andReturn()
                                .getResponse()
                                .getContentAsString();

                // Checa se o presigned URL funciona para download
                String presignedUrl = objectMapper.readTree(getAttachmentJson).get("presignedUrl").asText();
                URI downloadUri = URI.create(presignedUrl);
                ResponseEntity<byte[]> downloadResponse = restTemplate.exchange(downloadUri, HttpMethod.GET, null,
                                byte[].class);
                assertTrue(downloadResponse.getStatusCode().is2xxSuccessful());
                assertArrayEquals(fileContent.getBytes(), downloadResponse.getBody());
        }

        @Test
        @DisplayName("Test trying to create an attachment when the file does not exist in S3")
        @WithMockUser(username = "supervisor@test.com", roles = { "SUPERVISOR" })
        void createAttachment_fileNotInS3_returnsUnprocessableEntity() throws Exception {
                String createAttachmentRequest = """
                                        {
                                            "filename": "non-existent-file.txt",
                                            "objectKey": "patients/%d/attachments/non-existent-file.txt",
                                            "filetype": "text/plain",
                                            "size": 20
                                        }
                                """
                                .formatted(patient.getId());

                mockMvc
                                .perform(
                                                MockMvcRequestBuilders
                                                                .post("/api/patients/%s/attachments"
                                                                                .formatted(patient.getId()))
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .content(createAttachmentRequest))
                                .andExpect(MockMvcResultMatchers.status().isUnprocessableEntity());
        }

        @AfterAll
        static void afterAll() {
                localStack.stop();
                
        }
}

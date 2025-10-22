package br.ufal.ic.odontolog.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.ufal.ic.odontolog.enums.Role;
import br.ufal.ic.odontolog.models.Student;
import br.ufal.ic.odontolog.repositories.StudentRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerIntegrationTest {

  @Autowired MockMvc mockMvc;
  @Autowired ObjectMapper objectMapper;
  @Autowired StudentRepository studentRepository;
  @Autowired PasswordEncoder passwordEncoder;

  private static final String USERNAME = "student.test.001@test.com";
  private static final String PASSWORD = "password";

  @BeforeEach
  void seedUser() {
    studentRepository
        .findByEmail(USERNAME)
        .orElseGet(
            () ->
                studentRepository.save(
                    Student.builder()
                        .name("Student_Test_001")
                        .email(USERNAME)
                        .password(passwordEncoder.encode(PASSWORD))
                        .clinicNumber(1)
                        .enrollmentCode("20250914")
                        .enrollmentYear(2025)
                        .enrollmentSemester(1)
                        .photoUrl("some-url")
                        .role(Role.STUDENT)
                        .build()));
  }

  @Test
  @DisplayName("Login deve retornar 200 e accessToken")
  void validLogin() throws Exception {
    var body =
        """
          {"username":"%s","password":"%s"}
        """.formatted(USERNAME, PASSWORD);

    var mvcResult =
        mockMvc
            .perform(post("/api/auth/login").contentType(APPLICATION_JSON).content(body))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.accessToken").exists())
            .andReturn();

    JsonNode node = objectMapper.readTree(mvcResult.getResponse().getContentAsString());
    String token = node.get("accessToken").asText();
    assertThat(token).isNotBlank();
  }

  @Test
  @DisplayName("Login inválido deve retornar 403")
  void invalidLogin() throws Exception {
    var body =
        """
          {"username":"%s","password":"%s"}
        """
            .formatted(USERNAME, "wrongpass");

    mockMvc
        .perform(post("/api/auth/login").contentType(APPLICATION_JSON).content(body))
        .andExpect(status().isForbidden());
  }

  @Test
  @DisplayName("Acesso sem token deve retornar 403")
  void protectedWithoutToken() throws Exception {
    mockMvc.perform(get("/api/hello")).andExpect(status().isForbidden());
  }

  @Test
  @DisplayName("Acesso com token inválido deve retornar 403")
  void protectedWithInvalidToken() throws Exception {
    mockMvc
        .perform(get("/api/hello").header("Authorization", "Bearer abc.def.ghi"))
        .andExpect(status().isForbidden());
  }

  @Test
  @DisplayName("Acesso com token válido deve retornar 200")
  void protectedWithValidToken() throws Exception {
    var loginResp =
        mockMvc
            .perform(
                post("/api/auth/login")
                    .contentType(APPLICATION_JSON)
                    .content(
                        """
                              {"username":"%s","password":"%s"}
                        """
                            .formatted(USERNAME, PASSWORD)))
            .andReturn();
    var token =
        objectMapper
            .readTree(loginResp.getResponse().getContentAsString())
            .get("accessToken")
            .asText();

    mockMvc
        .perform(get("/api/hello").header("Authorization", "Bearer " + token))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.message").value("Hello, authenticated user!"));
  }

  @Test
  @DisplayName("Usuário deve conseguir alterar senha e fazer login com a nova senha")
  void changePasswordAndLoginAgain() throws Exception {
    // 1. Login inicial para obter o token
    var loginResp =
        mockMvc
            .perform(
                post("/api/auth/login")
                    .contentType(APPLICATION_JSON)
                    .content(
                        """
                              {"username":"%s","password":"%s"}
                        """
                            .formatted(USERNAME, PASSWORD)))
            .andExpect(status().isOk())
            .andReturn();

    var token =
        objectMapper
            .readTree(loginResp.getResponse().getContentAsString())
            .get("accessToken")
            .asText();

    // 2. Trocar a senha
    String newPassword = "newPassword123";
    var changePasswordBody =
        """
          {"newPassword":"%s","confirmPassword":"%s"}
        """
            .formatted(newPassword, newPassword);

    mockMvc
        .perform(
            post("/api/auth/change-password")
                .contentType(APPLICATION_JSON)
                .content(changePasswordBody)
                .header("Authorization", "Bearer " + token))
        .andExpect(status().isNoContent());

    // 3. Tentar login com senha antiga (deve falhar)
    mockMvc
        .perform(
            post("/api/auth/login")
                .contentType(APPLICATION_JSON)
                .content(
                    """
                          {"username":"%s","password":"%s"}
                    """
                        .formatted(USERNAME, PASSWORD)))
        .andExpect(status().isForbidden());

    // 4. Login com a nova senha (deve funcionar)
    mockMvc
        .perform(
            post("/api/auth/login")
                .contentType(APPLICATION_JSON)
                .content(
                    """
                          {"username":"%s","password":"%s"}
                    """
                        .formatted(USERNAME, newPassword)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.accessToken").exists());

    // Restaurar a senha original para não afetar outros testes
    Student student = studentRepository.findByEmail(USERNAME).orElseThrow();
    student.setPassword(passwordEncoder.encode(PASSWORD));
    student.setFirstAccess(true);
    studentRepository.save(student);
  }
}

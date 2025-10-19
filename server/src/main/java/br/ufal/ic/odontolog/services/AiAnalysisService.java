package br.ufal.ic.odontolog.services;

import br.ufal.ic.odontolog.config.AIConfig;
import br.ufal.ic.odontolog.enums.ActivityType;
import br.ufal.ic.odontolog.models.Activity;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import br.ufal.ic.odontolog.models.User;
import br.ufal.ic.odontolog.repositories.ActivityRepository;
import br.ufal.ic.odontolog.repositories.TreatmentPlanRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class AiAnalysisService {

  private final ActivityRepository activityRepository;
  private final TreatmentPlanRepository treatmentPlanRepository;
  private final ObjectMapper objectMapper = new ObjectMapper();
  private final AIConfig aiConfig;

  @PostConstruct
  public void init() {
    objectMapper.registerModule(new JavaTimeModule());
    objectMapper.findAndRegisterModules();
  }

  @Async
  @Transactional
  public void analyzeTreatmentPlanAsync(
      TreatmentPlan plan, Map<String, Object> summaryDto, User currentUser) {
    CompletableFuture.runAsync(
        () -> {
          try {
            String jsonSummary =
                objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(summaryDto);

            Map<String, Object> payload =
                Map.of(
                    "model",
                    aiConfig.getModel(),
                    "messages",
                    List.of(
                        Map.of(
                            "role",
                            "system",
                            "content",
                            "Você é um assistente especializado em análise odontológica."),
                        Map.of("role", "user", "content", buildPrompt(jsonSummary))),
                    "temperature",
                    0.3,
                    "max_tokens",
                    800);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(aiConfig.getToken());

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);
            RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<Map> response =
                restTemplate.postForEntity(aiConfig.getUrl(), requestEntity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
              Map body = response.getBody();
              String content = extractContent(body);

              var metadata = new HashMap<String, Object>(Map.of("ai_analysis", content));
              if (plan != null) {
                Activity aiActivity =
                    Activity.builder()
                        .actor(currentUser)
                        .reviewable(plan)
                        .type(ActivityType.AI_ANALYSIS)
                        .description("Análise automática de IA do plano de tratamento gerada.")
                        .metadata(metadata)
                        .build();
                plan.getHistory().add(aiActivity);
                activityRepository.save(aiActivity);
                treatmentPlanRepository.save(plan);
              }
              System.out.println("Análise de IA concluída com sucesso.");
            } else {
              System.err.println("Falha ao chamar Hugging Face API: " + response.getStatusCode());
            }

          } catch (Exception e) {
            e.printStackTrace();
          }
        });
  }

  private String extractContent(Map body) {
    try {
      List choices = (List) body.get("choices");
      if (choices != null && !choices.isEmpty()) {
        Map choice = (Map) choices.get(0);
        Map message = (Map) choice.get("message");
        return (String) message.get("content");
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    return "(Falha ao extrair conteúdo da resposta da IA)";
  }

  private String buildPrompt(String jsonSummary) {
    return """
        Analise este JSON de plano de tratamento odontológico e forneça insights valiosos em português:

        %s

        Forneça uma análise completa sobre:
        - Condição do paciente
        - Procedimentos planejados
        - Riscos e considerações
        - Informações relevantes sobre as pessoas envolvidas
        - Se necessário, histórico das ações

        Alguma considerações:
        - DRAFT significa que está em construção/processo de criação
        - STUDENT significa role de estudante
        - SUPERVISOR significa role de supervisor
        - Lembre-se de falar somente em português.
        - Seja curto sem perder muita informação, faça um texto corrido.
        - Não foque nos dados pessoais do paciente.
        - Não dê sugestões de tratamento, apenas analise o plano fornecido.
        """
        .formatted(jsonSummary);
  }
}

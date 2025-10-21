package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.mappers.TreatmentPlanMapper;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import br.ufal.ic.odontolog.models.User;
import br.ufal.ic.odontolog.repositories.TreatmentPlanRepository;
import br.ufal.ic.odontolog.services.AiAnalysisService;
import br.ufal.ic.odontolog.utils.CurrentUserProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
@Profile("dev")
public class TestController {

  private final AiAnalysisService aiAnalysisService;
  private final TreatmentPlanRepository treatmentPlanRepository;

  private final TreatmentPlanMapper treatmentPlanMapper;
  private final CurrentUserProvider currentUserProvider;

  @GetMapping("/ai-analysis/{id}")
  public String testAiAnalysisService(@PathVariable Long id) {
    User currentUser = currentUserProvider.getCurrentUser();
    Optional<TreatmentPlan> treatmentPlan = treatmentPlanRepository.findById(id);
    if (treatmentPlan.isPresent()) {

      var plan = treatmentPlan.get();
      var dto = treatmentPlanMapper.toDTO(plan);
      ObjectMapper mapper = new ObjectMapper();
      mapper.registerModule(new JavaTimeModule());
      Map<String, Object> safeCopy = mapper.convertValue(dto, Map.class);
      aiAnalysisService.analyzeTreatmentPlanAsync(plan, safeCopy, currentUser);
      return "TreatmentPlan with ID " + id + " passed to AiAnalysisService successfully!";
    } else {
      return "TreatmentPlan with ID " + id + " not found.";
    }
  }
}

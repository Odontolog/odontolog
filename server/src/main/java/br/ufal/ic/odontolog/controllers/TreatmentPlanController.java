package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.models.TreatmentPlan;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
public class TreatmentPlanController {
    @PostMapping("/api/v1/treatment_plan")
    TreatmentPlan createTreatmentPlan() {
        // TODO: Implement the actual creation logic
        return new TreatmentPlan();
    }


}

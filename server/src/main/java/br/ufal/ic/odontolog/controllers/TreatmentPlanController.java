package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.models.TreatmentPlan;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("/api/v1/treatment_plan")
public class TreatmentPlanController {
    @PostMapping()
    TreatmentPlan createTreatmentPlan() {
        return new TreatmentPlan();
    }
}

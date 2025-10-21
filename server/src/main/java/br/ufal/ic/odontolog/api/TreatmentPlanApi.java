package br.ufal.ic.odontolog.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Treatment Plans", description = "Endpoints for managing treatment plan items")
@SecurityRequirement(name = "bearerAuth")
public interface TreatmentPlanApi {}

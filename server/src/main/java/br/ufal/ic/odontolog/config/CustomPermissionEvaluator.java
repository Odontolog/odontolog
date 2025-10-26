package br.ufal.ic.odontolog.config;

import br.ufal.ic.odontolog.models.Procedure;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import br.ufal.ic.odontolog.repositories.ProcedureRepository;
import br.ufal.ic.odontolog.repositories.TreatmentPlanRepository;
import br.ufal.ic.odontolog.repositories.UserRepository;
import br.ufal.ic.odontolog.services.PatientPermissionService;
import java.io.Serializable;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomPermissionEvaluator implements PermissionEvaluator {

  private final PatientPermissionService patientPermissionService;
  private final UserRepository userRepository;
  private final TreatmentPlanRepository treatmentPlanRepository;
  private final ProcedureRepository procedureRepository;

  @Override
  public boolean hasPermission(
      Authentication authentication, Object targetDomainObject, Object permission) {
    return false;
  }

  @Override
  public boolean hasPermission(
      Authentication authentication, Serializable targetId, String targetType, Object permission) {
    if (!(targetId instanceof Long id)) {
      return false;
    }

    UUID userId = getUserId(authentication);
    if (userId == null) {
      return false;
    }

    var authorities = authentication.getAuthorities();
    boolean isAdminOrSupervisor =
        authorities.stream()
            .anyMatch(
                a ->
                    a.getAuthority().equals("ROLE_ADMIN")
                        || a.getAuthority().equals("ROLE_SUPERVISOR"));

    if (isAdminOrSupervisor) {
      return true;
    }

    boolean isStudent = authorities.stream().anyMatch(a -> a.getAuthority().equals("ROLE_STUDENT"));
    if (isStudent) {
      switch (targetType) {
        case "Patient":
          return hasPatientPermission(id, userId);
        case "TreatmentPlan":
          return hasTreatmentPlanPermission(id, userId);
        case "Procedure":
          return hasProcedurePermission(id, userId);
      }
    }

    return false;
  }

  private boolean hasTreatmentPlanPermission(Long treatmentPlanId, UUID userId) {
    TreatmentPlan treatmentPlan = treatmentPlanRepository.findById(treatmentPlanId).orElseThrow();
    return patientPermissionService.hasPermission(userId, treatmentPlan.getPatient().getId());
  }

  private boolean hasProcedurePermission(Long procedureId, UUID userId) {
    Procedure procedure = procedureRepository.findById(procedureId).orElseThrow();
    return patientPermissionService.hasPermission(userId, procedure.getPatient().getId());
  }

  private boolean hasPatientPermission(Long patientId, UUID userId) {
    return patientPermissionService.hasPermission(userId, patientId);
  }

  private UUID getUserId(Authentication authentication) {
    return userRepository
        .getReferenceByEmail(((UserDetails) authentication.getPrincipal()).getUsername())
        .getId();
  }
}

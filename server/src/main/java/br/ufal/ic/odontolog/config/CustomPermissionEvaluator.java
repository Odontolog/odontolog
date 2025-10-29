package br.ufal.ic.odontolog.config;

import br.ufal.ic.odontolog.exceptions.ResourceNotFoundException;
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
        case "Reviewable":
          return hasReviewablePermission(id, userId);
      }
    }

    return false;
  }

  private boolean hasTreatmentPlanPermission(Long treatmentPlanId, UUID userId) {
    TreatmentPlan treatmentPlan =
        treatmentPlanRepository
            .findById(treatmentPlanId)
            .orElseThrow(() -> new ResourceNotFoundException("Treatment plan not found"));
    return patientPermissionService.hasPermission(userId, treatmentPlan.getPatient().getId());
  }

  private boolean hasProcedurePermission(Long procedureId, UUID userId) {
    Procedure procedure =
        procedureRepository
            .findById(procedureId)
            .orElseThrow(() -> new ResourceNotFoundException("Procedure not found"));
    return patientPermissionService.hasPermission(userId, procedure.getPatient().getId());
  }

  private boolean hasPatientPermission(Long patientId, UUID userId) {
    return patientPermissionService.hasPermission(userId, patientId);
  }

  private boolean hasReviewablePermission(Long reviewableId, UUID userId) {
    Long patientId = getReviewablePatientId(reviewableId);
    return patientPermissionService.hasPermission(userId, patientId);
  }

  // Gambiarra fubenta
  private Long getReviewablePatientId(Long reviewableId) {
    var treatmentOpt = treatmentPlanRepository.findById(reviewableId);
    if (treatmentOpt.isPresent()) {
      return treatmentOpt.get().getPatient().getId();
    }

    var procedureOpt = procedureRepository.findById(reviewableId);
    if (procedureOpt.isPresent()) {
      return procedureOpt.get().getPatient().getId();
    }

    throw new ResourceNotFoundException("Reviewable not found");
  }

  private UUID getUserId(Authentication authentication) {
    return userRepository
        .getReferenceByEmail(((UserDetails) authentication.getPrincipal()).getUsername())
        .getId();
  }
}

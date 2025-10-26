package br.ufal.ic.odontolog.config;

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

  @Override
  public boolean hasPermission(
      Authentication authentication, Object targetDomainObject, Object permission) {
    return false;
  }

  @Override
  public boolean hasPermission(
      Authentication authentication, Serializable targetId, String targetType, Object permission) {
    if (!(targetId instanceof Long patientId)) {
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
      return patientPermissionService.hasPermission(userId, patientId);
    }

    return false;
  }

  private UUID getUserId(Authentication authentication) {
    return userRepository
        .getReferenceByEmail(((UserDetails) authentication.getPrincipal()).getUsername())
        .getId();
  }
}

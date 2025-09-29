package br.ufal.ic.odontolog.utils;

import br.ufal.ic.odontolog.models.User;
import br.ufal.ic.odontolog.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CurrentUserProvider {

  private final UserRepository userRepository;

  public User getCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null || !authentication.isAuthenticated()) {
      throw new EntityNotFoundException("No authenticated user found");
    }

    return userRepository.getReferenceByEmail(
        ((UserDetails) authentication.getPrincipal()).getUsername());
  }

  public UserDetails getCurrentUserDetails() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null || !authentication.isAuthenticated()) {
      throw new EntityNotFoundException("No authenticated user found");
    }

    return (UserDetails) authentication.getPrincipal();
  }
}

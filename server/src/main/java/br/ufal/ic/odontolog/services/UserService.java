// ...new file...
package br.ufal.ic.odontolog.services;

import br.ufal.ic.odontolog.dtos.ChangePasswordRequestDTO;
import br.ufal.ic.odontolog.exceptions.UnprocessableRequestException;
import br.ufal.ic.odontolog.models.User;
import br.ufal.ic.odontolog.repositories.UserRepository;
import br.ufal.ic.odontolog.utils.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final CurrentUserProvider currentUserProvider;

  @Transactional
  public void changePassword(ChangePasswordRequestDTO req) {
    if (!req.getNewPassword().equals(req.getConfirmPassword())) {
      throw new UnprocessableRequestException("Passwords do not match");
    }

    User user = currentUserProvider.getCurrentUser();
    user.setPassword(passwordEncoder.encode(req.getNewPassword()));
    user.setFirstAccess(false);
    userRepository.save(user);
  }
}

package br.ufal.ic.odontolog.repositories;

import br.ufal.ic.odontolog.models.User;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID> {
  Optional<User> findByEmail(String email);

  User getReferenceByEmail(String email);
}

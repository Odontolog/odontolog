package br.ufal.ic.odontolog.repositories;

import br.ufal.ic.odontolog.models.Attachment;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttachmentRepository extends JpaRepository<Attachment, UUID> {}

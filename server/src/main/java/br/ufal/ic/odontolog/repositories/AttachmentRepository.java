package br.ufal.ic.odontolog.repositories;

import br.ufal.ic.odontolog.models.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
}

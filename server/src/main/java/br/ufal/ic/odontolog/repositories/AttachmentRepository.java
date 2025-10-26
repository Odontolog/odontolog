package br.ufal.ic.odontolog.repositories;

import br.ufal.ic.odontolog.models.Attachment;
import br.ufal.ic.odontolog.models.Patient;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
  Optional<Attachment> findByIdAndPatient(Long attachmentId, Patient patient);

  List<Attachment> findAllByPatient(Patient patient);
}

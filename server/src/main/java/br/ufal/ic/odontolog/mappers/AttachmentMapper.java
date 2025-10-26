package br.ufal.ic.odontolog.mappers;

import java.util.List;

import org.mapstruct.Mapper;

import br.ufal.ic.odontolog.dtos.AttachmentDTO;
import br.ufal.ic.odontolog.models.Attachment;

@Mapper(componentModel = "spring")
public interface AttachmentMapper {
    AttachmentDTO toDTO(Attachment attachment);

    List<AttachmentDTO> toDTOs(List<Attachment> attachments);
}

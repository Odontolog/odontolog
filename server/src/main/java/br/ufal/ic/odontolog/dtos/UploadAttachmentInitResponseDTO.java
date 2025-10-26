package br.ufal.ic.odontolog.dtos;

import java.net.URL;

import lombok.Data;

@Data
public class UploadAttachmentInitResponseDTO {
    private URL uploadUrl;
    private String objectKey;
}

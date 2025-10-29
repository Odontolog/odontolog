package br.ufal.ic.odontolog.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateAttachmentRequestDTO {
  @NotBlank
  private String filename;

  @NotBlank
  private String filetype;

  @NotBlank
  private String objectKey;

  private String description;

  @NotNull
  private Integer size;
}

package br.ufal.ic.odontolog.dtos;

import java.net.URL;
import java.time.Instant;
import lombok.Data;

@Data
public class AttachmentDTO {
  private Long id;
  private String location;
  private String objectKey;
  private String filename;
  private String filetype;
  private String description;
  private Integer size;
  private Instant createdAt;
  private UserResponseDTO uploader;
  private URL presignedUrl;
}

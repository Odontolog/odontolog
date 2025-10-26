package br.ufal.ic.odontolog.dtos;

import java.net.URL;
import lombok.Data;

@Data
public class AttachmentDTO {
  private Long id;
  private String location;
  private String objectKey;
  private String filename;
  private String filetype;
  private Integer size;
  private URL presignedUrl;
}

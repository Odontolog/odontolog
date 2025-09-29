package br.ufal.ic.odontolog.dtos;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientShortDTO {
  private Long id;
  private String avatarUrl;
  private String name;
}

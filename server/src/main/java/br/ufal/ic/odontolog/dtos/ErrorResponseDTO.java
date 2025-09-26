package br.ufal.ic.odontolog.dtos;

import java.util.HashMap;
import java.util.List;
import lombok.Data;

@Data
public class ErrorResponseDTO {
  private String message;
  private String error;
  private HashMap<String, List<String>> errors;
}

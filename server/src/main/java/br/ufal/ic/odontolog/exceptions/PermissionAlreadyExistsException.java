package br.ufal.ic.odontolog.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class PermissionAlreadyExistsException extends RuntimeException {
  public PermissionAlreadyExistsException(String message) {
    super(message);
  }
}

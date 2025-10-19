package br.ufal.ic.odontolog.exceptions;

public class UnprocessableRequestException extends RuntimeException {
  public UnprocessableRequestException(String message) {
    super(message);
  }
}

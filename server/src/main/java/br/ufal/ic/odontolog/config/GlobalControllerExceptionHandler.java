package br.ufal.ic.odontolog.config;

import br.ufal.ic.odontolog.dtos.ErrorResponseDTO;
import br.ufal.ic.odontolog.exceptions.UnprocessableRequestException;
import java.util.HashMap;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class GlobalControllerExceptionHandler {

  @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
  @ExceptionHandler(UnprocessableRequestException.class)
  @ResponseBody
  public ErrorResponseDTO handleUnprocessableRequestException(UnprocessableRequestException ex) {
    ErrorResponseDTO errorResponse = new ErrorResponseDTO();
    errorResponse.setMessage(ex.getMessage());
    errorResponse.setError("Unprocessable Entity");
    errorResponse.setErrors(new HashMap<>());
    return errorResponse;
  }
}

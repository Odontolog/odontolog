package br.ufal.ic.odontolog.controllers;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HelloController {

  @GetMapping("/public/ping")
  public Map<String, String> ping() {
    return Map.of("status", "ok");
  }

  @GetMapping("/hello")
  public Map<String, String> hello() {
    return Map.of("message", "Hello, authenticated user!");
  }
}

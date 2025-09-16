package br.ufal.ic.odontolog.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class HelloController {

    @GetMapping("/public/ping")
    public Map<String, String> ping() {
        return Map.of("status", "ok");
    }

    @GetMapping("/hello")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public Map<String, String> hello() {
        return Map.of("message", "Hello, authenticated user!");
    }
}

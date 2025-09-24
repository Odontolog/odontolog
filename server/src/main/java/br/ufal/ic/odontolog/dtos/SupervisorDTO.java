package br.ufal.ic.odontolog.dtos;

import java.util.UUID;

import lombok.Data;

@Data
public class SupervisorDTO {
    private UUID id;
    private String specialization;
    private String siape;
    private String name;
    private String email;
}

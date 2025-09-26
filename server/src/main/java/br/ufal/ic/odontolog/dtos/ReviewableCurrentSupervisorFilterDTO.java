package br.ufal.ic.odontolog.dtos;

import java.util.Optional;

import lombok.Data;

@Data
public class ReviewableCurrentSupervisorFilterDTO {
    private String name;
    private Boolean awaitingMyReview;
}

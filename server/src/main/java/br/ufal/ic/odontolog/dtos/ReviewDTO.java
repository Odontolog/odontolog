package br.ufal.ic.odontolog.dtos;

import java.util.UUID;

import br.ufal.ic.odontolog.enums.ReviewStatus;
import br.ufal.ic.odontolog.models.Supervisor;
import lombok.Data;

@Data
public class ReviewDTO {
    private UUID id;
    private String comments;
    private Integer grade;
    private ReviewStatus reviewStatus;
    private Supervisor supervisor;
}

package br.ufal.ic.odontolog.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.ufal.ic.odontolog.dtos.ReviewableDTO;
import br.ufal.ic.odontolog.mappers.ReviewableMapper;
import br.ufal.ic.odontolog.repositories.ReviewableRepository;
import lombok.RequiredArgsConstructor;

@RestController()
@RequestMapping("/api/reviewables")
@RequiredArgsConstructor
public class ReviewableController {
    private final ReviewableRepository reviewableRepository;
    private final ReviewableMapper reviewableMapper;

    @GetMapping
    public List<ReviewableDTO> getAllReviewables() {
        return reviewableMapper.toDTOs(reviewableRepository.findAll());
    }
}

package br.ufal.ic.odontolog.controllers;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.ufal.ic.odontolog.dtos.ReviewableDTO;
import br.ufal.ic.odontolog.mappers.ReviewableMapper;
import br.ufal.ic.odontolog.models.Review;
import br.ufal.ic.odontolog.models.Reviewable;
import br.ufal.ic.odontolog.repositories.ReviewableRepository;
import br.ufal.ic.odontolog.services.ReviewableService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestParam;

@RestController()
@RequestMapping("/api/reviewables")
@RequiredArgsConstructor
public class ReviewableController {
    private final ReviewableRepository reviewableRepository;
    private final ReviewableMapper reviewableMapper;
    private final ReviewableService reviewableService;

    // TODO: This must be restricted to Supervisors role only
    // TODO: Add pagination
    // TODO: Add filtering (e.g., by type)
    @GetMapping(params = { "page", "size" })
    public Page<ReviewableDTO> getAllReviewables(@RequestParam int page, @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Reviewable> pageOfEntidades = reviewableRepository.findAll(pageable);
        Page<ReviewableDTO> pageOfDTOs = pageOfEntidades.map(reviewableMapper::toDTO);

        return pageOfDTOs;
    }

    @GetMapping("/me")
    public Page<ReviewableDTO> getCurrentUserReviewables(Pageable pageable) {
        Page<Reviewable> pageOfEntidades = reviewableRepository.findAll(pageable);
        Page<ReviewableDTO> pageOfDTOs = pageOfEntidades.map(reviewableMapper::toDTO);

        return pageOfDTOs;
    }

}

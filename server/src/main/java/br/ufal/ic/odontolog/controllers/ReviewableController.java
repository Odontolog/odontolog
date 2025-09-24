package br.ufal.ic.odontolog.controllers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.ufal.ic.odontolog.dtos.ReviewableDTO;
import br.ufal.ic.odontolog.mappers.ReviewableMapper;
import br.ufal.ic.odontolog.models.Reviewable;
import br.ufal.ic.odontolog.repositories.ReviewableRepository;
import br.ufal.ic.odontolog.services.ReviewableService;
import lombok.RequiredArgsConstructor;

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
    // TODO: Move this to service layer
    // See also:
    // https://docs.spring.io/spring-data/commons/reference/repositories/core-extensions.html#core.web.page
    @GetMapping
    public PagedModel<ReviewableDTO> getAllReviewables(Pageable pageable) {
        Page<Reviewable> pageOfEntity = reviewableRepository.findAll(pageable);

        // FIXME: I don't know if this is the best way to do this
        Page<ReviewableDTO> pageOfDTOs = pageOfEntity.map(reviewableMapper::toDTO);

        return new PagedModel<>(pageOfDTOs);
    }

    @GetMapping("/me")
    public PagedModel<ReviewableDTO> getCurrentUserReviewables(
            Pageable pageable) {
        Page<Reviewable> pageOfEntidades = reviewableRepository.findAll(pageable);

        // FIXME: I don't know if this is the best way to do this
        Page<ReviewableDTO> pageOfDTOs = pageOfEntidades.map(reviewableMapper::toDTO);

        return new PagedModel<>(pageOfDTOs);
    }

}

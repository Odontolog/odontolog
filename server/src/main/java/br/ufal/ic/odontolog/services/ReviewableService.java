package br.ufal.ic.odontolog.services;

import java.util.List;

import org.springframework.stereotype.Service;

import br.ufal.ic.odontolog.dtos.ReviewableDTO;
import br.ufal.ic.odontolog.mappers.ReviewableMapper;
import br.ufal.ic.odontolog.repositories.ReviewableRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewableService {
    private final ReviewableRepository reviewableRepository;
    private final ReviewableMapper reviewableMapper;

    public List<ReviewableDTO> listReviewableDTOs() {
        return reviewableMapper.toDTOs(reviewableRepository.findAll());
    }
}

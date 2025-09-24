package br.ufal.ic.odontolog.services;

import org.springframework.stereotype.Service;

import br.ufal.ic.odontolog.repositories.ReviewableRepository;

@Service
public class ReviewableService {
    private final ReviewableRepository reviewableRepository;

    public ReviewableService(ReviewableRepository reviewableRepository) {
        this.reviewableRepository = reviewableRepository;
    }
}

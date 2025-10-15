package br.ufal.ic.odontolog.mappers;

import br.ufal.ic.odontolog.dtos.ReviewDTO;
import br.ufal.ic.odontolog.models.Review;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ReviewMapper {
  public ReviewDTO toDTO(Review review);
}

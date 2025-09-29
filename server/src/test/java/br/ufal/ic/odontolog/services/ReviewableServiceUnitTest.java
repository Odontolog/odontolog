package br.ufal.ic.odontolog.services;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

import br.ufal.ic.odontolog.dtos.ReviewableCurrentSupervisorFilterDTO;
import br.ufal.ic.odontolog.dtos.ReviewableDTO;
import br.ufal.ic.odontolog.exceptions.UnprocessableRequestException;
import br.ufal.ic.odontolog.mappers.ReviewableMapper;
import br.ufal.ic.odontolog.models.Reviewable;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.repositories.ReviewableRepository;
import br.ufal.ic.odontolog.repositories.SupervisorRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.UserDetails;

@ExtendWith(MockitoExtension.class)
public class ReviewableServiceUnitTest {
  @Mock private ReviewableRepository reviewableRepository;

  @Mock private SupervisorRepository supervisorRepository;

  @Mock private ReviewableMapper reviewableMapper;

  @InjectMocks private ReviewableService reviewableService;

  @SuppressWarnings("unchecked")
  @Test
  public void givenCurrentSupervisor_whenFindForCurrentSupervisor_thenReturnPageOfReviewableDTOs() {
    // Arrange

    UserDetails mockUserDetails = mock(UserDetails.class);
    when(mockUserDetails.getUsername()).thenReturn("testsupervisor@test.com");

    Pageable pageable = PageRequest.of(0, 10);

    Supervisor mockSupervisor = mock(Supervisor.class);
    mockSupervisor.setEmail("testsupervisor@test.com");
    mockSupervisor.setId(UUID.randomUUID());
    when(supervisorRepository.findByEmail("testsupervisor@test.com"))
        .thenReturn(Optional.of(mockSupervisor));

    Reviewable reviewableEntity = mock(Reviewable.class);
    reviewableEntity.setId(UUID.randomUUID());
    Page<Reviewable> mockPageOfReviewables = new PageImpl<>(List.of(reviewableEntity), pageable, 1);
    when(reviewableRepository.findAll(any(Specification.class), eq(pageable)))
        .thenReturn(mockPageOfReviewables);

    ReviewableDTO reviewableDTO = mock(ReviewableDTO.class);
    reviewableDTO.setId(reviewableEntity.getId());
    when(reviewableMapper.toDTO(reviewableEntity)).thenReturn(reviewableDTO);

    ReviewableCurrentSupervisorFilterDTO filter = new ReviewableCurrentSupervisorFilterDTO();

    // Act

    Page<ReviewableDTO> result =
        reviewableService.findForCurrentSupervisor(pageable, mockUserDetails, filter);

    // Assert

    assertThat(result).isNotNull();
    assertThat(result.getTotalElements()).isEqualTo(1);
    assertThat(result.getContent()).hasSize(1);
    assertThat(result.getContent().get(0).getId()).isEqualTo(reviewableEntity.getId());

    verify(supervisorRepository, times(1)).findByEmail("testsupervisor@test.com");
    verify(reviewableRepository, times(1)).findAll(any(Specification.class), eq(pageable));
    verify(reviewableMapper, times(1)).toDTO(reviewableEntity);
  }

  @Test
  public void givenNonExistentSupervisor_whenFindForCurrentSupervisor_thenThrowException() {
    // Arrange
    UserDetails mockUserDetails = mock(UserDetails.class);
    when(mockUserDetails.getUsername()).thenReturn("nonexistent@test.com");
    Pageable pageable = PageRequest.of(0, 10);
    when(supervisorRepository.findByEmail("nonexistent@test.com")).thenReturn(Optional.empty());
    ReviewableCurrentSupervisorFilterDTO filter = new ReviewableCurrentSupervisorFilterDTO();

    // Act & Assert
    assertThrows(
        UnprocessableRequestException.class,
        () -> {
          reviewableService.findForCurrentSupervisor(pageable, mockUserDetails, filter);
        });

    verify(supervisorRepository, times(1)).findByEmail("nonexistent@test.com");
  }
}

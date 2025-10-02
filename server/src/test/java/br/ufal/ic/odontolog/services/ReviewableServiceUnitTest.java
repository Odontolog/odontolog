package br.ufal.ic.odontolog.services;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

import br.ufal.ic.odontolog.dtos.ActivityDTO;
import br.ufal.ic.odontolog.dtos.ReviewableCurrentSupervisorFilterDTO;
import br.ufal.ic.odontolog.dtos.ReviewableDTO;
import br.ufal.ic.odontolog.exceptions.ResourceNotFoundException;
import br.ufal.ic.odontolog.exceptions.UnprocessableRequestException;
import br.ufal.ic.odontolog.mappers.ActivityMapper;
import br.ufal.ic.odontolog.mappers.ReviewableMapper;
import br.ufal.ic.odontolog.models.Activity;
import br.ufal.ic.odontolog.models.Reviewable;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.repositories.ReviewableRepository;
import br.ufal.ic.odontolog.repositories.SupervisorRepository;
import java.util.List;
import java.util.Optional;
import java.util.Set;
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

  @Mock private ActivityMapper activityMapper;

  @InjectMocks private ReviewableService reviewableService;

  @SuppressWarnings("unchecked")
  @Test
  public void givenCurrentSupervisor_whenFindForCurrentSupervisor_thenReturnPageOfReviewableDTOs() {
    // Arrange

    UserDetails mockUserDetails = mock(UserDetails.class);
    when(mockUserDetails.getUsername()).thenReturn("testsupervisor@test.com");

    Pageable pageable = PageRequest.of(0, 10);

    Supervisor supervisor = new Supervisor();
    supervisor.setEmail("testsupervisor@test.com");
    supervisor.setId(UUID.randomUUID());
    when(supervisorRepository.findByEmail("testsupervisor@test.com"))
        .thenReturn(Optional.of(supervisor));

    Reviewable reviewableEntity = mock(Reviewable.class);
    reviewableEntity.setId(1L);
    Page<Reviewable> mockPageOfReviewables = new PageImpl<>(List.of(reviewableEntity), pageable, 1);
    when(reviewableRepository.findAll(any(Specification.class), eq(pageable)))
        .thenReturn(mockPageOfReviewables);

    ReviewableDTO reviewableDTO = new ReviewableDTO();
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

  @Test
  public void givenExistentReviewable_whenFindForHistory_thenReturnListOfActivityDTOs() {
    // Arrange
    Long reviewableId = 1L;

    Reviewable reviewable = mock(Reviewable.class);
    when(reviewableRepository.findById(reviewableId)).thenReturn(Optional.of(reviewable));

    Set<Activity> mockHistory = Set.of(new Activity(), new Activity());
    when(reviewable.getHistory()).thenReturn(mockHistory);

    List<ActivityDTO> mockActivityDTOs = List.of(new ActivityDTO(), new ActivityDTO());
    when(activityMapper.toDTOs(mockHistory)).thenReturn(mockActivityDTOs);

    // Act
    List<ActivityDTO> result = reviewableService.getReviewableHistory(reviewableId);

    // Assert
    assertThat(result).isNotNull();
    assertThat(result).hasSize(2);

    verify(reviewableRepository, times(1)).findById(reviewableId);
    verify(activityMapper, times(1)).toDTOs(mockHistory);
  }

  @Test
  public void givenNonExistentReviewable_whenFindForHistory_thenThrowException() {
    // Arrange
    Long reviewableId = 1L;
    when(reviewableRepository.findById(reviewableId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(
        ResourceNotFoundException.class,
        () -> {
          reviewableService.getReviewableHistory(reviewableId);
        });

    verify(reviewableRepository, times(1)).findById(reviewableId);
    verify(activityMapper, times(0)).toDTOs(any());
  }
}

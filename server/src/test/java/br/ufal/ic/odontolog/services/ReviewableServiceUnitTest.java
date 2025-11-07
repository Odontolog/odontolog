package br.ufal.ic.odontolog.services;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import br.ufal.ic.odontolog.dtos.ActivityDTO;
import br.ufal.ic.odontolog.dtos.ReviewDTO;
import br.ufal.ic.odontolog.dtos.ReviewableAssignUserRequestDTO;
import br.ufal.ic.odontolog.dtos.ReviewableCurrentSupervisorFilterDTO;
import br.ufal.ic.odontolog.dtos.ReviewableDTO;
import br.ufal.ic.odontolog.dtos.ReviewableShortDTO;
import br.ufal.ic.odontolog.dtos.ReviewableSubmitSupervisorReviewDTO;
import br.ufal.ic.odontolog.enums.ActivityType;
import br.ufal.ic.odontolog.enums.ReviewStatus;
import br.ufal.ic.odontolog.exceptions.ResourceNotFoundException;
import br.ufal.ic.odontolog.exceptions.UnprocessableRequestException;
import br.ufal.ic.odontolog.mappers.ActivityMapper;
import br.ufal.ic.odontolog.mappers.ReviewMapper;
import br.ufal.ic.odontolog.mappers.ReviewableMapper;
import br.ufal.ic.odontolog.models.Activity;
import br.ufal.ic.odontolog.models.Review;
import br.ufal.ic.odontolog.models.Reviewable;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.models.User;
import br.ufal.ic.odontolog.repositories.ReviewableRepository;
import br.ufal.ic.odontolog.repositories.SupervisorRepository;
import br.ufal.ic.odontolog.repositories.UserRepository;
import br.ufal.ic.odontolog.utils.CurrentUserProvider;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
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

  @Mock private UserRepository userRepository;

  @Mock private ReviewableMapper reviewableMapper;

  @Mock private ActivityMapper activityMapper;

  @Mock private ReviewMapper reviewMapper;

  @Mock private CurrentUserProvider currentUserProvider;

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

    ReviewableShortDTO reviewableShortDTO = new ReviewableShortDTO();
    when(reviewableMapper.toShortDTO(reviewableEntity)).thenReturn(reviewableShortDTO);

    ReviewableCurrentSupervisorFilterDTO filter = new ReviewableCurrentSupervisorFilterDTO();

    // Act

    Page<ReviewableShortDTO> result =
        reviewableService.findForCurrentSupervisor(pageable, mockUserDetails, filter);

    // Assert

    assertThat(result).isNotNull();
    assertThat(result.getTotalElements()).isEqualTo(1);
    assertThat(result.getContent()).hasSize(1);

    verify(supervisorRepository, times(1)).findByEmail("testsupervisor@test.com");
    verify(reviewableRepository, times(1)).findAll(any(Specification.class), eq(pageable));
    verify(reviewableMapper, times(1)).toShortDTO(reviewableEntity);
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

  @Test
  public void givenValidRequest_whenAssignUserToReviewable_thenReturnUpdatedReviewableDTO() {
    // Arrange
    Long reviewableId = 1L;
    UUID assigneeId = UUID.randomUUID();
    UUID currentUserId = UUID.randomUUID();

    ReviewableAssignUserRequestDTO requestDTO = new ReviewableAssignUserRequestDTO();
    requestDTO.setUserId(assigneeId);

    Reviewable reviewable = mock(Reviewable.class);
    when(reviewableRepository.findById(reviewableId)).thenReturn(Optional.of(reviewable));
    when(reviewable.getHistory()).thenReturn(new HashSet<>());

    User assignee = new User();
    assignee.setId(assigneeId);
    assignee.setName("Assignee User");
    when(userRepository.findById(assigneeId)).thenReturn(Optional.of(assignee));

    User currentUser = new User();
    currentUser.setId(currentUserId);
    currentUser.setName("Current User");
    when(currentUserProvider.getCurrentUser()).thenReturn(currentUser);

    ReviewableDTO reviewableDTO = new ReviewableDTO();
    when(reviewableMapper.toDTO(reviewable)).thenReturn(reviewableDTO);

    // Act
    ReviewableDTO result = reviewableService.assignUserToReviewable(requestDTO, reviewableId);

    // Assert
    ArgumentCaptor<Reviewable> reviewableCaptor = ArgumentCaptor.forClass(Reviewable.class);
    verify(reviewableRepository).save(reviewableCaptor.capture());

    Reviewable savedReviewable = reviewableCaptor.getValue();
    assertThat(result).isNotNull();
    assertThat(result).isEqualTo(reviewableDTO);

    assertThat(savedReviewable.getHistory()).isNotEmpty();

    Activity activity = savedReviewable.getHistory().iterator().next();
    assertThat(activity.getActor()).isEqualTo(currentUser);
    assertThat(activity.getType()).isEqualTo(ActivityType.EDITED);

    String expectedDescription =
        String.format(
            "%s atribuído a %s #%s por %s (%s)",
            assignee.getName(),
            reviewable.getName(),
            reviewable.getId(),
            currentUser.getName(),
            currentUser.getEmail());
    assertThat(activity.getDescription()).isEqualTo(expectedDescription);

    verify(reviewableRepository, times(1)).findById(reviewableId);
    verify(userRepository, times(1)).findById(assigneeId);
    verify(reviewable, times(1)).assignUser(assignee);
    verify(reviewableRepository, times(1)).save(reviewable);
  }

  @Test
  public void givenNonExistentReviewable_whenAssignUserToReviewable_thenThrowException() {
    // Arrange
    Long reviewableId = 1L;
    UUID assigneeId = UUID.randomUUID();

    ReviewableAssignUserRequestDTO requestDTO = new ReviewableAssignUserRequestDTO();
    requestDTO.setUserId(assigneeId);

    when(userRepository.findById(assigneeId)).thenReturn(Optional.of(new User()));
    when(reviewableRepository.findById(reviewableId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(
        ResourceNotFoundException.class,
        () -> {
          reviewableService.assignUserToReviewable(requestDTO, reviewableId);
        });

    verify(reviewableRepository, times(1)).findById(reviewableId);
    verify(reviewableRepository, times(0)).save(any());
  }

  @Test
  public void givenNonExistentUser_whenAssignUserToReviewable_thenThrowException() {
    // Arrange
    Long reviewableId = 1L;
    UUID assigneeId = UUID.randomUUID();

    ReviewableAssignUserRequestDTO requestDTO = new ReviewableAssignUserRequestDTO();
    requestDTO.setUserId(assigneeId);

    Reviewable reviewable = mock(Reviewable.class);

    when(userRepository.findById(assigneeId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(
        UnprocessableRequestException.class,
        () -> {
          reviewableService.assignUserToReviewable(requestDTO, reviewableId);
        });

    verify(userRepository, times(1)).findById(assigneeId);
    verify(reviewableRepository, times(0)).save(any());
  }

  @Test
  public void givenValidRequest_whenSubmitSupervisorReview_thenReturnUpdatedReview() {
    // Arrange
    Long reviewableId = 1L;
    UUID currentUserId = UUID.randomUUID();

    ReviewableSubmitSupervisorReviewDTO requestDTO = new ReviewableSubmitSupervisorReviewDTO();
    requestDTO.setComments("Good job");
    requestDTO.setGrade(BigDecimal.valueOf(9.0));
    requestDTO.setApproved(true);

    UserDetails mockUserDetails = mock(UserDetails.class);
    when(mockUserDetails.getUsername()).thenReturn("testsupervisor@test.com");

    Supervisor supervisor = new Supervisor();
    supervisor.setEmail("testsupervisor@test.com");
    supervisor.setId(UUID.randomUUID());
    when(supervisorRepository.findByEmail("testsupervisor@test.com"))
        .thenReturn(Optional.of(supervisor));

    Review review = new Review();
    review.setReviewStatus(ReviewStatus.PENDING);
    review.setSupervisor(supervisor);

    Reviewable reviewable = mock(Reviewable.class);
    when(reviewableRepository.findById(reviewableId)).thenReturn(Optional.of(reviewable));
    when(reviewable.getReviewers()).thenReturn(Collections.singleton(supervisor));
    when(reviewable.getHistory()).thenReturn(new HashSet<>());
    when(reviewable.getReviewFor(supervisor)).thenReturn(Optional.of(review));

    ReviewDTO reviewDTO = new ReviewDTO();
    when(reviewMapper.toDTO(review)).thenReturn(reviewDTO);

    // Act
    ReviewDTO result =
        reviewableService.submitSupervisorReview(reviewableId, requestDTO, mockUserDetails);

    // Assert
    ArgumentCaptor<Reviewable> reviewableCaptor = ArgumentCaptor.forClass(Reviewable.class);
    verify(reviewableRepository).save(reviewableCaptor.capture());

    Reviewable savedReviewable = reviewableCaptor.getValue();
    assertThat(result).isNotNull();
    assertThat(result).isEqualTo(reviewDTO);

    assertThat(savedReviewable.getHistory()).isNotEmpty();

    Activity activity = savedReviewable.getHistory().iterator().next();
    assertThat(activity.getActor()).isEqualTo(supervisor);
    assertThat(activity.getType()).isEqualTo(ActivityType.REVIEW_APPROVED);

    String expectedDescription =
        String.format(
            "Avaliação submetida para %s #%s por %s (%s)",
            reviewable.getName(), reviewable.getId(), supervisor.getName(), supervisor.getEmail());
    assertThat(activity.getDescription()).isEqualTo(expectedDescription);

    verify(reviewableRepository, times(1)).findById(reviewableId);
    verify(reviewable, times(1))
        .submitSupervisorReview(supervisor, "Good job", BigDecimal.valueOf(9.0), true);
    verify(reviewableRepository, times(1)).save(reviewable);
  }
}

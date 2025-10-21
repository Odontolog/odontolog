package br.ufal.ic.odontolog.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.ufal.ic.odontolog.dtos.ReviewableDTO;
import br.ufal.ic.odontolog.dtos.SubmitForReviewDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanShortDTO;
import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import br.ufal.ic.odontolog.exceptions.ResourceNotFoundException;
import br.ufal.ic.odontolog.exceptions.ReviewSubmissionException;
import br.ufal.ic.odontolog.mappers.ReviewableMapper;
import br.ufal.ic.odontolog.mappers.TreatmentPlanMapper;
import br.ufal.ic.odontolog.models.Activity;
import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.Review;
import br.ufal.ic.odontolog.models.Reviewable;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import br.ufal.ic.odontolog.models.User;
import br.ufal.ic.odontolog.repositories.PatientRepository;
import br.ufal.ic.odontolog.repositories.ReviewableRepository;
import br.ufal.ic.odontolog.repositories.TreatmentPlanRepository;
import br.ufal.ic.odontolog.repositories.UserRepository;
import br.ufal.ic.odontolog.utils.CurrentUserProvider;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class TreatmentPlanServiceUnitTest {
  @Mock private TreatmentPlanRepository treatmentPlanRepository;
  @Mock private ReviewableRepository reviewableRepository;
  @Mock private UserRepository userRepository;
  @Mock private TreatmentPlanMapper treatmentPlanMapper;
  @Mock private ReviewableMapper reviewableMapper;
  @Mock private CurrentUserProvider currentUserProvider;
  @Mock private PatientRepository patientRepository;

  @InjectMocks private TreatmentPlanService treatmentPlanService;
  @InjectMocks private ReviewableService reviewableService;

  @Test
  public void givenValidPatientId_whenGetTreatmentPlansByPatientId_thenReturnsShortDTOList() {
    // Arrange
    Long patientId = 1L;
    Patient patient = new Patient();
    patient.setId(patientId);
    TreatmentPlan plan = new TreatmentPlan();
    plan.setId(10L);
    List<TreatmentPlan> plans = Collections.singletonList(plan);
    TreatmentPlanShortDTO shortDTO = new TreatmentPlanShortDTO();
    shortDTO.setId(plan.getId());
    List<TreatmentPlanShortDTO> shortDTOs = Collections.singletonList(shortDTO);

    when(patientRepository.findById(patientId)).thenReturn(Optional.of(patient));
    when(treatmentPlanRepository.findByPatient(patient)).thenReturn(plans);
    when(treatmentPlanMapper.toShortDTOs(plans)).thenReturn(shortDTOs);

    // Act
    List<TreatmentPlanShortDTO> result =
        treatmentPlanService.getTreatmentPlansByPatientId(patientId);

    // Assert
    assertThat(result).isEqualTo(shortDTOs);
    verify(patientRepository).findById(patientId);
    verify(treatmentPlanRepository).findByPatient(patient);
    verify(treatmentPlanMapper).toShortDTOs(plans);
  }

  @Test
  public void
      givenInvalidPatientId_whenGetTreatmentPlansByPatientId_thenThrowsResourceNotFoundException() {
    // Arrange
    Long patientId = 99L;
    when(patientRepository.findById(patientId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(
        ResourceNotFoundException.class,
        () -> {
          treatmentPlanService.getTreatmentPlansByPatientId(patientId);
        });
    verify(treatmentPlanRepository, never()).findByPatient(any());
    verify(treatmentPlanMapper, never()).toShortDTOs(any());
  }

  @Test
  public void givenDraftPlanWithoutAdditionalComments_whenSubmitForReview_thenPlanIsSubmitted() {
    // Arrange
    Supervisor supervisor = new Supervisor();
    supervisor.setId(UUID.randomUUID());

    Long treatmentId = 1L;
    TreatmentPlan treatmentPlan = new TreatmentPlan();
    treatmentPlan.setId(treatmentId);
    treatmentPlan.setStatus(TreatmentPlanStatus.DRAFT);
    treatmentPlan.addReviewer(supervisor);
    treatmentPlan.setAssignee(new User());

    when(reviewableRepository.findById(treatmentId)).thenReturn(Optional.of(treatmentPlan));

    ReviewableDTO expectedDto = new ReviewableDTO();
    expectedDto.setId(treatmentId);

    when(reviewableMapper.toDTO(treatmentPlan)).thenReturn(expectedDto);

    User currentUser = new User();
    currentUser.setId(UUID.randomUUID());
    when(currentUserProvider.getCurrentUser()).thenReturn(currentUser);

    SubmitForReviewDTO submitForReviewDTO = new SubmitForReviewDTO();

    // Act
    ReviewableDTO result = reviewableService.submitForReview(treatmentId, submitForReviewDTO);

    // Assert
    assertThat(result).isEqualTo(expectedDto);

    ArgumentCaptor<Reviewable> reviewableCaptor = ArgumentCaptor.forClass(Reviewable.class);
    verify(reviewableRepository).save(reviewableCaptor.capture());

    Reviewable savedReviewable = reviewableCaptor.getValue();
    assertThat(savedReviewable.isInReview()).isTrue();
    assertThat(savedReviewable.getHistory()).isNotEmpty();

    Activity lastActivity = savedReviewable.getHistory().iterator().next();
    assertThat(lastActivity.getType())
        .isEqualTo(br.ufal.ic.odontolog.enums.ActivityType.REVIEW_REQUESTED);
    assertThat(lastActivity.getDescription())
        .contains(
            "%s (%s) enviou %s #%s para validação"
                .formatted(
                    currentUser.getName(),
                    currentUser.getEmail(),
                    savedReviewable.getName(),
                    savedReviewable.getId(),
                    treatmentId));
    assertThat(lastActivity.getMetadata()).isNull();

    assertThat(savedReviewable.getReviews()).isNotEmpty();

    Review firstReview = savedReviewable.getReviews().iterator().next();
    assertThat(firstReview.getSupervisor()).isEqualTo(supervisor);

    verify(reviewableRepository).findById(treatmentId);
    verify(reviewableMapper).toDTO(treatmentPlan);
    verify(reviewableRepository).save(treatmentPlan);
  }

  @Test
  public void givenDraftPlanWithAdditionalComments_whenSubmitForReview_thenPlanIsSubmitted() {
    // Arrange
    Supervisor supervisor = new Supervisor();
    supervisor.setId(UUID.randomUUID());

    Long treatmentId = 1L;
    TreatmentPlan treatmentPlan = new TreatmentPlan();
    treatmentPlan.setId(treatmentId);
    treatmentPlan.setStatus(TreatmentPlanStatus.DRAFT);
    treatmentPlan.addReviewer(supervisor);
    treatmentPlan.setAssignee(new User());
    when(reviewableRepository.findById(treatmentId)).thenReturn(Optional.of(treatmentPlan));

    ReviewableDTO expectedDto = new ReviewableDTO();
    expectedDto.setId(treatmentId);
    when(reviewableMapper.toDTO(treatmentPlan)).thenReturn(expectedDto);

    User currentUser = new User();
    currentUser.setId(UUID.randomUUID());
    when(currentUserProvider.getCurrentUser()).thenReturn(currentUser);

    String additionalComments = "Please review this plan carefully.";
    SubmitForReviewDTO submitForReviewDTO = new SubmitForReviewDTO();
    submitForReviewDTO.setComments(additionalComments);

    // Act
    ReviewableDTO result = reviewableService.submitForReview(treatmentId, submitForReviewDTO);

    // Assert
    assertThat(result).isEqualTo(expectedDto);

    ArgumentCaptor<Reviewable> reviewableCaptor = ArgumentCaptor.forClass(Reviewable.class);
    verify(reviewableRepository).save(reviewableCaptor.capture());

    Reviewable savedReviewable = reviewableCaptor.getValue();
    assertThat(savedReviewable.isInReview()).isTrue();
    assertThat(savedReviewable.getHistory()).isNotEmpty();

    Activity lastActivity = savedReviewable.getHistory().iterator().next();
    assertThat(lastActivity.getType())
        .isEqualTo(br.ufal.ic.odontolog.enums.ActivityType.REVIEW_REQUESTED);
    assertThat(lastActivity.getDescription())
        .contains(
            "%s (%s) enviou %s #%s para validação"
                .formatted(
                    currentUser.getName(),
                    currentUser.getEmail(),
                    savedReviewable.getName(),
                    savedReviewable.getId(),
                    treatmentId));
    assertThat(lastActivity.getMetadata()).isNotNull();
    assertThat(lastActivity.getMetadata()).containsKeys("data");

    assertThat(savedReviewable.getReviews()).isNotEmpty();

    Review firstReview = savedReviewable.getReviews().iterator().next();
    assertThat(firstReview.getSupervisor()).isEqualTo(supervisor);

    verify(reviewableRepository).findById(treatmentId);
    verify(reviewableMapper).toDTO(treatmentPlan);
    verify(reviewableRepository).save(treatmentPlan);
  }

  @Test
  public void givenNonExistentTreatmentPlan_whenSubmitForReview_thenThrowException() {
    // Arrange
    Long treatmentId = 1L;

    when(reviewableRepository.findById(treatmentId)).thenReturn(Optional.empty());

    SubmitForReviewDTO submitForReviewDTO = new SubmitForReviewDTO();

    // Act and Assert
    assertThrows(
        ResourceNotFoundException.class,
        () -> reviewableService.submitForReview(treatmentId, submitForReviewDTO));

    verify(reviewableRepository).findById(treatmentId);
    verify(reviewableMapper, never()).toDTO(any());
    verify(reviewableRepository, never()).save(any());
  }

  @Test
  public void givenInProgressPlan_whenSubmitForReview_thenThrowException() {
    // Arrange
    Long treatmentId = 1L;
    TreatmentPlan treatmentPlan = new TreatmentPlan();
    treatmentPlan.setId(treatmentId);
    treatmentPlan.setStatus(TreatmentPlanStatus.IN_PROGRESS);

    when(reviewableRepository.findById(treatmentId)).thenReturn(Optional.of(treatmentPlan));

    SubmitForReviewDTO submitForReviewDTO = new SubmitForReviewDTO();

    // Act and Assert
    assertThrows(
        UnsupportedOperationException.class,
        () -> reviewableService.submitForReview(treatmentId, submitForReviewDTO));

    verify(reviewableRepository).findById(treatmentId);
    verify(reviewableMapper, never()).toDTO(any());
    verify(reviewableRepository, never()).save(any());
  }

  @Test
  public void givenDonePlan_whenSubmitForReview_thenThrowException() {
    // Arrange
    Long treatmentId = 1L;
    TreatmentPlan treatmentPlan = new TreatmentPlan();
    treatmentPlan.setId(treatmentId);
    treatmentPlan.setStatus(TreatmentPlanStatus.DONE);

    when(reviewableRepository.findById(treatmentId)).thenReturn(Optional.of(treatmentPlan));

    SubmitForReviewDTO submitForReviewDTO = new SubmitForReviewDTO();

    // Act and Assert
    assertThrows(
        UnsupportedOperationException.class,
        () -> reviewableService.submitForReview(treatmentId, submitForReviewDTO));

    verify(reviewableRepository).findById(treatmentId);
    verify(reviewableMapper, never()).toDTO(any());
    verify(reviewableRepository, never()).save(any());
  }

  @Test
  public void givenInReviewPlan_whenSubmitForReview_thenThrowException() {
    // Arrange
    Long treatmentId = 1L;
    TreatmentPlan treatmentPlan = new TreatmentPlan();
    treatmentPlan.setId(treatmentId);
    treatmentPlan.setStatus(TreatmentPlanStatus.IN_REVIEW);

    when(reviewableRepository.findById(treatmentId)).thenReturn(Optional.of(treatmentPlan));

    SubmitForReviewDTO submitForReviewDTO = new SubmitForReviewDTO();

    // Act and Assert
    assertThrows(
        UnsupportedOperationException.class,
        () -> reviewableService.submitForReview(treatmentId, submitForReviewDTO));

    verify(reviewableRepository).findById(treatmentId);
    verify(reviewableMapper, never()).toDTO(any());
    verify(reviewableRepository, never()).save(any());
  }

  @Test
  public void givenDraftPlanWithoutReviewers_whenSubmitForReview_thenThrowException() {
    // Arrange
    Long treatmentId = 1L;
    TreatmentPlan treatmentPlan = new TreatmentPlan();
    treatmentPlan.setId(treatmentId);
    treatmentPlan.setStatus(TreatmentPlanStatus.DRAFT);
    treatmentPlan.setAssignee(new User());

    when(reviewableRepository.findById(treatmentId)).thenReturn(Optional.of(treatmentPlan));

    SubmitForReviewDTO submitForReviewDTO = new SubmitForReviewDTO();

    // Act and Assert
    assertThrows(
        ReviewSubmissionException.class,
        () -> reviewableService.submitForReview(treatmentId, submitForReviewDTO));

    verify(reviewableRepository).findById(treatmentId);
    verify(reviewableMapper, never()).toDTO(any());
    verify(reviewableRepository, never()).save(any());
  }

  @Test
  public void givenDraftPlanWithoutAssignee_whenSubmitForReview_thenThrowException() {
    // Arrange
    Long treatmentId = 1L;
    TreatmentPlan treatmentPlan = new TreatmentPlan();
    treatmentPlan.setId(treatmentId);
    treatmentPlan.setStatus(TreatmentPlanStatus.DRAFT);

    Supervisor supervisor = new Supervisor();
    supervisor.setId(UUID.randomUUID());
    treatmentPlan.addReviewer(supervisor);

    when(reviewableRepository.findById(treatmentId)).thenReturn(Optional.of(treatmentPlan));

    SubmitForReviewDTO submitForReviewDTO = new SubmitForReviewDTO();

    // Act and Assert
    assertThrows(
        ReviewSubmissionException.class,
        () -> reviewableService.submitForReview(treatmentId, submitForReviewDTO));

    verify(reviewableRepository).findById(treatmentId);
    verify(reviewableMapper, never()).toDTO(any());
    verify(reviewableRepository, never()).save(any());
  }
}

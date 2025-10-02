package br.ufal.ic.odontolog.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.ufal.ic.odontolog.dtos.TreatmentPlanAssignUserRequestDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanShortDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanSubmitForReviewDTO;
import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import br.ufal.ic.odontolog.exceptions.ResourceNotFoundException;
import br.ufal.ic.odontolog.exceptions.ReviewSubmissionException;
import br.ufal.ic.odontolog.exceptions.UnprocessableRequestException;
import br.ufal.ic.odontolog.mappers.TreatmentPlanMapper;
import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.Review;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import br.ufal.ic.odontolog.models.User;
import br.ufal.ic.odontolog.repositories.PatientRepository;
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
  @Mock private UserRepository userRepository;
  @Mock private TreatmentPlanMapper treatmentPlanMapper;
  @Mock private CurrentUserProvider currentUserProvider;
  @Mock private PatientRepository patientRepository;

  @InjectMocks private TreatmentPlanService treatmentPlanService;

  @Test
  public void givenDraftPlan_whenAssignUser_thenUserIsAssignedAndPlanIsSaved() {
    // Arrange
    TreatmentPlanAssignUserRequestDTO requestDTO = new TreatmentPlanAssignUserRequestDTO();
    requestDTO.setUserId(UUID.randomUUID());

    Long treatmentId = 1L;

    TreatmentPlan treatmentPlan = new TreatmentPlan();
    treatmentPlan.setId(treatmentId);
    treatmentPlan.setStatus(TreatmentPlanStatus.DRAFT);

    when(treatmentPlanRepository.findById(treatmentId)).thenReturn(Optional.of(treatmentPlan));

    User user = new User();
    user.setId(requestDTO.getUserId());

    when(userRepository.findById(requestDTO.getUserId())).thenReturn(Optional.of(user));

    TreatmentPlanDTO expectedDto = new TreatmentPlanDTO();
    expectedDto.setId(treatmentId);
    expectedDto.setAssignee(user);
    expectedDto.setStatus(TreatmentPlanStatus.DRAFT);

    when(treatmentPlanMapper.toDTO(treatmentPlan)).thenReturn(expectedDto);

    User currentUser = new User();
    currentUser.setId(UUID.randomUUID());
    when(currentUserProvider.getCurrentUser()).thenReturn(currentUser);

    // Act

    TreatmentPlanDTO result =
        treatmentPlanService.assignUserToTreatmentPlan(requestDTO, treatmentId);

    // Assert

    ArgumentCaptor<TreatmentPlan> treatmentPlanCaptor =
        ArgumentCaptor.forClass(TreatmentPlan.class);
    verify(treatmentPlanRepository).save(treatmentPlanCaptor.capture());

    TreatmentPlan savedPlan = treatmentPlanCaptor.getValue();
    assertThat(savedPlan.getAssignee()).isEqualTo(user);
    assertThat(savedPlan.getHistory()).isNotEmpty();

    assertThat(result).isEqualTo(expectedDto);

    verify(treatmentPlanRepository).findById(treatmentId);
    verify(userRepository).findById(requestDTO.getUserId());
    verify(treatmentPlanMapper).toDTO(savedPlan);
  }

  @Test
  public void givenInProgressPlan_whenAssignUser_thenUserIsNotAssignedAndPlanIsNotSaved() {
    // Arrange
    TreatmentPlanAssignUserRequestDTO requestDTO = new TreatmentPlanAssignUserRequestDTO();
    requestDTO.setUserId(UUID.randomUUID());
    Long treatmentId = 1L;
    TreatmentPlan treatmentPlan = new TreatmentPlan();
    treatmentPlan.setId(treatmentId);
    treatmentPlan.setStatus(TreatmentPlanStatus.IN_PROGRESS);

    when(treatmentPlanRepository.findById(treatmentId)).thenReturn(Optional.of(treatmentPlan));

    User user = new User();
    user.setId(requestDTO.getUserId());

    when(userRepository.findById(requestDTO.getUserId())).thenReturn(Optional.of(user));

    // Act and Assert
    assertThrows(
        UnsupportedOperationException.class,
        () -> treatmentPlanService.assignUserToTreatmentPlan(requestDTO, treatmentId));

    verify(treatmentPlanRepository).findById(treatmentId);
    verify(userRepository).findById(requestDTO.getUserId());
    verify(treatmentPlanMapper, never()).toDTO(any());
    verify(treatmentPlanRepository, never()).save(any());
  }

  @Test
  public void givenInReviewPlan_whenAssignUser_thenUserIsNotAssignedAndPlanIsNotSaved() {
    // Arrange
    TreatmentPlanAssignUserRequestDTO requestDTO = new TreatmentPlanAssignUserRequestDTO();
    requestDTO.setUserId(UUID.randomUUID());
    Long treatmentId = 1L;
    TreatmentPlan treatmentPlan = new TreatmentPlan();
    treatmentPlan.setId(treatmentId);
    treatmentPlan.setStatus(TreatmentPlanStatus.IN_REVIEW);

    when(treatmentPlanRepository.findById(treatmentId)).thenReturn(Optional.of(treatmentPlan));

    User user = new User();
    user.setId(requestDTO.getUserId());

    when(userRepository.findById(requestDTO.getUserId())).thenReturn(Optional.of(user));

    // Act and Assert
    assertThrows(
        UnsupportedOperationException.class,
        () -> treatmentPlanService.assignUserToTreatmentPlan(requestDTO, treatmentId));

    verify(treatmentPlanRepository).findById(treatmentId);
    verify(userRepository).findById(requestDTO.getUserId());
    verify(treatmentPlanMapper, never()).toDTO(any());
    verify(treatmentPlanRepository, never()).save(any());
  }

  @Test
  public void givenDonePlan_whenAssignUser_thenUserIsNotAssignedAndPlanIsNotSaved() {
    // Arrange
    TreatmentPlanAssignUserRequestDTO requestDTO = new TreatmentPlanAssignUserRequestDTO();
    requestDTO.setUserId(UUID.randomUUID());
    Long treatmentId = 1L;
    TreatmentPlan treatmentPlan = new TreatmentPlan();
    treatmentPlan.setId(treatmentId);
    treatmentPlan.setStatus(TreatmentPlanStatus.DONE);

    when(treatmentPlanRepository.findById(treatmentId)).thenReturn(Optional.of(treatmentPlan));

    User user = new User();
    user.setId(requestDTO.getUserId());

    when(userRepository.findById(requestDTO.getUserId())).thenReturn(Optional.of(user));

    // Act and Assert
    assertThrows(
        UnsupportedOperationException.class,
        () -> treatmentPlanService.assignUserToTreatmentPlan(requestDTO, treatmentId));

    // Assert
    verify(treatmentPlanRepository).findById(treatmentId);
    verify(userRepository).findById(requestDTO.getUserId());
    verify(treatmentPlanMapper, never()).toDTO(any());
    verify(treatmentPlanRepository, never()).save(any());
  }

  @Test
  public void givenNonExistentTreatmentPlan_whenAssignUser_thenThrowException() {
    // Arrange
    TreatmentPlanAssignUserRequestDTO requestDTO = new TreatmentPlanAssignUserRequestDTO();
    requestDTO.setUserId(UUID.randomUUID());
    Long treatmentId = 1L;

    when(treatmentPlanRepository.findById(treatmentId)).thenReturn(Optional.empty());

    // Act and Assert
    assertThrows(
        ResourceNotFoundException.class,
        () -> treatmentPlanService.assignUserToTreatmentPlan(requestDTO, treatmentId));

    verify(treatmentPlanRepository).findById(treatmentId);
    verify(userRepository, never()).findById(any());
    verify(treatmentPlanMapper, never()).toDTO(any());
    verify(treatmentPlanRepository, never()).save(any());
  }

  @Test
  public void givenNonExistentUser_whenAssignUser_thenThrowException() {
    // Arrange
    TreatmentPlanAssignUserRequestDTO requestDTO = new TreatmentPlanAssignUserRequestDTO();
    requestDTO.setUserId(UUID.randomUUID());
    Long treatmentId = 1L;
    TreatmentPlan treatmentPlan = new TreatmentPlan();
    treatmentPlan.setId(treatmentId);
    treatmentPlan.setStatus(TreatmentPlanStatus.DRAFT);
    when(treatmentPlanRepository.findById(treatmentId)).thenReturn(Optional.of(treatmentPlan));
    when(userRepository.findById(requestDTO.getUserId())).thenReturn(Optional.empty());

    // Act and Assert
    assertThrows(
        UnprocessableRequestException.class,
        () -> treatmentPlanService.assignUserToTreatmentPlan(requestDTO, treatmentId));

    verify(treatmentPlanRepository).findById(treatmentId);
    verify(userRepository).findById(requestDTO.getUserId());
    verify(treatmentPlanMapper, never()).toDTO(any());
    verify(treatmentPlanRepository, never()).save(any());
  }

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
    treatmentPlan.getReviewers().add(supervisor);
    treatmentPlan.setAssignee(new User());

    when(treatmentPlanRepository.findById(treatmentId)).thenReturn(Optional.of(treatmentPlan));

    TreatmentPlanDTO expectedDto = new TreatmentPlanDTO();
    expectedDto.setId(treatmentId);
    expectedDto.setStatus(TreatmentPlanStatus.IN_REVIEW);

    when(treatmentPlanMapper.toDTO(treatmentPlan)).thenReturn(expectedDto);

    User currentUser = new User();
    currentUser.setId(UUID.randomUUID());
    when(currentUserProvider.getCurrentUser()).thenReturn(currentUser);

    TreatmentPlanSubmitForReviewDTO treatmentPlanSubmitForReviewDTO =
        new TreatmentPlanSubmitForReviewDTO();

    // Act
    TreatmentPlanDTO result =
        treatmentPlanService.submitTreatmentPlanForReview(
            treatmentId, treatmentPlanSubmitForReviewDTO);

    // Assert
    assertThat(result).isEqualTo(expectedDto);

    ArgumentCaptor<TreatmentPlan> treatmentPlanCaptor =
        ArgumentCaptor.forClass(TreatmentPlan.class);
    verify(treatmentPlanRepository).save(treatmentPlanCaptor.capture());

    TreatmentPlan savedPlan = treatmentPlanCaptor.getValue();
    assertThat(savedPlan.getStatus()).isEqualTo(TreatmentPlanStatus.IN_REVIEW);
    assertThat(savedPlan.getHistory()).isNotEmpty();
    assertThat(savedPlan.getHistory().iterator().next().getDescription())
        .contains(
            "User %s (%s) submitted Treatment Plan (%s) for review%s"
                .formatted(
                    currentUser.getName(),
                    currentUser.getId(),
                    treatmentId,
                    " without additional comments"));

    assertThat(savedPlan.getReviews()).isNotEmpty();

    Review firstReview = savedPlan.getReviews().iterator().next();
    assertThat(firstReview.getSupervisor()).isEqualTo(supervisor);

    verify(treatmentPlanRepository).findById(treatmentId);
    verify(treatmentPlanMapper).toDTO(treatmentPlan);
    verify(treatmentPlanRepository).save(treatmentPlan);
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
    treatmentPlan.getReviewers().add(supervisor);
    treatmentPlan.setAssignee(new User());

    when(treatmentPlanRepository.findById(treatmentId)).thenReturn(Optional.of(treatmentPlan));

    TreatmentPlanDTO expectedDto = new TreatmentPlanDTO();
    expectedDto.setId(treatmentId);
    expectedDto.setStatus(TreatmentPlanStatus.IN_REVIEW);

    when(treatmentPlanMapper.toDTO(treatmentPlan)).thenReturn(expectedDto);

    User currentUser = new User();
    currentUser.setId(UUID.randomUUID());
    when(currentUserProvider.getCurrentUser()).thenReturn(currentUser);

    String additionalComments = "Please review this plan carefully.";
    TreatmentPlanSubmitForReviewDTO treatmentPlanSubmitForReviewDTO =
        new TreatmentPlanSubmitForReviewDTO();
    treatmentPlanSubmitForReviewDTO.setComments(additionalComments);

    // Act
    TreatmentPlanDTO result =
        treatmentPlanService.submitTreatmentPlanForReview(
            treatmentId, treatmentPlanSubmitForReviewDTO);

    // Assert
    assertThat(result).isEqualTo(expectedDto);

    ArgumentCaptor<TreatmentPlan> treatmentPlanCaptor =
        ArgumentCaptor.forClass(TreatmentPlan.class);
    verify(treatmentPlanRepository).save(treatmentPlanCaptor.capture());

    TreatmentPlan savedPlan = treatmentPlanCaptor.getValue();
    assertThat(savedPlan.getStatus()).isEqualTo(TreatmentPlanStatus.IN_REVIEW);
    assertThat(savedPlan.getHistory()).isNotEmpty();
    assertThat(savedPlan.getHistory().iterator().next().getDescription())
        .contains(
            "User %s (%s) submitted Treatment Plan (%s) for review%s"
                .formatted(
                    currentUser.getName(),
                    currentUser.getId(),
                    treatmentId,
                    ", with additional comments: " + additionalComments));

    assertThat(savedPlan.getReviews()).isNotEmpty();

    Review firstReview = savedPlan.getReviews().iterator().next();
    assertThat(firstReview.getSupervisor()).isEqualTo(supervisor);

    verify(treatmentPlanRepository).findById(treatmentId);
    verify(treatmentPlanMapper).toDTO(treatmentPlan);
    verify(treatmentPlanRepository).save(treatmentPlan);
  }

  @Test
  public void givenNonExistentTreatmentPlan_whenSubmitForReview_thenThrowException() {
    // Arrange
    Long treatmentId = 1L;

    when(treatmentPlanRepository.findById(treatmentId)).thenReturn(Optional.empty());
    TreatmentPlanSubmitForReviewDTO requestDTO = new TreatmentPlanSubmitForReviewDTO();

    // Act and Assert
    assertThrows(
        ResourceNotFoundException.class,
        () -> treatmentPlanService.submitTreatmentPlanForReview(treatmentId, requestDTO));

    verify(treatmentPlanRepository).findById(treatmentId);
    verify(treatmentPlanMapper, never()).toDTO(any());
    verify(treatmentPlanRepository, never()).save(any());
  }

  @Test
  public void givenInProgressPlan_whenSubmitForReview_thenThrowException() {
    // Arrange
    Long treatmentId = 1L;
    TreatmentPlan treatmentPlan = new TreatmentPlan();
    treatmentPlan.setId(treatmentId);
    treatmentPlan.setStatus(TreatmentPlanStatus.IN_PROGRESS);

    when(treatmentPlanRepository.findById(treatmentId)).thenReturn(Optional.of(treatmentPlan));

    TreatmentPlanSubmitForReviewDTO requestDTO = new TreatmentPlanSubmitForReviewDTO();

    // Act and Assert
    assertThrows(
        UnsupportedOperationException.class,
        () -> treatmentPlanService.submitTreatmentPlanForReview(treatmentId, requestDTO));

    verify(treatmentPlanRepository).findById(treatmentId);
    verify(treatmentPlanMapper, never()).toDTO(any());
    verify(treatmentPlanRepository, never()).save(any());
  }

  @Test
  public void givenDonePlan_whenSubmitForReview_thenThrowException() {
    // Arrange
    Long treatmentId = 1L;
    TreatmentPlan treatmentPlan = new TreatmentPlan();
    treatmentPlan.setId(treatmentId);
    treatmentPlan.setStatus(TreatmentPlanStatus.DONE);

    when(treatmentPlanRepository.findById(treatmentId)).thenReturn(Optional.of(treatmentPlan));

    TreatmentPlanSubmitForReviewDTO requestDTO = new TreatmentPlanSubmitForReviewDTO();

    // Act and Assert
    assertThrows(
        UnsupportedOperationException.class,
        () -> treatmentPlanService.submitTreatmentPlanForReview(treatmentId, requestDTO));

    verify(treatmentPlanRepository).findById(treatmentId);
    verify(treatmentPlanMapper, never()).toDTO(any());
    verify(treatmentPlanRepository, never()).save(any());
  }

  @Test
  public void givenInReviewPlan_whenSubmitForReview_thenThrowException() {
    // Arrange
    Long treatmentId = 1L;
    TreatmentPlan treatmentPlan = new TreatmentPlan();
    treatmentPlan.setId(treatmentId);
    treatmentPlan.setStatus(TreatmentPlanStatus.IN_REVIEW);

    when(treatmentPlanRepository.findById(treatmentId)).thenReturn(Optional.of(treatmentPlan));

    TreatmentPlanSubmitForReviewDTO requestDTO = new TreatmentPlanSubmitForReviewDTO();

    // Act and Assert
    assertThrows(
        UnsupportedOperationException.class,
        () -> treatmentPlanService.submitTreatmentPlanForReview(treatmentId, requestDTO));

    verify(treatmentPlanRepository).findById(treatmentId);
    verify(treatmentPlanMapper, never()).toDTO(any());
    verify(treatmentPlanRepository, never()).save(any());
  }

  @Test
  public void givenDraftPlanWithoutReviewers_whenSubmitForReview_thenThrowException() {
    // Arrange
    Long treatmentId = 1L;
    TreatmentPlan treatmentPlan = new TreatmentPlan();
    treatmentPlan.setId(treatmentId);
    treatmentPlan.setStatus(TreatmentPlanStatus.DRAFT);
    treatmentPlan.setAssignee(new User());

    when(treatmentPlanRepository.findById(treatmentId)).thenReturn(Optional.of(treatmentPlan));

    TreatmentPlanSubmitForReviewDTO requestDTO = new TreatmentPlanSubmitForReviewDTO();

    // Act and Assert
    assertThrows(
        ReviewSubmissionException.class,
        () -> treatmentPlanService.submitTreatmentPlanForReview(treatmentId, requestDTO));

    verify(treatmentPlanRepository).findById(treatmentId);
    verify(treatmentPlanMapper, never()).toDTO(any());
    verify(treatmentPlanRepository, never()).save(any());
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
    treatmentPlan.getReviewers().add(supervisor);

    when(treatmentPlanRepository.findById(treatmentId)).thenReturn(Optional.of(treatmentPlan));

    TreatmentPlanSubmitForReviewDTO requestDTO = new TreatmentPlanSubmitForReviewDTO();

    // Act and Assert
    assertThrows(
        ReviewSubmissionException.class,
        () -> treatmentPlanService.submitTreatmentPlanForReview(treatmentId, requestDTO));

    verify(treatmentPlanRepository).findById(treatmentId);
    verify(treatmentPlanMapper, never()).toDTO(any());
    verify(treatmentPlanRepository, never()).save(any());
  }
}

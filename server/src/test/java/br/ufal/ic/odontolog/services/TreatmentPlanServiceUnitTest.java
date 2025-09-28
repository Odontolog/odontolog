package br.ufal.ic.odontolog.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import br.ufal.ic.odontolog.dtos.TreatmentPlanAssignUserRequestDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanDTO;
import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import br.ufal.ic.odontolog.exceptions.ResourceNotFoundException;
import br.ufal.ic.odontolog.exceptions.UnprocessableRequestException;
import br.ufal.ic.odontolog.mappers.TreatmentPlanMapper;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import br.ufal.ic.odontolog.models.User;
import br.ufal.ic.odontolog.repositories.TreatmentPlanRepository;
import br.ufal.ic.odontolog.repositories.UserRepository;

@ExtendWith(MockitoExtension.class)
public class TreatmentPlanServiceUnitTest {
    @Mock
    private TreatmentPlanRepository treatmentPlanRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private TreatmentPlanMapper treatmentPlanMapper;

    @InjectMocks
    private TreatmentPlanService treatmentPlanService;

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

        // Act

        TreatmentPlanDTO result = treatmentPlanService.assignUserToTreatmentPlan(requestDTO, treatmentId);

        // Assert

        ArgumentCaptor<TreatmentPlan> treatmentPlanCaptor = ArgumentCaptor.forClass(TreatmentPlan.class);
        verify(treatmentPlanRepository).save(treatmentPlanCaptor.capture());

        TreatmentPlan savedPlan = treatmentPlanCaptor.getValue();
        assertThat(savedPlan.getAssignee()).isEqualTo(user);

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
        assertThrows(UnsupportedOperationException.class,
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
        assertThrows(UnsupportedOperationException.class,
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
        assertThrows(UnsupportedOperationException.class,
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
        assertThrows(ResourceNotFoundException.class,
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
        assertThrows(UnprocessableRequestException.class,
                () -> treatmentPlanService.assignUserToTreatmentPlan(requestDTO, treatmentId));

        verify(treatmentPlanRepository).findById(treatmentId);
        verify(userRepository).findById(requestDTO.getUserId());
        verify(treatmentPlanMapper, never()).toDTO(any());
        verify(treatmentPlanRepository, never()).save(any());
    }
}
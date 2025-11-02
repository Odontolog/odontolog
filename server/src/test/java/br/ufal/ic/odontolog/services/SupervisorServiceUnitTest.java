package br.ufal.ic.odontolog.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import br.ufal.ic.odontolog.dtos.SupervisorDTO;
import br.ufal.ic.odontolog.dtos.SupervisorUpsertDTO;
import br.ufal.ic.odontolog.enums.Role;
import br.ufal.ic.odontolog.mappers.SupervisorMapper;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.repositories.SupervisorRepository;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
public class SupervisorServiceUnitTest {

  @Mock private SupervisorRepository supervisorRepository;
  @Mock private SupervisorMapper supervisorMapper;
  @Mock private PasswordEncoder passwordEncoder;
  @InjectMocks private SupervisorService supervisorService;

  @Test
  public void givenValidUpsertDTO_whenCreateSupervisor_thenReturnCreatedSupervisor() {
    // Arrange
    SupervisorUpsertDTO dto = new SupervisorUpsertDTO();
    dto.setName("Test Supervisor");
    dto.setEmail("supervisor@example.com");
    dto.setSiape("20250832");
    dto.setSpecialization("Cirurgia");

    Supervisor supervisor = new Supervisor();
    supervisor.setName(dto.getName());
    supervisor.setEmail(dto.getEmail());
    supervisor.setSiape(dto.getSiape());
    supervisor.setSpecialization(dto.getSpecialization());
    supervisor.setRole(Role.SUPERVISOR);

    Supervisor savedSupervisor = new Supervisor();
    savedSupervisor.setId(UUID.randomUUID());
    savedSupervisor.setName(dto.getName());
    savedSupervisor.setEmail(dto.getEmail());
    savedSupervisor.setSiape(dto.getSiape());

    SupervisorDTO resultDTO = new SupervisorDTO();
    resultDTO.setId(savedSupervisor.getId());
    resultDTO.setName(savedSupervisor.getName());
    resultDTO.setEmail(savedSupervisor.getEmail());
    resultDTO.setSiape(savedSupervisor.getSiape());

    when(supervisorMapper.toEntity(dto)).thenReturn(supervisor);
    when(passwordEncoder.encode(dto.getSiape())).thenReturn("encodedPassword");
    when(supervisorRepository.save(any(Supervisor.class))).thenReturn(savedSupervisor);
    when(supervisorMapper.toDTO(savedSupervisor)).thenReturn(resultDTO);

    // Act
    SupervisorDTO result = supervisorService.createSupervisor(dto);

    // Assert
    assertThat(result).isNotNull();
    assertThat(result.getName()).isEqualTo(dto.getName());
    assertThat(result.getEmail()).isEqualTo(dto.getEmail());
    assertThat(result.getSiape()).isEqualTo(dto.getSiape());

    verify(supervisorMapper, times(1)).toEntity(dto);
    verify(passwordEncoder, times(1)).encode(dto.getSiape());
    verify(supervisorRepository, times(1)).save(any(Supervisor.class));
    verify(supervisorMapper, times(1)).toDTO(savedSupervisor);
  }
}

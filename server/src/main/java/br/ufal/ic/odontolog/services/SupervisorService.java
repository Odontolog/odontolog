package br.ufal.ic.odontolog.services;

import static org.springframework.http.HttpStatus.NOT_FOUND;

import br.ufal.ic.odontolog.dtos.SupervisorDTO;
import br.ufal.ic.odontolog.dtos.SupervisorUpdateDTO;
import br.ufal.ic.odontolog.mappers.SupervisorMapper;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.repositories.SupervisorRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SupervisorService {

  private final SupervisorRepository supervisorRepository;
  private final SupervisorMapper supervisorMapper;

  public SupervisorService(
      SupervisorRepository supervisorRepository, SupervisorMapper supervisorMapper) {
    this.supervisorRepository = supervisorRepository;
    this.supervisorMapper = supervisorMapper;
  }

  public List<SupervisorDTO> getSupervisors() {
    List<Supervisor> supervisors = supervisorRepository.findAll();
    return supervisorMapper.toDTOList(supervisors);
  }

  public SupervisorDTO getSupervisorById(UUID id) {
    Supervisor supervisor =
        supervisorRepository
            .findById(id)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Supervisor not found"));
    return supervisorMapper.toDTO(supervisor);
  }

  @Transactional
  public SupervisorDTO updateSupervisor(UUID id, SupervisorUpdateDTO supervisorUpdateDTO) {
    Supervisor supervisor =
        supervisorRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new ResponseStatusException(NOT_FOUND, "Supervisor not found with id: " + id));

    supervisorMapper.toEntity(supervisorUpdateDTO, supervisor);
    supervisorRepository.save(supervisor);

    return supervisorMapper.toDTO(supervisor);
  }
}

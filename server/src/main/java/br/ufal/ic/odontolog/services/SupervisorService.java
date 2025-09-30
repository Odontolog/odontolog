package br.ufal.ic.odontolog.services;

import static org.springframework.http.HttpStatus.NOT_FOUND;

import br.ufal.ic.odontolog.dtos.SupervisorDTO;
import br.ufal.ic.odontolog.dtos.SupervisorUpdateDTO;
import br.ufal.ic.odontolog.mappers.SupervisorMapper;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.repositories.SupervisorRepository;
import jakarta.transaction.Transactional;
import java.util.List;
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

  public SupervisorDTO getSupervisorByEmail(String email) {
    Supervisor supervisor =
        supervisorRepository
            .findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Supervisor not found"));
    return supervisorMapper.toDTO(supervisor);
  }

  @Transactional
  public SupervisorDTO updateSupervisor(String email, SupervisorUpdateDTO supervisorUpdateDTO) {
    Supervisor supervisor =
        supervisorRepository
            .findByEmail(email)
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        NOT_FOUND, "Supervisor not found with email: " + email));

    supervisorMapper.toEntity(supervisorUpdateDTO, supervisor);
    supervisorRepository.save(supervisor);

    return supervisorMapper.toDTO(supervisor);
  }
}

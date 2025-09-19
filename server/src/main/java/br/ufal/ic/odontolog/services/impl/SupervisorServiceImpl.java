package br.ufal.ic.odontolog.services.impl;

import br.ufal.ic.odontolog.dtos.SupervisorResponseDTO;
import br.ufal.ic.odontolog.dtos.SupervisorUpdateDTO;
import br.ufal.ic.odontolog.models.Supervisor;
import br.ufal.ic.odontolog.repositories.SupervisorRepository;
import br.ufal.ic.odontolog.services.SupervisorService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class SupervisorServiceImpl implements SupervisorService {

    private final SupervisorRepository supervisorRepository;
    final private ModelMapper modelMapper;

    public SupervisorServiceImpl(
            SupervisorRepository supervisorRepository,
            ModelMapper modelMapper
    ) {
        this.supervisorRepository = supervisorRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<SupervisorResponseDTO> getSupervisors() {
        List<SupervisorResponseDTO> supervisors = new ArrayList<>();
        this.supervisorRepository.findAll().forEach(supervisor -> supervisors.add(modelMapper.map(supervisor, SupervisorResponseDTO.class)));
        return supervisors;
    }

    @Override
    public SupervisorResponseDTO getSupervisorByEmail(String email) {
        Supervisor supervisor = supervisorRepository
                .findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Supervisor not found"));
        return modelMapper.map(supervisor, SupervisorResponseDTO.class);
    }

    @Override
    @Transactional
    public SupervisorResponseDTO updateSupervisor(String email, SupervisorUpdateDTO supervisorUpdateDTO) {
        Supervisor supervisor = supervisorRepository
                .findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Supervisor not found with email: " + email));

        modelMapper.map(supervisorUpdateDTO, supervisor);
        supervisorRepository.save(supervisor);

        return modelMapper.map(supervisor, SupervisorResponseDTO.class);
    }

    @Override
    @Transactional
    public void deleteSupervisor(String email) {
        Supervisor supervisor = supervisorRepository.findByEmail(email).orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Supervisor not found"));
        supervisor.setDeleted(true);
        supervisorRepository.save(supervisor);
    }
}

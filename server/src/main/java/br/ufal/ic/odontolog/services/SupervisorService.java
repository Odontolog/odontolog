package br.ufal.ic.odontolog.services;

import br.ufal.ic.odontolog.dtos.SupervisorResponseDTO;
import br.ufal.ic.odontolog.dtos.SupervisorUpdateDTO;

import java.util.List;

public interface SupervisorService {

    //void register(String name, String email);

    List<SupervisorResponseDTO> getSupervisors();

    SupervisorResponseDTO getSupervisorByEmail(String email);

    SupervisorResponseDTO updateSupervisor(String email, SupervisorUpdateDTO supervisorUpdateDTO);

    void deleteSupervisor(String email);
}
package br.ufal.ic.odontolog.services;

import br.ufal.ic.odontolog.dtos.PreProcedureDTO;
import br.ufal.ic.odontolog.dtos.PreProcedureShortDTO;
import br.ufal.ic.odontolog.dtos.PreProcedureUpsertDTO;
import br.ufal.ic.odontolog.dtos.ProcedureUpsertDTO;
import br.ufal.ic.odontolog.enums.ProcedureStatus;
import br.ufal.ic.odontolog.enums.ReviewableType;
import br.ufal.ic.odontolog.exceptions.ResourceNotFoundException;
import br.ufal.ic.odontolog.mappers.PreProcedureMapper;
import br.ufal.ic.odontolog.mappers.ProcedureMapper;
import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.PreProcedure;
import br.ufal.ic.odontolog.models.ProcedureDetail;
import br.ufal.ic.odontolog.models.User;
import br.ufal.ic.odontolog.repositories.PatientRepository;
import br.ufal.ic.odontolog.repositories.PreProcedureRepository;
import java.util.List;
import java.util.stream.Collectors;

import br.ufal.ic.odontolog.utils.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PreProcedureService {

    private final PreProcedureRepository preProcedureRepository;
    private final PatientRepository patientRepository;
    private final CurrentUserProvider currentUserProvider;
    private final PreProcedureMapper preProcedureMapper;

    @Transactional
    public PreProcedureDTO createPreProcedure(Long patientId, PreProcedureUpsertDTO dto) {
        User currentUser = currentUserProvider.getCurrentUser();

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        PreProcedure preProcedure = PreProcedure.builder()
                .name(dto.getName())
                .patient(patient)
                .author(currentUser)
                //.assignee(currentUser)
                .type(ReviewableType.PROCEDURE)
                .status(ProcedureStatus.IN_PROGRESS)
                .build();

        preProcedureRepository.save(preProcedure);

        return preProcedureMapper.toDTO(preProcedure);
    }

    @Transactional(readOnly = true)
    public PreProcedureDTO getPreProcedureById(Long preProcedureId) {
        PreProcedure preProcedure = preProcedureRepository.findById(preProcedureId)
                .orElseThrow(() -> new ResourceNotFoundException("PreProcedure not found"));

        return preProcedureMapper.toDTO(preProcedure);
    }

    @Transactional(readOnly = true)
    public List<PreProcedureShortDTO> getPreProceduresForPatient(Long patientId) {
        List<PreProcedure> procedures = preProcedureRepository
                .findByPatientId(patientId);

        return procedures.stream()
                .map(preProcedureMapper::toShortDTO)
                .collect(Collectors.toList());
    }

}

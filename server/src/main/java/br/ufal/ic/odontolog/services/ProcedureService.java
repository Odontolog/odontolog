package br.ufal.ic.odontolog.services;

import br.ufal.ic.odontolog.dtos.ProcedureDTO;
import br.ufal.ic.odontolog.enums.ActivityType;
import br.ufal.ic.odontolog.exceptions.ResourceNotFoundException;
import br.ufal.ic.odontolog.mappers.ProcedureMapper;
import br.ufal.ic.odontolog.models.*;
import br.ufal.ic.odontolog.repositories.ProcedureRepository;
import br.ufal.ic.odontolog.utils.CurrentUserProvider;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProcedureService {
  private final ProcedureRepository procedureRepository;
  private final ProcedureMapper procedureMapper;
  private final CurrentUserProvider currentUserProvider;

  @Transactional(readOnly = true)
  public List<ProcedureDTO> getAllPatientProcedures(long patientId) {
    List<Procedure> procedures = procedureRepository.findAll();

    return procedureMapper.toDTOs(procedures);
  }

  @Transactional(readOnly = true)
  public ProcedureDTO getProcedureById(Long procedureId) {
    Procedure procedure =
        procedureRepository
            .findById(procedureId)
            .orElseThrow(() -> new ResourceNotFoundException("Procedure not found"));

    return procedureMapper.toDTO(procedure);
  }

  @Transactional
  public ProcedureDTO updateTeeth(Long procedureId, Set<String> teeth) {
    Procedure procedure =
        procedureRepository
            .findById(procedureId)
            .orElseThrow(() -> new ResourceNotFoundException("Procedure not found"));

    Set<String> oldTeeth = procedure.getTeeth();
    procedure.setTeeth(teeth);

    User currentUser = currentUserProvider.getCurrentUser();

    HashMap<String, Object> metadata = new HashMap<>();
    metadata.put("data", teeth);
    metadata.put("oldData", oldTeeth);

    Activity activity =
        Activity.builder()
            .actor(currentUser)
            .type(ActivityType.EDITED)
            .description(
                String.format(
                    "Observações atualizadas por %s (%s)",
                    currentUser.getName(), currentUser.getEmail()))
            .reviewable(procedure)
            .metadata(metadata)
            .build();
    procedure.getHistory().add(activity);

    procedureRepository.save(procedure);
    return procedureMapper.toDTO(procedure);
  }
}

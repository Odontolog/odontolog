package br.ufal.ic.odontolog.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.SubclassMapping;

import br.ufal.ic.odontolog.dtos.ProcedureDTO;
import br.ufal.ic.odontolog.dtos.ReviewableDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanDTO;
import br.ufal.ic.odontolog.models.Procedure;
import br.ufal.ic.odontolog.models.Reviewable;
import br.ufal.ic.odontolog.models.TreatmentPlan;

@Mapper(componentModel = "spring", uses = { TreatmentPlanMapper.class, ProcedureMapper.class, SupervisorMapper.class })
public interface ReviewableMapper {
    @SubclassMapping(source = TreatmentPlan.class, target = TreatmentPlanDTO.class)
    @SubclassMapping(source = Procedure.class, target = ProcedureDTO.class)
    ReviewableDTO toDTO(Reviewable reviewable);

    List<ReviewableDTO> toDTOs(List<Reviewable> reviewables);
}

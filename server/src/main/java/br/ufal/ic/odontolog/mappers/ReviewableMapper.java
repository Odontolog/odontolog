package br.ufal.ic.odontolog.mappers;

import br.ufal.ic.odontolog.dtos.ProcedureDTO;
import br.ufal.ic.odontolog.dtos.ProcedureShortDTO;
import br.ufal.ic.odontolog.dtos.ReviewableDTO;
import br.ufal.ic.odontolog.dtos.ReviewableShortDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanShortDTO;
import br.ufal.ic.odontolog.models.Procedure;
import br.ufal.ic.odontolog.models.Reviewable;
import br.ufal.ic.odontolog.models.TreatmentPlan;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.SubclassMapping;

@Mapper(
    componentModel = "spring",
    uses = {TreatmentPlanMapper.class, ProcedureMapper.class, SupervisorMapper.class})
public interface ReviewableMapper {
  @SubclassMapping(source = TreatmentPlan.class, target = TreatmentPlanDTO.class)
  @SubclassMapping(source = Procedure.class, target = ProcedureDTO.class)
  ReviewableDTO toDTO(Reviewable reviewable);

  List<ReviewableDTO> toDTOs(List<Reviewable> reviewables);

  @SubclassMapping(source = TreatmentPlan.class, target = TreatmentPlanShortDTO.class)
  @SubclassMapping(source = Procedure.class, target = ProcedureShortDTO.class)
  ReviewableShortDTO toShortDTO(Reviewable reviewable);
}

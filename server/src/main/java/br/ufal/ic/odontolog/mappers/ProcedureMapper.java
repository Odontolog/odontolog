package br.ufal.ic.odontolog.mappers;

import br.ufal.ic.odontolog.dtos.PreProcedureDTO;
import br.ufal.ic.odontolog.dtos.PreProcedureShortDTO;
import br.ufal.ic.odontolog.dtos.ProcedureDTO;
import br.ufal.ic.odontolog.dtos.ProcedureShortDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanProcedureDTO;
import br.ufal.ic.odontolog.dtos.TreatmentPlanProcedureShortDTO;
import br.ufal.ic.odontolog.models.PreProcedure;
import br.ufal.ic.odontolog.models.Procedure;
import br.ufal.ic.odontolog.models.TreatmentPlanProcedure;

import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.MapperConfig;
import org.mapstruct.Mapping;

import org.mapstruct.SubclassMapping;

@Mapper(componentModel = "spring")
@MapperConfig(componentModel = "spring")
public interface ProcedureMapper {
    @SubclassMapping(source = PreProcedure.class, target = PreProcedureDTO.class)
    @SubclassMapping(source = TreatmentPlanProcedure.class, target = TreatmentPlanProcedureDTO.class)
    ProcedureDTO toDTO(Procedure procedure);

    List<ProcedureDTO> toDTOs(List<Procedure> procedures);

    @Mapping(source = "treatmentPlan.id", target = "treatmentPlanId")
    TreatmentPlanProcedureDTO toTreatmentPlanProcedureDTO(TreatmentPlanProcedure entity);
    PreProcedureDTO toPreProcedureDTO(PreProcedure entity);

    @SubclassMapping(source = PreProcedure.class, target = PreProcedureShortDTO.class)
    @SubclassMapping(source = TreatmentPlanProcedure.class, target = TreatmentPlanProcedureShortDTO.class)
    ProcedureShortDTO toShortDTO(Procedure procedure);

    List<ProcedureShortDTO> toShortDTOs(List<Procedure> procedures);

    
    @Mapping(source = "treatmentPlan.id", target = "treatmentPlanId")
    TreatmentPlanProcedureShortDTO toTreatmentPlanProcedureShortDTO(TreatmentPlanProcedure entity);
    PreProcedureShortDTO toPreProcedureShortDTO(PreProcedure entity);
}

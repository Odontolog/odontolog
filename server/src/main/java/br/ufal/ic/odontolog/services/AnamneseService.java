package br.ufal.ic.odontolog.services;

import br.ufal.ic.odontolog.dtos.anamnese.AnamneseConditionsUpsertDTO;
import br.ufal.ic.odontolog.dtos.anamnese.AnamneseDTO;
import br.ufal.ic.odontolog.dtos.anamnese.AnamneseNotesUpsertDTO;
import br.ufal.ic.odontolog.enums.ActivityType;
import br.ufal.ic.odontolog.enums.ClinicalCondition;
import br.ufal.ic.odontolog.mappers.AnamneseMapper;
import br.ufal.ic.odontolog.models.Anamnese;
import br.ufal.ic.odontolog.models.AnamneseActivity;
import br.ufal.ic.odontolog.models.Patient;
import br.ufal.ic.odontolog.models.PatientCondition;
import br.ufal.ic.odontolog.repositories.AnamneseActivityRepository;
import br.ufal.ic.odontolog.repositories.AnamneseRepository;
import br.ufal.ic.odontolog.repositories.PatientConditionRepository;
import br.ufal.ic.odontolog.repositories.PatientRepository;
import br.ufal.ic.odontolog.utils.CurrentUserProvider;
import java.util.*;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AnamneseService {
  private final AnamneseRepository anamneseRepository;
  private final PatientConditionRepository conditionRepository;
  private final AnamneseActivityRepository activityRepository;
  private final CurrentUserProvider currentUserProvider;
  private final AnamneseMapper anamneseMapper;
  private final PatientRepository patientRepository;

  @Transactional
  public AnamneseDTO getByPatientId(Long patientId) {
    Anamnese anamnese =
        anamneseRepository.findById(patientId).orElseGet(() -> initForPatient(patientId));
    ensureAllConditions(anamnese);
    return anamneseMapper.toDTO(anamnese);
  }

  @Transactional
  public AnamneseDTO upsertNotes(Long patientId, AnamneseNotesUpsertDTO dto) {
    Anamnese anamnese =
        anamneseRepository.findById(patientId).orElseGet(() -> initForPatient(patientId));

    AnamneseActivity activity = new AnamneseActivity();
    activity.setAnamnese(anamnese);
    activity.setActor(currentUserProvider.getCurrentUser());
    activity.setType(ActivityType.EDITED);
    activity.setDescription(
        String.format(
            "Notas de anamnese atualizadas por %s (%s)",
            currentUserProvider.getCurrentUser().getName(),
            currentUserProvider.getCurrentUser().getEmail()));
    Map<String, Object> metadata = new HashMap<>();
    metadata.put("uiType", "EDIT_NOTES");
    metadata.put("data", dto.getNotes());
    metadata.put("previousData", anamnese.getNotes());
    activity.setMetadata(metadata);

    anamnese.setNotes(dto.getNotes());
    activityRepository.save(activity);
    anamnese.getHistory().add(activity);

    return anamneseMapper.toDTO(anamneseRepository.save(anamnese));
  }

  @Transactional
  public AnamneseDTO upsertConditions(Long patientId, AnamneseConditionsUpsertDTO dto) {
    Anamnese anamnese =
        anamneseRepository.findById(patientId).orElseGet(() -> initForPatient(patientId));

    Map<ClinicalCondition, AnamneseConditionsUpsertDTO.ConditionUpsertItem> incoming =
        dto.getConditions().stream()
            .collect(
                Collectors.toMap(
                    AnamneseConditionsUpsertDTO.ConditionUpsertItem::getCondition,
                    c -> c,
                    (a, b) -> b));

    List<Map<String, Object>> updatedFields = new ArrayList<>();

    for (PatientCondition pc : anamnese.getConditions()) {
      AnamneseConditionsUpsertDTO.ConditionUpsertItem inc = incoming.get(pc.getCondition());
      if (inc != null) {
        boolean changed =
            !Objects.equals(pc.getHasCondition(), inc.getHasCondition())
                || !Objects.equals(pc.getNotes(), inc.getNotes());
        pc.setHasCondition(inc.getHasCondition());
        pc.setNotes(inc.getNotes());
        conditionRepository.save(pc);
        if (changed) {
          Map<String, Object> f = new HashMap<>();
          f.put("condition", pc.getCondition().name());
          f.put("hasCondition", pc.getHasCondition());
          f.put("notes", pc.getNotes());
          updatedFields.add(f);
        }
      }
    }

    if (!updatedFields.isEmpty()) {
      AnamneseActivity activity = new AnamneseActivity();
      activity.setAnamnese(anamnese);
      activity.setActor(currentUserProvider.getCurrentUser());
      activity.setType(ActivityType.EDITED);
      activity.setDescription(
          String.format(
              "Anamnese atualizada por %s (%s)",
              currentUserProvider.getCurrentUser().getName(),
              currentUserProvider.getCurrentUser().getEmail()));
      Map<String, Object> metadata = new HashMap<>();
      metadata.put("uiType", "EDIT_CONDITIONS");
      metadata.put("updatedFields", updatedFields);
      activity.setMetadata(metadata);
      activityRepository.save(activity);
      anamnese.getHistory().add(activity);
    }

    return anamneseMapper.toDTO(anamneseRepository.save(anamnese));
  }

  private String deriveCategory(ClinicalCondition c) {
    return switch (c) {
      case MENARCHE,
              REGULAR_MENSTRUAL_CYCLE,
              CONTRACEPTIVE_USE,
              PREGNANCY,
              CLIMACTERIC_PERIMENOPAUSE,
              MENOPAUSE,
              HORMONE_REPLACEMENT ->
          "FEMALE";
      case SMOKING, ALCOHOL, OTHER_HABITS -> "HABITS";
      default -> "MEDICAL";
    };
  }

  @Transactional
  protected Anamnese initForPatient(Long patientId) {
    // Load patient to establish one-to-one relationship via shared primary key
    Patient patient = patientRepository.findById(patientId).orElseThrow();

    Anamnese anamnese = new Anamnese();
    anamnese.setPatient(patient);
    anamnese.setNotes("");
    anamnese = anamneseRepository.save(anamnese);

    for (ClinicalCondition c : ClinicalCondition.values()) {
      PatientCondition pc = new PatientCondition();
      pc.setAnamnese(anamnese);
      pc.setCondition(c);
      pc.setHasCondition(false);
      pc.setNotes("");
      pc.setCategory(deriveCategory(c));
      conditionRepository.save(pc);
      anamnese.getConditions().add(pc);
    }

    return anamneseRepository.save(anamnese);
  }

  private void ensureAllConditions(Anamnese anamnese) {
    Set<ClinicalCondition> existing =
        anamnese.getConditions().stream()
            .map(PatientCondition::getCondition)
            .collect(Collectors.toSet());
    boolean added = false;
    for (ClinicalCondition c : ClinicalCondition.values()) {
      if (!existing.contains(c)) {
        PatientCondition pc = new PatientCondition();
        pc.setAnamnese(anamnese);
        pc.setCondition(c);
        pc.setHasCondition(false);
        pc.setNotes("");
        pc.setCategory(deriveCategory(c));
        conditionRepository.save(pc);
        anamnese.getConditions().add(pc);
        added = true;
      }
    }
    if (added) {
      anamneseRepository.save(anamnese);
    }
  }
}

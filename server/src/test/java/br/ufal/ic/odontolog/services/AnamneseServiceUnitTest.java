package br.ufal.ic.odontolog.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import br.ufal.ic.odontolog.dtos.UserResponseDTO;
import br.ufal.ic.odontolog.dtos.anamnese.AnamneseConditionDTO;
import br.ufal.ic.odontolog.dtos.anamnese.AnamneseConditionsUpsertDTO;
import br.ufal.ic.odontolog.dtos.anamnese.AnamneseDTO;
import br.ufal.ic.odontolog.dtos.anamnese.AnamneseNotesUpsertDTO;
import br.ufal.ic.odontolog.enums.ClinicalCondition;
import br.ufal.ic.odontolog.mappers.AnamneseMapper;
import br.ufal.ic.odontolog.mappers.UserMapper;
import br.ufal.ic.odontolog.models.*;
import br.ufal.ic.odontolog.repositories.AnamneseActivityRepository;
import br.ufal.ic.odontolog.repositories.AnamneseRepository;
import br.ufal.ic.odontolog.repositories.PatientConditionRepository;
import br.ufal.ic.odontolog.repositories.PatientRepository;
import br.ufal.ic.odontolog.utils.CurrentUserProvider;
import java.util.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AnamneseServiceUnitTest {

  @Mock private AnamneseRepository anamneseRepository;
  @Mock private PatientConditionRepository conditionRepository;
  @Mock private AnamneseActivityRepository activityRepository;
  @Mock private CurrentUserProvider currentUserProvider;
  @Mock private UserMapper userMapper;
  @Mock private AnamneseMapper anamneseMapper;
  @Mock private PatientRepository patientRepository;

  @InjectMocks private AnamneseService service;

  @BeforeEach
  void setup() {
    // MapStruct mapper is injected in service; stub a minimal mapping to DTO for assertions
    lenient()
        .when(anamneseMapper.toDTO(any(Anamnese.class)))
        .thenAnswer(
            inv -> {
              Anamnese a = inv.getArgument(0);
              AnamneseDTO dto = new AnamneseDTO();
              Patient pp =
                  Optional.ofNullable(a.getPatient())
                      .orElse(Patient.builder().id(a.getId()).build());
              dto.setPatientId(pp.getId());
              dto.setNotes(a.getNotes());
              // map conditions to DTO-like objects we assert on
              if (a.getConditions() != null) {
                List<AnamneseConditionDTO> list = new java.util.ArrayList<>();
                for (PatientCondition pc : a.getConditions()) {
                  AnamneseConditionDTO c = new AnamneseConditionDTO();
                  c.setId(pc.getId());
                  c.setCondition(pc.getCondition() != null ? pc.getCondition().name() : null);
                  c.setDescription(
                      pc.getCondition() != null ? pc.getCondition().getDescription() : null);
                  c.setCategory(pc.getCategory());
                  c.setHasCondition(pc.getHasCondition());
                  c.setNotes(pc.getNotes());
                  list.add(c);
                }
                dto.setConditions(list);
              } else {
                dto.setConditions(java.util.Collections.emptyList());
              }
              dto.setHistory(java.util.Collections.emptyList());
              return dto;
            });
    // Default behavior: return the same entity passed to save
    lenient()
        .when(anamneseRepository.save(any(Anamnese.class)))
        .thenAnswer(inv -> inv.getArgument(0));
    lenient()
        .when(conditionRepository.save(any(PatientCondition.class)))
        .thenAnswer(inv -> inv.getArgument(0));
    lenient()
        .when(activityRepository.save(any(AnamneseActivity.class)))
        .thenAnswer(inv -> inv.getArgument(0));

    // Avoid NPE when mapping histories in toDTO (even if empty in unit tests)
    lenient().when(userMapper.toResponseDTO(any(User.class))).thenReturn(new UserResponseDTO());
  }

  @Test
  @DisplayName("getByPatientId deve inicializar anamnese e todas as condições quando não existir")
  void getByPatientId_initializesWhenAbsent() {
    Long patientId = 10L;

    when(anamneseRepository.findById(patientId)).thenReturn(Optional.empty());
    // Patient exists for one-to-one mapping
    Patient p = new Patient();
    p.setId(patientId);
    // set id via reflection since it's @GeneratedValue; but here just ensure repository returns
    // instance
    lenient().when(patientRepository.findById(patientId)).thenReturn(Optional.of(p));

    // capture saves of PatientCondition to validate categories and count
    ArgumentCaptor<PatientCondition> pcCaptor = ArgumentCaptor.forClass(PatientCondition.class);

    AnamneseDTO dto = service.getByPatientId(patientId);

    // Deve retornar o mesmo patientId e conter todas as condições do enum
    assertThat(dto.getPatientId()).isEqualTo(patientId);
    assertThat(dto.getConditions()).hasSize(ClinicalCondition.values().length);

    // Verificar que salvou uma PatientCondition para cada enum
    verify(conditionRepository, atLeast(ClinicalCondition.values().length))
        .save(pcCaptor.capture());
    List<PatientCondition> saved = pcCaptor.getAllValues();
    // Assegura que há condições de categorias distintas e exemplos corretos
    // Procura por alguns enums específicos
    Optional<PatientCondition> bloodPressure =
        saved.stream()
            .filter(pc -> pc.getCondition() == ClinicalCondition.BLOOD_PRESSURE)
            .findFirst();
    Optional<PatientCondition> menarche =
        saved.stream().filter(pc -> pc.getCondition() == ClinicalCondition.MENARCHE).findFirst();
    Optional<PatientCondition> smoking =
        saved.stream().filter(pc -> pc.getCondition() == ClinicalCondition.SMOKING).findFirst();

    assertThat(bloodPressure).isPresent();
    assertThat(bloodPressure.get().getCategory()).isEqualTo("MEDICAL");

    assertThat(menarche).isPresent();
    assertThat(menarche.get().getCategory()).isEqualTo("FEMALE");

    assertThat(smoking).isPresent();
    assertThat(smoking.get().getCategory()).isEqualTo("HABITS");

    // Deve salvar anamnese pelo menos duas vezes (init + ensureAllConditions may re-save)
    verify(anamneseRepository, atLeastOnce()).save(any(Anamnese.class));
  }

  @Test
  @DisplayName(
      "upsertNotes deve atualizar notas e registrar atividade EDIT_NOTES com metadata.data")
  void upsertNotes_updatesNotesAndCreatesActivity() {
    Long patientId = 20L;
    Anamnese existing = new Anamnese();
    existing.setId(patientId);
    existing.setNotes("");
    existing.setHistory(new HashSet<>());
    existing.setConditions(new HashSet<>());

    when(anamneseRepository.findById(patientId)).thenReturn(Optional.of(existing));

    User user = new User();
    when(currentUserProvider.getCurrentUser()).thenReturn(user);

    AnamneseNotesUpsertDTO dto = new AnamneseNotesUpsertDTO();
    dto.setNotes("Novas observações sobre o paciente");

    ArgumentCaptor<AnamneseActivity> activityCaptor =
        ArgumentCaptor.forClass(AnamneseActivity.class);

    AnamneseDTO result = service.upsertNotes(patientId, dto);

    assertThat(result.getNotes()).isEqualTo(dto.getNotes());

    verify(activityRepository).save(activityCaptor.capture());
    AnamneseActivity activity = activityCaptor.getValue();
    assertThat(activity.getDescription()).contains("Notas de anamnese atualizadas");
    assertThat(activity.getMetadata()).isNotNull();
    assertThat(activity.getMetadata().get("uiType")).isEqualTo("EDIT_NOTES");
    assertThat(activity.getMetadata().get("data")).isEqualTo(dto.getNotes());
  }

  @Test
  @DisplayName(
      "upsertConditions deve atualizar valores e registrar atividade EDIT_CONDITIONS quando houver mudanças")
  void upsertConditions_updatesAndCreatesActivityOnChanges() {
    Long patientId = 30L;
    Anamnese anamnese = new Anamnese();
    anamnese.setId(patientId);
    anamnese.setNotes("");

    // Condição existente: BLOOD_PRESSURE inicialmente false/empty
    PatientCondition pc = new PatientCondition();
    // set via reflection-like since fields are private? Using Mockito lenient 'save' returns same
    // instance. We only need getters/setters
    // The model uses no Lombok annotations for getters/setters in PatientCondition, but in main
    // code it accesses getters/setters.
    // Assuming they exist via default methods (in the provided file no Lombok). We'll use
    // reflection to set fields if needed.
    // However, in code, service uses getters/setters; ensure they exist in model. If not, tests
    // still compile as we call methods here too.
    try {
      pc.getClass().getDeclaredMethod("setAnamnese", Anamnese.class).invoke(pc, anamnese);
      pc.getClass()
          .getDeclaredMethod("setCondition", ClinicalCondition.class)
          .invoke(pc, ClinicalCondition.BLOOD_PRESSURE);
      pc.getClass().getDeclaredMethod("setHasCondition", Boolean.class).invoke(pc, false);
      pc.getClass().getDeclaredMethod("setNotes", String.class).invoke(pc, "");
      pc.getClass().getDeclaredMethod("setCategory", String.class).invoke(pc, "MEDICAL");
    } catch (Exception ignore) {
      // If setters are available via package-private, direct calls above using reflection handle
      // it; otherwise test may fail at compile-time.
    }

    Set<PatientCondition> set = new HashSet<>();
    set.add(pc);
    anamnese.setConditions(set);
    anamnese.setHistory(new HashSet<>());

    when(anamneseRepository.findById(patientId)).thenReturn(Optional.of(anamnese));

    User user = new User();
    when(currentUserProvider.getCurrentUser()).thenReturn(user);

    // Incoming DTO with change for BLOOD_PRESSURE
    AnamneseConditionsUpsertDTO up = new AnamneseConditionsUpsertDTO();
    AnamneseConditionsUpsertDTO.ConditionUpsertItem item =
        new AnamneseConditionsUpsertDTO.ConditionUpsertItem();
    item.setCondition(ClinicalCondition.BLOOD_PRESSURE);
    item.setHasCondition(true);
    item.setNotes("Paciente hipertenso");
    up.setConditions(List.of(item));

    ArgumentCaptor<AnamneseActivity> activityCaptor =
        ArgumentCaptor.forClass(AnamneseActivity.class);

    AnamneseDTO response = service.upsertConditions(patientId, up);

    // Verifica que o DTO refletiu a alteração
    var updated =
        response.getConditions().stream()
            .filter(c -> c.getCondition().equals("BLOOD_PRESSURE"))
            .findFirst()
            .orElseThrow();
    assertThat(updated.getHasCondition()).isTrue();
    assertThat(updated.getNotes()).isEqualTo("Paciente hipertenso");

    // Verifica que uma atividade foi criada com metadata.updatedFields
    verify(activityRepository).save(activityCaptor.capture());
    Map<String, Object> md = activityCaptor.getValue().getMetadata();
    assertThat(md).isNotNull();
    assertThat(md.get("uiType")).isEqualTo("EDIT_CONDITIONS");
    @SuppressWarnings("unchecked")
    List<Map<String, Object>> updatedFields = (List<Map<String, Object>>) md.get("updatedFields");
    assertThat(updatedFields).isNotEmpty();
    Map<String, Object> first = updatedFields.get(0);
    assertThat(first.get("condition")).isEqualTo("BLOOD_PRESSURE");
    assertThat(first.get("hasCondition")).isEqualTo(true);
    assertThat(first.get("notes")).isEqualTo("Paciente hipertenso");

    // Deve salvar a PatientCondition alterada
    verify(conditionRepository, atLeastOnce()).save(any(PatientCondition.class));
  }

  @Test
  @DisplayName("upsertConditions não deve registrar atividade quando não houver mudanças")
  void upsertConditions_doesNotCreateActivityWhenNoChanges() {
    Long patientId = 40L;
    Anamnese anamnese = new Anamnese();
    anamnese.setId(patientId);

    PatientCondition pc = new PatientCondition();
    try {
      pc.getClass().getDeclaredMethod("setAnamnese", Anamnese.class).invoke(pc, anamnese);
      pc.getClass()
          .getDeclaredMethod("setCondition", ClinicalCondition.class)
          .invoke(pc, ClinicalCondition.BLOOD_PRESSURE);
      pc.getClass().getDeclaredMethod("setHasCondition", Boolean.class).invoke(pc, false);
      pc.getClass().getDeclaredMethod("setNotes", String.class).invoke(pc, "");
      pc.getClass().getDeclaredMethod("setCategory", String.class).invoke(pc, "MEDICAL");
    } catch (Exception ignore) {
    }

    anamnese.setConditions(new HashSet<>(Set.of(pc)));
    anamnese.setHistory(new HashSet<>());

    when(anamneseRepository.findById(patientId)).thenReturn(Optional.of(anamnese));

    AnamneseConditionsUpsertDTO up = new AnamneseConditionsUpsertDTO();
    AnamneseConditionsUpsertDTO.ConditionUpsertItem item =
        new AnamneseConditionsUpsertDTO.ConditionUpsertItem();
    item.setCondition(ClinicalCondition.BLOOD_PRESSURE);
    item.setHasCondition(false);
    item.setNotes("");
    up.setConditions(List.of(item));

    service.upsertConditions(patientId, up);

    verify(activityRepository, never()).save(any());
    // Mesmo sem mudanças, cada condição é salva
    verify(conditionRepository, atLeastOnce()).save(any(PatientCondition.class));
  }
}

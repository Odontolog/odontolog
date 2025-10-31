package br.ufal.ic.odontolog.config;

import br.ufal.ic.odontolog.enums.ActivityType;
import br.ufal.ic.odontolog.enums.Ethnicity;
import br.ufal.ic.odontolog.enums.MaritalStatus;
import br.ufal.ic.odontolog.enums.ProcedureStatus;
import br.ufal.ic.odontolog.enums.ReviewStatus;
import br.ufal.ic.odontolog.enums.ReviewableType;
import br.ufal.ic.odontolog.enums.Role;
import br.ufal.ic.odontolog.enums.Sex;
import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import br.ufal.ic.odontolog.models.*;
import br.ufal.ic.odontolog.repositories.*;
import io.awspring.cloud.s3.S3Template;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
@RequiredArgsConstructor
public class DevDataLoader implements CommandLineRunner {
  Logger logger = LoggerFactory.getLogger(DevDataLoader.class);

  private final StudentRepository studentRepository;
  private final SupervisorRepository supervisorRepository;
  private final TreatmentPlanRepository treatmentPlanRepository;
  private final AttachmentRepository attachmentRepository;
  private final PreProcedureRepository preProcedureRepository;
  private final ActivityRepository activityRepository;
  private final PatientRepository patientRepository;
  private final TreatmentPlanProcedureRepository treatmentPlanProcedureRepository;
  private final PasswordEncoder passwordEncoder;
  private final S3Template s3Template;

  @Override
  public void run(String... args) throws Exception {
    // FIXME: Update emails and passwords to be more readable

    logger.info("Loading dev data...");

    try {
      Student studentTest001 =
          studentRepository.save(
              Student.builder()
                  .name("João Argel")
                  .email("student.test.001@test.com")
                  .role(Role.STUDENT)
                  .password(passwordEncoder.encode("password1"))
                  .enrollmentSemester(1)
                  .enrollmentCode("20250914")
                  .enrollmentYear(2025)
                  .clinicNumber(1)
                  .photoUrl("some-url")
                  .build());
      logger.info("Student created: {}", studentTest001.getName());

      Student studentTest002 =
          studentRepository.save(
              Student.builder()
                  .name("Ana Maria Oliveira")
                  .email("student.test.002@test.com")
                  .role(Role.STUDENT)
                  .password(passwordEncoder.encode("password1"))
                  .enrollmentSemester(1)
                  .enrollmentCode("20250916")
                  .enrollmentYear(2025)
                  .clinicNumber(1)
                  .photoUrl("some-url")
                  .build());
      logger.info("Student created: {}", studentTest002.getName());

      Student studentTest003 =
          studentRepository.save(
              Student.builder()
                  .name("Mariana de Andrade")
                  .email("student.test.003@test.com")
                  .role(Role.STUDENT)
                  .password(passwordEncoder.encode("password1"))
                  .enrollmentSemester(1)
                  .enrollmentCode("20250915")
                  .enrollmentYear(2025)
                  .clinicNumber(1)
                  .photoUrl("some-url")
                  .build());
      logger.info("Student created: {}", studentTest003.getName());

      Supervisor supervisorTest001 =
          supervisorRepository.save(
              Supervisor.builder()
                  .name("Theo Fortes")
                  .email("supervisor.test.001@test.com")
                  .role(Role.SUPERVISOR)
                  .password(passwordEncoder.encode("password2"))
                  .specialization("Cirurgia")
                  .siape("20250832")
                  .photoUrl("some-url")
                  .build());
      logger.info("Supervisor created: {}", supervisorTest001.getName());

      Supervisor supervisorTest002 =
          supervisorRepository.save(
              Supervisor.builder()
                  .name("Luiz Alexandre Moura")
                  .email("supervisor.test.002@test.com")
                  .role(Role.SUPERVISOR)
                  .password(passwordEncoder.encode("password2"))
                  .specialization("Periodontia")
                  .siape("20250432")
                  .photoUrl("some-url")
                  .build());
      logger.info("Supervisor created: {}", supervisorTest002.getName());

      Supervisor supervisorTest003 =
          supervisorRepository.save(
              Supervisor.builder()
                  .name("Larissa Silveira de Mendonça")
                  .email("supervisor.test.003@test.com")
                  .role(Role.SUPERVISOR)
                  .password(passwordEncoder.encode("password2"))
                  .specialization("Dentística")
                  .siape("20250332")
                  .photoUrl("some-url")
                  .build());
      logger.info("Supervisor created: {}", supervisorTest003.getName());

      Supervisor supervisorTest004 =
          supervisorRepository.save(
              Supervisor.builder()
                  .name("Rafaela Andrade")
                  .email("supervisor.test.004@test.com")
                  .role(Role.SUPERVISOR)
                  .password(passwordEncoder.encode("password2"))
                  .specialization("Endodontia")
                  .siape("20250732")
                  .photoUrl("some-url")
                  .build());
      logger.info("Supervisor created: {}", supervisorTest004.getName());

      Patient patientTest001 =
          patientRepository.save(
              Patient.builder()
                  .name("João da Silva")
                  .birthDate(LocalDate.parse("1990-01-01"))
                  .CPF("123.456.789-00")
                  .RG("12.345.678-9")
                  .sex(Sex.MALE)
                  .occupation("Tester")
                  .ethnicity(Ethnicity.BLACK)
                  .maritalStatus(MaritalStatus.SINGLE)
                  .phoneNumber("(12) 34567-8901")
                  .address("123 Test St, Test City, TS")
                  .city("Test City")
                  .appointmentDate(LocalDate.of(2025, 10, 20))
                  .state("TS")
                  .avatarUrl("https://randomuser.me/api/portraits/men/7.jpg")
                  .build());

      Patient patientTest002 =
          patientRepository.save(
              Patient.builder()
                  .name("Mário Telles")
                  .birthDate(LocalDate.parse("1990-01-01"))
                  .CPF("123.456.780-00")
                  .RG("12.345.678-9")
                  .sex(Sex.MALE)
                  .occupation("Tester")
                  .ethnicity(Ethnicity.WHITE)
                  .maritalStatus(MaritalStatus.SINGLE)
                  .phoneNumber("(12) 34567-8901")
                  .address("123 Test St, Test City, TS")
                  .city("Test City")
                  .state("TS")
                  .avatarUrl("https://randomuser.me/api/portraits/men/3.jpg")
                  .build());
      patientRepository.save(patientTest002);

      Patient patientTest003 =
          patientRepository.save(
              Patient.builder()
                  .name("Marina Costa Sampaio")
                  .birthDate(LocalDate.parse("1990-01-01"))
                  .CPF("123.456.589-00")
                  .RG("12.345.678-9")
                  .sex(Sex.FEMALE)
                  .occupation("Tester")
                  .ethnicity(Ethnicity.OTHER)
                  .maritalStatus(MaritalStatus.SINGLE)
                  .phoneNumber("(12) 34567-8901")
                  .address("123 Test St, Test City, TS")
                  .city("Test City")
                  .state("TS")
                  .avatarUrl("https://randomuser.me/api/portraits/women/5.jpg")
                  .build());
      patientRepository.save(patientTest003);

      Patient patientTest004 =
          patientRepository.save(
              Patient.builder()
                  .name("Laura Medeiros dos Santos")
                  .birthDate(LocalDate.parse("1990-01-01"))
                  .CPF("123.456.781-00")
                  .RG("12.345.678-9")
                  .sex(Sex.FEMALE)
                  .occupation("Tester")
                  .ethnicity(Ethnicity.WHITE)
                  .maritalStatus(MaritalStatus.MARRIED)
                  .phoneNumber("(12) 34567-8901")
                  .address("123 Test St, Test City, TS")
                  .city("Test City")
                  .state("TS")
                  .avatarUrl("https://randomuser.me/api/portraits/women/4.jpg")
                  .build());
      patientRepository.save(patientTest004);

      Patient patientTest005 =
          patientRepository.save(
              Patient.builder()
                  .name("Maria de Lourdes dos Anjos")
                  .birthDate(LocalDate.parse("1962-01-01"))
                  .CPF("001.456.781-00")
                  .RG("11.345.678-9")
                  .sex(Sex.FEMALE)
                  .occupation("Tester")
                  .ethnicity(Ethnicity.INDIGENOUS)
                  .maritalStatus(MaritalStatus.SEPARATED)
                  .phoneNumber("(12) 34567-8901")
                  .address("123 Test St, Test City, TS")
                  .city("Test City")
                  .state("TS")
                  .avatarUrl("https://randomuser.me/api/portraits/women/2.jpg")
                  .build());
      patientRepository.save(patientTest005);

      TreatmentPlan treatmentPlanTest001 =
          treatmentPlanRepository.save(
              TreatmentPlan.builder()
                  .name("Plano de Tratamento")
                  .patient(patientTest001)
                  .status(TreatmentPlanStatus.DRAFT)
                  .author(studentTest001)
                  .assignee(studentTest001)
                  .notes("Suspeita de diabetes.")
                  .type(ReviewableType.TREATMENT_PLAN)
                  .build());
      logger.info("Treatment Plan created: {}", treatmentPlanTest001.getId());

      TreatmentPlanProcedure treatmentPlanProcedureTest001 =
          TreatmentPlanProcedure.builder()
              .name("Obturação")
              .plannedSession(1)
              .patient(patientTest001)
              .author(studentTest001)
              .assignee(studentTest001)
              .notes("")
              .type(ReviewableType.PROCEDURE)
              .status(ProcedureStatus.DRAFT)
              .studySector("Endodontia")
              .procedureDetail(new ProcedureDetail(""))
              .build();

      treatmentPlanProcedureTest001.addTooth("11");
      treatmentPlanProcedureTest001.addTooth("25");

      Review reviewTest003 =
          Review.builder().reviewStatus(ReviewStatus.DRAFT).supervisor(supervisorTest001).build();
      treatmentPlanProcedureTest001.addReview(reviewTest003);

      treatmentPlanTest001.addProcedure(treatmentPlanProcedureTest001);
      treatmentPlanTest001 = treatmentPlanRepository.save(treatmentPlanTest001);
      logger.info("Treatment Plan Procedure created: {}", treatmentPlanProcedureTest001.getName());

      PreProcedure preProcedureTest001 =
          preProcedureRepository.save(
              PreProcedure.builder()
                  .name("RPS")
                  .plannedSession(1)
                  .patient(patientTest001)
                  .author(studentTest001)
                  .assignee(studentTest001)
                  .notes("Profundidade de sonda anormal.")
                  .type(ReviewableType.PROCEDURE)
                  .status(ProcedureStatus.NOT_STARTED)
                  .studySector("Periodontia")
                  .procedureDetail(
                      new ProcedureDetail(
                          "Indícios de gengivite. Será necessário Periograma completo."))
                  .build());

      preProcedureTest001 = preProcedureRepository.save(preProcedureTest001);
      logger.info("Pre Procedure created: {}", preProcedureTest001.getName());

      Activity activityTest001 =
          Activity.builder()
              .description("Plano de tratamento criado")
              .reviewable(treatmentPlanTest001)
              .actor(studentTest001)
              .type(ActivityType.CREATED)
              .build();
      activityRepository.save(activityTest001);
      logger.info("Activity created: {}", activityTest001.getDescription());

      Activity activityTest002 =
          Activity.builder()
              .description("Pre-procedimento criado")
              .reviewable(preProcedureTest001)
              .actor(studentTest001)
              .type(ActivityType.CREATED)
              .build();
      activityRepository.save(activityTest002);
      logger.info("Activity created: {}", activityTest002.getDescription());

      Review reviewTest001 =
          Review.builder()
              .comments("")
              .reviewStatus(ReviewStatus.DRAFT)
              .grade(8.0f)
              .supervisor(supervisorTest001)
              .build();
      treatmentPlanTest001.addReview(reviewTest001);
      treatmentPlanRepository.save(treatmentPlanTest001);
      logger.info("Review added to Treatment Plan: {}", treatmentPlanTest001.getId());

      Review reviewTest002 =
          Review.builder().reviewStatus(ReviewStatus.DRAFT).supervisor(supervisorTest001).build();
      preProcedureTest001.addReview(reviewTest002);
      preProcedureRepository.save(preProcedureTest001);
      logger.info("Review added to Pre Procedure: {}", preProcedureTest001.getName());

      logger.info("Dev data loaded successfully");
    } catch (Exception e) {
      logger.error("Error while loading data", e.getMessage());
    }
  }
}

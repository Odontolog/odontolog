package br.ufal.ic.odontolog.config;

import br.ufal.ic.odontolog.enums.ActivityType;
import br.ufal.ic.odontolog.enums.MaritalStatus;
import br.ufal.ic.odontolog.enums.ProcedureStatus;
import br.ufal.ic.odontolog.enums.ReviewStatus;
import br.ufal.ic.odontolog.enums.ReviewableType;
import br.ufal.ic.odontolog.enums.Role;
import br.ufal.ic.odontolog.enums.Sex;
import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import br.ufal.ic.odontolog.models.*;
import br.ufal.ic.odontolog.repositories.*;
import java.util.Set;
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

    @Override
    public void run(String... args) throws Exception {
        // FIXME: Update emails and passwords to be more readable

        logger.info("Loading dev data...");

        Student studentTest001 = studentRepository.save(
                Student.builder()
                        // .id(UUID.fromString("de66e248-f5ca-441d-9d6f-9494ac7e8144"))
                        .name("Student_Test_001")
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

        Supervisor supervisorTest001 = supervisorRepository.save(
                Supervisor.builder()
                        // .id(UUID.fromString("a4f5c2e1-5d3b-4c6e-8f7a-123456789abc"))
                        .name("Supervisor_Test_001")
                        .email("supervisor.test.001@test.com")
                        .role(Role.SUPERVISOR)
                        .password(passwordEncoder.encode("password2"))
                        .specialization("Surgery")
                        .siape("20250832")
                        .photoUrl("some-url")
                        .build());
        logger.info("Supervisor created: {}", supervisorTest001.getName());

        Patient patientTest001 = patientRepository.save(
                Patient.builder()
                        .name("Patient_Test_001")
                        .birthDate("1990-01-01")
                        .CPF("123.456.789-00")
                        .RG("12.345.678-9")
                        .sex(Sex.MALE)
                        .profession("Tester")
                        .race("Black")
                        .maritalStatus(MaritalStatus.SINGLE)
                        .phoneNumber("(12) 34567-8901")
                        .address("123 Test St, Test City, TS")
                        .city("Test City")
                        .state("TS")
                        .build());

        TreatmentPlan treatmentPlanTest001 = treatmentPlanRepository.save(
                TreatmentPlan.builder()
                        .name("Treatment_Plan_Test_001")
                        .patient(patientTest001)
                        .status(TreatmentPlanStatus.DRAFT)
                        .author(studentTest001)
                        .assignee(supervisorTest001)
                        .reviewers(Set.of(supervisorTest001))
                        .notes("Test Notes")
                        .type(ReviewableType.TREATMENT_PLAN)
                        .build());
        logger.info("Treatment Plan created: {}", treatmentPlanTest001.getId());

        TreatmentPlanProcedure treatmentPlanProcedureTest001 = TreatmentPlanProcedure.builder()
                .name("Treatment_Plan_Procedure_Test_001")
                .planned_session(1)
                .patient(patientTest001)
                .author(studentTest001)
                .assignee(supervisorTest001)
                .notes("Test Notes")
                .type(ReviewableType.PROCEDURE)
                .reviewers(Set.of(supervisorTest001))
                .status(ProcedureStatus.DRAFT)
                .studySector("Surgery")
                .procedureDetail(new ProcedureDetail("Test Procedure Detail"))
                .build();

        treatmentPlanTest001.addProcedure(treatmentPlanProcedureTest001);
        treatmentPlanTest001 = treatmentPlanRepository.save(treatmentPlanTest001);
        logger.info("Treatment Plan Procedure created: {}", treatmentPlanProcedureTest001.getName());

        Attachment attachmentTest001 = attachmentRepository.save(
                Attachment.builder()
                        .filename("Attachment_Test_001.pdf")
                        .size(1000000)
                        .location("/test/path/Attachment_Test_001.pdf")
                        .uploader(studentTest001)
                        .build());
        logger.info("Attachment created: {}", attachmentTest001.getFilename());

        if (treatmentPlanTest001.getProcedures().stream().findFirst().isPresent()) {
            treatmentPlanTest001.getProcedures().stream()
                    .findFirst()
                    .get()
                    .getAttachments()
                    .add(attachmentTest001);
            treatmentPlanTest001 = treatmentPlanRepository.save(treatmentPlanTest001);
            logger.info(
                    "Attachment {} added to Procedure {}",
                    attachmentTest001.getFilename(),
                    treatmentPlanTest001.getProcedures().stream().findFirst().get().getName());
        } else {
            logger.error("No procedure found in treatment plan while trying to add attachment");
        }

        PreProcedure preProcedureTest001 = preProcedureRepository.save(
                PreProcedure.builder()
                        .name("Pre_Procedure_Test_001")
                        .planned_session(1)
                        .patient(patientTest001)
                        .author(studentTest001)
                        .assignee(supervisorTest001)
                        .reviewers(Set.of(supervisorTest001))
                        .notes("Test Notes")
                        .type(ReviewableType.PROCEDURE)
                        .status(ProcedureStatus.DRAFT)
                        .studySector("Surgery")
                        .procedureDetail(new ProcedureDetail("Test Procedure Detail"))
                        .build());

        preProcedureTest001.getAttachments().add(attachmentTest001);
        preProcedureTest001 = preProcedureRepository.save(preProcedureTest001);
        logger.info("Pre Procedure created: {}", preProcedureTest001.getName());

        Activity activityTest001 = Activity.builder()
                .description("Created Treatment Plan")
                .reviewable(treatmentPlanTest001)
                .actor(studentTest001)
                .type(ActivityType.CREATED)
                .build();
        activityRepository.save(activityTest001);
        logger.info("Activity created: {}", activityTest001.getDescription());

        Activity activityTest002 = Activity.builder()
                .description("Created Pre Procedure")
                .reviewable(preProcedureTest001)
                .actor(studentTest001)
                .type(ActivityType.CREATED)
                .build();
        activityRepository.save(activityTest002);
        logger.info("Activity created: {}", activityTest002.getDescription());

        Review reviewTest001 = Review.builder()
                .comments("Looks good to me")
                .reviewStatus(ReviewStatus.APPROVED)
                .grade(5)
                .supervisor(supervisorTest001)
                .build();
        treatmentPlanTest001.addReview(reviewTest001);
        treatmentPlanRepository.save(treatmentPlanTest001);
        logger.info("Review added to Treatment Plan: {}", treatmentPlanTest001.getId());

        Review reviewTest002 = Review.builder().reviewStatus(ReviewStatus.PENDING).supervisor(supervisorTest001)
                .build();
        preProcedureTest001.addReview(reviewTest002);
        preProcedureRepository.save(preProcedureTest001);
        logger.info("Review added to Pre Procedure: {}", preProcedureTest001.getName());

        Review reviewTest003 = Review.builder().reviewStatus(ReviewStatus.PENDING).supervisor(supervisorTest001)
                .build();
        treatmentPlanProcedureTest001.addReview(reviewTest003);
        treatmentPlanProcedureRepository.save(treatmentPlanProcedureTest001);
        logger.info(
                "Review added to Treatment Plan Procedure: {}", treatmentPlanProcedureTest001.getName());

        logger.info("Dev data loaded successfully");
    }
}

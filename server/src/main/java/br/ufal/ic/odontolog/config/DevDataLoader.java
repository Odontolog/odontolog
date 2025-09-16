package br.ufal.ic.odontolog.config;

import br.ufal.ic.odontolog.enums.ActivityType;
import br.ufal.ic.odontolog.enums.ReviewStatus;
import br.ufal.ic.odontolog.enums.ReviewableStatus;
import br.ufal.ic.odontolog.enums.ReviewableType;
import br.ufal.ic.odontolog.enums.TreatmentPlanStatus;
import br.ufal.ic.odontolog.models.*;
import br.ufal.ic.odontolog.repositories.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
public class DevDataLoader implements CommandLineRunner {
        Logger logger = LoggerFactory.getLogger(DevDataLoader.class);

        private final StudentRepository studentRepository;
        private final SupervisorRepository supervisorRepository;
        private final TreatmentPlanRepository treatmentPlanRepository;
        private final AttachmentRepository attachmentRepository;
        private final PreProcedureRepository preProcedureRepository;
        private final ActivityRepository activityRepository;

        public DevDataLoader(StudentRepository studentRepository, SupervisorRepository supervisorRepository,
                        TreatmentPlanRepository treatmentPlanRepository, AttachmentRepository attachmentRepository,
                        PreProcedureRepository preProcedureRepository, ActivityRepository activityRepository) {
                this.studentRepository = studentRepository;
                this.supervisorRepository = supervisorRepository;
                this.treatmentPlanRepository = treatmentPlanRepository;
                this.attachmentRepository = attachmentRepository;
                this.preProcedureRepository = preProcedureRepository;
                this.activityRepository = activityRepository;
        }

        @Override
        public void run(String... args) throws Exception {
                Student studentTest001 = studentRepository.save(new Student(
                                "Student_Test_001",
                                "student.test.001@test.com",
                                1,
                                "20250914",
                                2025,
                                1));

                Supervisor supervisorTest001 = supervisorRepository.save(new Supervisor(
                                "Supervisor_Test_001",
                                "supervisor.test.001@test.com",
                                "Surgery",
                                "20250832"));

                TreatmentPlan treatmentPlanTest001 = treatmentPlanRepository.save(TreatmentPlan.builder()
                                .treatmentPlanStatus(TreatmentPlanStatus.DRAFT)
                                .reviewableStatus(ReviewableStatus.DRAFT)
                                .author(studentTest001)
                                .assignee(supervisorTest001)
                                .notes("Test Notes")
                                .type(ReviewableType.TREATMENT_PLAN)
                                .build());

                TreatmentPlanProcedure treatmentPlanProcedureTest001 = TreatmentPlanProcedure.builder()
                                .name("Treatment_Plan_Procedure_Test_001")
                                .planned_session(1)
                                .author(studentTest001)
                                .assignee(supervisorTest001)
                                .notes("Test Notes")
                                .type(ReviewableType.PROCEDURE)
                                .reviewableStatus(ReviewableStatus.DRAFT)
                                .studySector("Surgery")
                                .procedureDetail(new ProcedureDetail(
                                                "Test Procedure Detail"))
                                .build();

                treatmentPlanTest001.addProcedure(treatmentPlanProcedureTest001);
                treatmentPlanTest001 = treatmentPlanRepository.save(treatmentPlanTest001);

                Attachment attachmentTest001 = attachmentRepository.save(Attachment.builder()
                                .filename("Attachment_Test_001.pdf")
                                .size(1000000)
                                .location("/test/path/Attachment_Test_001.pdf")
                                .uploader(studentTest001)
                                .build());

                if (treatmentPlanTest001.getProcedures().stream().findFirst().isPresent()) {
                        treatmentPlanTest001.getProcedures().stream().findFirst().get().getAttachments()
                                        .add(attachmentTest001);
                        treatmentPlanTest001 = treatmentPlanRepository.save(treatmentPlanTest001);
                } else {
                        logger.error("No procedure found in treatment plan while trying to add attachment");
                }

                PreProcedure preProcedureTest001 = preProcedureRepository.save(PreProcedure.builder()
                                .name("Pre_Procedure_Test_001")
                                .planned_session(1)
                                .author(studentTest001)
                                .assignee(supervisorTest001)
                                .notes("Test Notes")
                                .type(ReviewableType.PROCEDURE)
                                .reviewableStatus(ReviewableStatus.DRAFT)
                                .studySector("Surgery")
                                .procedureDetail(new ProcedureDetail(
                                                "Test Procedure Detail"))
                                .build());

                preProcedureTest001.getAttachments().add(attachmentTest001);
                preProcedureTest001 = preProcedureRepository.save(preProcedureTest001);

                Activity activityTest001 = Activity.builder()
                                .description("Created Treatment Plan")
                                .reviewable(treatmentPlanTest001)
                                .actor(studentTest001)
                                .type(ActivityType.CREATED)
                                .build();

                activityRepository.save(activityTest001);

                Activity activityTest002 = Activity.builder()
                                .description("Created Pre Procedure")
                                .reviewable(preProcedureTest001)
                                .actor(studentTest001)
                                .type(ActivityType.CREATED)
                                .build();

                activityRepository.save(activityTest002);

                Review reviewTest001 = Review.builder()
                                .comments("Looks good to me")
                                .reviewStatus(ReviewStatus.APPROVED)
                                .grade(5)
                                .supervisor(supervisorTest001)
                                .build();

                treatmentPlanTest001.addReview(reviewTest001);
                treatmentPlanRepository.save(treatmentPlanTest001);

                logger.info("Dev data loaded successfully");
        }
}

ALTER TABLE attachments
    ADD filetype VARCHAR(255);

ALTER TABLE attachments
    ADD objectKey VARCHAR(255);

ALTER TABLE attachments
    ADD patient_id BIGINT;

ALTER TABLE attachments
    ADD CONSTRAINT FK_ATTACHMENTS_ON_PATIENT FOREIGN KEY (patient_id) REFERENCES patients (id);
ALTER TABLE anamneses
    ADD COLUMN main_complaint TEXT,
    ADD COLUMN history_of_present_illness TEXT,
    ADD COLUMN antecedents TEXT;

ALTER TABLE reviewables
    ALTER COLUMN notes TYPE TEXT;

ALTER TABLE procedures
    ALTER COLUMN diagnostic TYPE TEXT;

ALTER TABLE anamneses
    ALTER COLUMN notes TYPE TEXT;
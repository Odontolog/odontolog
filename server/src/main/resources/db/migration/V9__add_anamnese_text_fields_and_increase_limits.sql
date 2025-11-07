ALTER TABLE anamneses
    ADD COLUMN main_complaint TEXT DEFAULT '' NOT NULL,
    ADD COLUMN history_of_present_illness TEXT DEFAULT '' NOT NULL,
    ADD COLUMN antecedents TEXT DEFAULT '' NOT NULL;

UPDATE anamneses
SET
    main_complaint = COALESCE(main_complaint, ''),
    history_of_present_illness = COALESCE(history_of_present_illness, ''),
    antecedents = COALESCE(antecedents, '');

ALTER TABLE reviewables
    ALTER COLUMN notes TYPE TEXT;

ALTER TABLE procedures
    ALTER COLUMN diagnostic TYPE TEXT;

ALTER TABLE anamneses
    ALTER COLUMN notes TYPE TEXT;
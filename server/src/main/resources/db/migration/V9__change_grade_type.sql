ALTER TABLE reviews
    ALTER COLUMN grade TYPE numeric USING grade::numeric;
ALTER TABLE reviews
    ALTER COLUMN grade TYPE float8 USING grade::float8;
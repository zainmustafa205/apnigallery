-- Postgres sequence for generating sequential order numbers
-- Used at application level: SELECT nextval('order_number_seq')
-- Format applied in app code: ORD-<year>-<padded-sequence-number>
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;
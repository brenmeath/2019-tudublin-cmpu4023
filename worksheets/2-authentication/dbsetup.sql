DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

CREATE EXTENSION pgcrypto;

CREATE TABLE users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE products (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    price TEXT NOT NULL
);


-- allow faster queries during a login procedure
CREATE UNIQUE INDEX lower_email_idx on users ((lower(email)));

-- example of user creation
INSERT INTO users (email, password) VALUES
    ('john@example.com', crypt('sesame', gen_salt('bf', 8)));

INSERT INTO products (title, price) VALUES
	('cheddar block 400g',  3.00),
	('cheddar slices 400g',  3.20),
	('butter 454g', 3.30),
	('wholemeal sliced pan', 1.45),
	('full-fat milk 1L', 0.75),
	('full-fat milk 2L', 1.49),
	('full-fat milk 2L', 1.49),
    ('minced beef 500g', 2.50),
    ('organic minced beef 500g', 3.50),
    ('organic minced beef 500g', 3.50),
    ('hummus 150g', 2.99),
    ('free range eggs dozen', 2.50),
    ('chicken breast 1kg', 8.25),
    ('chicken breast 500g', 4.50),
    ('rooster potatoes 5kg', 6.00),
    ('basmati rice 1kg', 1.50),
    ('cous cous 500g', 1.25),
    ('carrots 2kg', 0.99),
    ('battered cod 500g', 2.00),
    ('marmalade', 1.40);

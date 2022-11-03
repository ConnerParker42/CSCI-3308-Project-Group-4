Drop TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(60) UNIQUE NOT NULL,
    password VARCHAR(60) NOT NULL
);

INSERT INTO users (username, password) values ('testusername', 'testpassword');
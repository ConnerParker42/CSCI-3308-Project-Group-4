DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    username VARCHAR(60) PRIMARY KEY,
    email    VARCHAR(60) NOT NULL,
    password VARCHAR(60) NOT NULL
);

INSERT INTO users (username, email, password) VALUES ('test', 'test@us.er', '$2b$10$xrI.RP712FOIU6GhZbeE3OBHhOzgudLOoHFfAAVf48oCiesPBhDdC');

DROP TABLE IF EXISTS contacts;
CREATE TABLE contacts (
    sender_username VARCHAR(60) REFERENCES users (username) ON DELETE CASCADE,
    recipient_username VARCHAR(60) REFERENCES users (username) ON DELETE CASCADE,
    CONSTRAINT contact_pk PRIMARY KEY (sender_username, recipient_username)
);
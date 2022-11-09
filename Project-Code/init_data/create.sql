DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    username VARCHAR(60) PRIMARY KEY,
    email    VARCHAR(60) NOT NULL,
    password VARCHAR(60) NOT NULL
);

INSERT INTO users (username, email, password) VALUES ('test', 'test@us.er', '$2b$10$xrI.RP712FOIU6GhZbeE3OBHhOzgudLOoHFfAAVf48oCiesPBhDdC');
INSERT INTO users (username, email, password) VALUES ('test2', 'test2@us.er', '$2b$10$dafscx05GP3oN6Nkh2GuNOY51.aPR1EZHzw5IlE6MA4uSl/AAO4qK');

DROP TABLE IF EXISTS messages CASCADE;
CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    message_text TEXT NOT NULL
);

DROP TABLE IF EXISTS sends;
CREATE TABLE sends (
    username VARCHAR(60) NOT NULL REFERENCES users (username) ON DELETE CASCADE,
    message_id INTEGER NOT NULL REFERENCES messages (message_id) ON DELETE CASCADE,
    CONSTRAINT sends_pk PRIMARY KEY (username, message_id)
);

DROP TABLE IF EXISTS recieves;
CREATE TABLE recieves (
    username VARCHAR(60) NOT NULL REFERENCES users (username) ON DELETE CASCADE,
    message_id INTEGER NOT NULL REFERENCES messages (message_id) ON DELETE CASCADE,
    CONSTRAINT recieves_pk PRIMARY KEY (username, message_id)
);

INSERT INTO messages (message_text) values ('Hello there');
INSERT INTO sends (username, message_id) values ('test', 1);
INSERT INTO recieves (username, message_id) values ('test2', 1);

INSERT INTO messages (message_text) values ('Heres the reply');
INSERT INTO sends (username, message_id) values ('test2', 2);
INSERT INTO recieves (username, message_id) values ('test1', 2);

DROP TABLE IF EXISTS contacts;
CREATE TABLE contacts (
    sender_username VARCHAR(60) REFERENCES users (username) ON DELETE CASCADE,
    recipient_username VARCHAR(60) REFERENCES users (username) ON DELETE CASCADE,
    CONSTRAINT contact_pk PRIMARY KEY (sender_username, recipient_username)
);

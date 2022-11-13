DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    username VARCHAR(60) PRIMARY KEY,
    email    VARCHAR(60) NOT NULL,
    password VARCHAR(60) NOT NULL
);

DROP TABLE IF EXISTS messages CASCADE;
CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    message_text TEXT NOT NULL,
    sender_username TEXT NOT NULL REFERENCES users (username) ON DELETE CASCADE,
    receiver_username TEXT NOT NULL REFERENCES users (username) ON DELETE CASCADE
);

DROP TABLE IF EXISTS contacts;
CREATE TABLE contacts (
    sender_username VARCHAR(60) REFERENCES users (username) ON DELETE CASCADE,
    recipient_username VARCHAR(60) REFERENCES users (username) ON DELETE CASCADE,
    CONSTRAINT contact_pk PRIMARY KEY (sender_username, recipient_username)
);

INSERT INTO users (username, email, password) VALUES ('test', 'test@us.er', '$2b$10$xrI.RP712FOIU6GhZbeE3OBHhOzgudLOoHFfAAVf48oCiesPBhDdC');
INSERT INTO users (username, email, password) VALUES ('test2', 'test2@us.er', '$2b$10$dafscx05GP3oN6Nkh2GuNOY51.aPR1EZHzw5IlE6MA4uSl/AAO4qK');

INSERT INTO messages (message_text, sender_username, receiver_username) values ('Hello there', 'test', 'test2');
INSERT INTO messages (message_text, sender_username, receiver_username) values ('Heres the reply', 'test2', 'test');

INSERT INTO contacts (sender_username, recipient_username) VALUES ('test', 'test2'),
                                                                  ('test2', 'test');

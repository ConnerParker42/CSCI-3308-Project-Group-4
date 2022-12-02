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
    receiver_username TEXT NOT NULL REFERENCES users (username) ON DELETE CASCADE,
    sent_timestamp TIMESTAMP
);

DROP TABLE IF EXISTS contacts;
CREATE TABLE contacts (
    sender_username VARCHAR(60) REFERENCES users (username) ON DELETE CASCADE,
    recipient_username VARCHAR(60) REFERENCES users (username) ON DELETE CASCADE,
    CONSTRAINT contact_pk PRIMARY KEY (sender_username, recipient_username)
);

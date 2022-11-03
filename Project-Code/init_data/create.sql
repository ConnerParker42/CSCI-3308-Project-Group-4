DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    username VARCHAR(60) PRIMARY KEY,
    email    VARCHAR(60) NOT NULL,
    password VARCHAR(60) NOT NULL
);

INSERT INTO users (username, email, password) VALUES ('test', 'test@us.er', '$2b$10$xrI.RP712FOIU6GhZbeE3OBHhOzgudLOoHFfAAVf48oCiesPBhDdC');

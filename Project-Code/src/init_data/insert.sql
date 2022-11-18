INSERT INTO users (username, email, password) VALUES ('test', 'test@us.er', '$2b$10$xrI.RP712FOIU6GhZbeE3OBHhOzgudLOoHFfAAVf48oCiesPBhDdC'),
                                                     ('Alice', 'Alice@gmail.com', '$2b$10$/LF484qu3NToP3Lmd6xUN.FcLfg4oxmi9UU7j/VV2yExqJ4BXrIjK'),
                                                     ('Bob', 'Bob@gmail.com', '$2b$10$JHZWQjeuzpaOGY8.lIiYFuCqJ5l5fBhQ7Oaq85W7xcXC852kJMUuG'),
                                                     ('Carol', 'Carol@gmail.com', '$2b$10$FqA14e3P/qltwViuA.NeOOl/TV.6mfjDCunimoxC1ZsDyllZi8fCW'),
                                                     ('Dan', 'Dan@gmail.com', '$2b$10$Nj89is.WIDQGiTpegbSD6OQhHTpkgfyJWUslaxkZQsU70jsFUycMa');
                                                     

INSERT INTO messages (message_text, sender_username, receiver_username, sent_timestamp) values ('Hello Alice!', 'Bob', 'Alice', current_timestamp),
                                                                                               ('Hello Bob!', 'Alice', 'Bob', current_timestamp),
                                                                                               ('Hello Carol, this is Alice! I know Bob.', 'Alice', 'Carol', current_timestamp),
                                                                                               ('Hello Alice! I also know Bob!', 'Carol', 'Alice', current_timestamp),
                                                                                               ('Hi Bob, I think we both know Alice?', 'Carol', 'Bob', current_timestamp),
                                                                                               ('I think we do!', 'Bob', 'Carol', current_timestamp),
                                                                                               ('Hey Dan, do you know Bob?', 'Carol', 'Dan', current_timestamp),
                                                                                               ('Hi Carol, I do not know Bob. What is his username?', 'Dan', 'Carol', current_timestamp),
                                                                                               ('His username is Bob', 'Carol', 'Dan', current_timestamp);

INSERT INTO contacts (sender_username, recipient_username) VALUES ('Bob', 'Alice'),
                                                                  ('Alice', 'Bob'),
                                                                  ('Alice', 'Carol'),
                                                                  ('Carol', 'Alice'),
                                                                  ('Carol', 'Bob'),
                                                                  ('Bob', 'Carol'),
                                                                  ('Carol', 'Dan'),
                                                                  ('Dan', 'Carol');
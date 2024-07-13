CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author VARCHAR(255),
    url VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    likes INTEGER DEFAULT 0
);

''' Pari blogia kantaan '''

INSERT INTO blogs (author, url, title, likes)
VALUES ('Jouni M', 'http://example.com', 'Uusi hieno blogi-postaus', 0);

INSERT INTO blogs (author, url, title, likes)
VALUES ('Jouni M', 'http://example.com', 'Toinen hieno blogi-postaus', 5);
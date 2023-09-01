CREATE TABLE mentors (
    username VARCHAR(30) PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL,
    password VARCHAR(30) NOT NULL,
    private_key TEXT,
    public_key TEXT
)
DROP DATABASE IF EXISTS project_management;

CREATE DATABASE project_management;
USE project_management;

CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL
);

CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    user_username VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_username) REFERENCES users(username)
);

INSERT INTO users (username, email, password_hash, role) VALUES
('admin_user', 'admin@example.com', '$2b$10$adminpasswordhash', 'admin'),
('john_doe', 'john@example.com', '$2b$10$userpasswordhash1', 'user'),
('jane_smith', 'jane@example.com', '$2b$10$userpasswordhash2', 'user'),
('bob_brown', 'bob@example.com', '$2b$10$userpasswordhash3', 'user'),
('alice_white', 'alice@example.com', '$2b$10$userpasswordhash4', 'user');

INSERT INTO projects (name, description, user_username) VALUES
('Project A', 'Description of Project A', 'john_doe'),
('Project B', 'Description of Project B', 'john_doe'),
('Project C', 'Description of Project C', 'jane_smith'),
('Project D', 'Description of Project D', 'jane_smith'),
('Project E', 'Description of Project E', 'jane_smith'),
('Project F', 'Description of Project F', 'bob_brown'),
('Project G', 'Description of Project G', 'bob_brown'),
('Project H', 'Description of Project H', 'bob_brown'),
('Project I', 'Description of Project I', 'bob_brown'),
('Project J', 'Description of Project J', 'alice_white'),
('Project K', 'Description of Project K', 'alice_white'),
('Project L', 'Description of Project L', 'alice_white'),
('Project M', 'Description of Project M', 'john_doe'),
('Project N', 'Description of Project N', 'john_doe'),
('Project O', 'Description of Project O', 'john_doe'),
('Project P', 'Description of Project P', 'jane_smith'),
('Project Q', 'Description of Project Q', 'jane_smith'),
('Project R', 'Description of Project R', 'jane_smith'),
('Project S', 'Description of Project S', 'bob_brown'),
('Project T', 'Description of Project T', 'bob_brown'),
('Project U', 'Description of Project U', 'bob_brown'),
('Project V', 'Description of Project V', 'bob_brown'),
('Project W', 'Description of Project W', 'alice_white'),
('Project X', 'Description of Project X', 'alice_white'),
('Project Y', 'Description of Project Y', 'alice_white'),
('Project Z', 'Description of Project Z', 'alice_white'),
('Project AA', 'Description of Project AA', 'john_doe'),
('Project AB', 'Description of Project AB', 'john_doe'),
('Project AC', 'Description of Project AC', 'jane_smith'),
('Project AD', 'Description of Project AD', 'jane_smith'),
('Project AE', 'Description of Project AE', 'jane_smith'),
('Project AF', 'Description of Project AF', 'bob_brown'),
('Project AG', 'Description of Project AG', 'bob_brown'),
('Project AH', 'Description of Project AH', 'bob_brown'),
('Project AI', 'Description of Project AI', 'bob_brown'),
('Project AJ', 'Description of Project AJ', 'alice_white'),
('Project AK', 'Description of Project AK', 'alice_white'),
('Project AL', 'Description of Project AL', 'alice_white'),
('Project AM', 'Description of Project AM', 'alice_white'),
('Project AN', 'Description of Project AN', 'john_doe'),
('Project AO', 'Description of Project AO', 'john_doe'),
('Project AP', 'Description of Project AP', 'john_doe'),
('Project AQ', 'Description of Project AQ', 'jane_smith'),
('Project AR', 'Description of Project AR', 'jane_smith'),
('Project AS', 'Description of Project AS', 'jane_smith'),
('Project AT', 'Description of Project AT', 'bob_brown'),
('Project AU', 'Description of Project AU', 'bob_brown'),
('Project AV', 'Description of Project AV', 'bob_brown'),
('Project AW', 'Description of Project AW', 'bob_brown');

CREATE TABLE roadmap (
    id int PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- 'feature', 'goal', or 'milestone'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL, -- e.g., 'to do', 'in-progress', 'completed'
    vote int DEFAULT 0,
    target_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE upvotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    roadmap_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_email_roadmap (user_id, roadmap_id)
);

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roadmap_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_comment_id INT DEFAULT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (roadmap_id) REFERENCES roadmap(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (parent_comment_id) REFERENCES comments(id)
);
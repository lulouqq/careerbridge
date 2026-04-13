DROP DATABASE IF EXISTS careerbridge_db;
CREATE DATABASE careerbridge_db;
USE careerbridge_db;

CREATE TABLE students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100),
  university VARCHAR(100),
  skills TEXT,
  resume VARCHAR(255)
);

CREATE TABLE companies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100),
  description TEXT
);

CREATE TABLE internships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    location VARCHAR(255),
    duration VARCHAR(100),
    posted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  internship_id INT,
  status ENUM('Pending', 'Accepted', 'Rejected') DEFAULT 'Pending',
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE
);


select * from students;
select * from companies;
select * from internships;
select * from applications;
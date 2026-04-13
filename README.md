# CareerBridge

CareerBridge is a web-based Internship Management System developed as part of the CSIT128 Assignment 2 at the University of Wollongong in Dubai. It connects students looking for internships with companies offering opportunities.

## Project Overview

This project allows two types of users:

* Students: Can register, log in, create and edit profiles, browse internships, apply for them, and track application status.
* Companies: Can register, log in, post internship listings, view and manage student applications, and update their account information.

## Key Features

Student Side:

* Student registration and login
* Profile editing (name, email, university, skills, password)
* Resume upload
* Internship search and filtering
* Application submission and status tracking

Company Side:

* Company registration and login
* Internship creation, editing, and deletion
* Viewing and managing student applications
* Changing application status (Pending, Accepted, Rejected)
* Company profile editing

## Technologies Used

* Frontend: HTML5, CSS3, JavaScript
* Backend: Node.js with Express.js
* Database: MySQL
* File Uploads: Multer
* Middleware: Body-parser
* Security: (bcrypt planned for future) + basic validation

## Database Structure

* students: ID, name, email, password, university, skills, resume
* companies: ID, name, email, password, description
* internships: ID, company\_id, title, description, requirements, location, duration, posted\_at
* applications: ID, student\_id, internship\_id, status (Pending / Accepted / Rejected)

All tables are connected with foreign keys and use ON DELETE CASCADE for referential integrity.

## How to Run

1. Install Node.js and MySQL if not already installed.
2. Clone this repository or extract the ZIP file.
3. Set up the database:

   * Open MySQL
   * Run the provided .sql script to create the database and tables.
4. Install project dependencies:
   npm install
5. Start the server:
   node server.js
6. Open your browser and go to:
   [http://localhost:8080](http://localhost:8080)

## Team Members

* Nikita Veliev — Developer (CSS, HTML, full-stack support)
* Ivan Odnolov — Developer (JavaScript, Node.js, SQL, HTML)
* Feliks Gumennyy — Developer, Report & Presentation Lead

## Notes

* This project was developed for academic purposes.
* Some entries in the database are test values and meant for demonstration.
* Passwords are currently stored in plaintext (bcrypt integration is planned).

## Contact

For any questions or feedback, please reach out via university communication channels.
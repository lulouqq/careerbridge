# 🚀 CareerBridge

CareerBridge is a full-stack internship management platform that connects students with companies offering internship opportunities.

It allows students to apply for internships and track their applications, while companies can post positions and manage candidates.

---

## 🧩 Features

### 👨‍🎓 Student Side
- Registration and login
- Profile creation and editing
- Resume upload
- Internship search and filtering
- Application submission
- Application status tracking

### 🏢 Company Side
- Registration and login
- Create, edit, and delete internship listings
- View and manage student applications
- Update application status (Pending / Accepted / Rejected)
- Company profile management

---

## 🛠 Tech Stack

**Frontend**
- HTML5
- CSS3
- JavaScript

**Backend**
- Node.js
- Express.js

**Database**
- MySQL

**Other Tools**
- Multer (file uploads)
- Git & GitHub

---

## 🏗 Architecture

Frontend → Express Server → MySQL Database

- Client-side pages handle UI and user interaction
- Express.js handles routing, authentication, and business logic
- MySQL stores users, internships, and applications

---

## ⚙️ How to Run

1. Install dependencies:
npm install

2. Start the server:
node server.js

Open in browser:
http://localhost:8080

---

## 🗄 Database

The system includes the following core tables:
- students
- companies
- internships
- applications

All relationships are managed using foreign keys with cascade deletion.

---

## 🔐 Security

- Passwords are hashed using bcrypt
- Basic validation implemented for forms and user input

---

## 📂 Project Structure
```
careerbridge/
├── public/        # CSS, JS, images
├── views/         # HTML pages
├── database/      # SQL scripts
├── server.js      # main server
├── package.json
```
---

## 👥 Team

- Nikita Veliev — Full-stack development, Backend logic, database, Node.js, integration
- Ivan Odnolov —  Frontend development, database, JS

---

## 📌 Notes

- This project was developed as part of a university assignment
- Some data is for demonstration purposes only
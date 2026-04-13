// Importing required libraries (modules)
const express = require('express');           // Web framework for building the server
const bodyParser = require('body-parser');   // Helps parse data from HTML forms
const path = require('path');                // Helps manage file paths
const mysql = require('mysql2');             // MySQL library for connecting to the database
const bcrypt = require('bcrypt');            // Library to securely hash passwords
const multer = require('multer');            // Handles file uploads (e.g. resumes)

// Create an Express app
const app = express();

// Define the port where the server will run
const port = 8080;

// Set up MySQL connection details
const db = mysql.createConnection({
    host: 'localhost',             // Database server location (localhost = this computer)
    user: 'root',                  // Username to access the database
    password: '12345678',          // Password for the database user
    database: 'careerbridge_db'    // Name of the database we want to connect to
});

// Try to connect to the database
db.connect((err) => {
    if (err) {
        // Show an error if the connection fails
        console.error('❌ MySQL Database connection error:', err);
    } else {
        // Confirm success if the connection works
        console.log('✅ MySQL database successfully connected');
    }
});

// Configure how uploaded files (like resumes) will be stored
const storage = multer.diskStorage({
    // Folder where files will be saved
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    // Set unique file name: timestamp + random number + original file extension
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Create multer instance with the storage settings
const upload = multer({ storage: storage });

// Middleware to handle form submissions and JSON data
app.use(bodyParser.urlencoded({ extended: true })); // For form data (e.g. from <form>)
app.use(express.json());                            // For JSON data (e.g. from fetch requests)
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files (HTML, CSS, JS)

// ROUTES — send HTML files to the user when they visit specific URLs

// Homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Login pages
app.get('/student_login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'student_login.html'));
});
app.get('/company_login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'company_login.html'));
});

// Signup pages
app.get('/student_signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'student_signup.html'));
});
app.get('/company_signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'company_signup.html'));
});

// Dashboard pages (after logging in)
app.get('/student_dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'student_dashboard.html'));
});
app.get('/company_dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'company_dashboard.html'));
});

// Profile pages
app.get('/student_profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'student_profile.html'));
});
app.get('/company_profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'company_profile.html'));
});

// Internships-related pages
app.get('/company_internships', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'company_internships.html'));
});
app.get('/internships_list', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'internships_list.html'));
});

// Handle student registration with resume upload
app.post('/register-student', upload.single('resume'), (req, res) => {
    const { name, email, password, university, skills } = req.body;

    // If a resume file was uploaded, get its filename
    const resumePath = req.file ? req.file.filename : null;

    const saltRounds = 10;

    // Hash the password before saving to the database
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            console.error('❌ Error hashing password:', err);
            return res.redirect('/student_signup?error=Server error');
        }

        // Insert the new student into the database
        const sql = 'INSERT INTO students (name, email, password, university, skills, resume) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [name, email, hashedPassword, university, skills, resumePath];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('❌ Student registration error:', err);
                // If email already exists
                if (err.code === 'ER_DUP_ENTRY') {
                    res.redirect('/student_signup?error=Email already registered');
                } else {
                    res.redirect('/student_signup?error=Something went wrong. Try again.');
                }
            } else {
                console.log('✅ Student registered (with hashed password):', result.insertId);
                res.redirect('/student_login?success=Account created! Please log in.');
            }
        });
    });
});

// Handle company registration
app.post('/register-company', (req, res) => {
    const { name, email, password, description } = req.body;

    const saltRounds = 10;

    // Hash the password before saving
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            console.error('❌ Error hashing password:', err);
            return res.redirect('/company_signup?error=Server error');
        }

        const sql = 'INSERT INTO companies (name, email, password, description) VALUES (?, ?, ?, ?)';
        const values = [name, email, hashedPassword, description];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('❌ Company registration error:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    res.redirect('/company_signup?error=Email already registered');
                } else {
                    res.redirect('/company_signup?error=Something went wrong. Try again.');
                };
            } else {
                console.log('✅ Company registered:', result.insertId);
                res.redirect('/company_login?success=Account created! Please log in.');
            }
        });
    });
});

// Handle student login
app.post('/login-student', (req, res) => {
    const { email, password } = req.body;

    // Look for a student by email
    const sql = 'SELECT * FROM students WHERE email = ?';
    db.query(sql, [email], (err, result) => {
        if (err) {
            console.error('❌ Student login error:', err);
            return res.send('Login error.');
        }

        // If no student is found
        if (result.length === 0) {
            console.warn('❌ No student found with that email');
            return res.redirect('/student_login?error=Email%20or%20password%20incorrect');
        }

        const user = result[0];

        // Compare entered password with the hashed one in DB
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
                console.warn('❌ Password does not match');
                return res.redirect('/student_login?error=Email%20or%20password%20incorrect');
            }

            console.log('✅ Student logged in:', user.id);

            // Redirect to student dashboard with query parameters
            res.redirect('/student_dashboard?name=' + encodeURIComponent(user.name) +
                '&email=' + encodeURIComponent(user.email) +
                '&university=' + encodeURIComponent(user.university) +
                '&skills=' + encodeURIComponent(user.skills) +
                '&id=' + encodeURIComponent(user.id));
        });
    });
});

// Handle company login
app.post('/login-company', (req, res) => {
    const { email, password } = req.body;

    // Look for a company by email
    const sql = 'SELECT * FROM companies WHERE email = ?';
    db.query(sql, [email], (err, result) => {
        if (err) {
            console.error('❌ Company login error:', err);
            return res.send('Login error.');
        }

        // If no company is found
        if (result.length === 0) {
            console.warn('❌ No company found with that email');
            return res.redirect('/company_login?error=Email%20or%20password%20incorrect');
        }

        const user = result[0];

        // Compare entered password with hashed one in DB
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
                console.warn('❌ Password mismatch');
                return res.redirect('/company_login?error=Email%20or%20password%20incorrect');
            }

            console.log('✅ Company logged in:', user.id);

            // Redirect to company dashboard with query parameters
            res.redirect('/company_dashboard?name=' + encodeURIComponent(user.name) +
                '&email=' + encodeURIComponent(user.email) +
                '&description=' + encodeURIComponent(user.description) +
                '&id=' + encodeURIComponent(user.id));
        });
    });
});

// Update company name
app.post('/update-company-name', (req, res) => {
    const { id, name } = req.body;

    // SQL query to update the company name by ID
    const sql = 'UPDATE companies SET name = ? WHERE id = ?';
    db.query(sql, [name, id], (err) => {
        if (err) {
            console.error('❌ Error updating company name:', err);
            return res.redirect(`/company_profile?id=${encodeURIComponent(id)}&error=Could not update name`);
        }

        // After update, fetch the latest data to refresh the profile view
        db.query('SELECT * FROM companies WHERE id = ?', [id], (err2, result) => {
            if (err2 || result.length === 0) {
                return res.redirect(`/company_profile?id=${encodeURIComponent(id)}&error=Failed to reload updated data`);
            }
            const company = result[0];
            res.redirect(`/company_profile?id=${company.id}&name=${encodeURIComponent(company.name)}&email=${encodeURIComponent(company.email)}&description=${encodeURIComponent(company.description)}&success=Name updated`);
        });
    });
});

// Update company email
app.post('/update-company-email', (req, res) => {
    const { id, email } = req.body;

    const sql = 'UPDATE companies SET email = ? WHERE id = ?';
    db.query(sql, [email, id], (err) => {
        if (err) {
            console.error('❌ Error updating company email:', err);
            return res.redirect(`/company_profile?id=${encodeURIComponent(id)}&error=Could not update email`);
        }

        db.query('SELECT * FROM companies WHERE id = ?', [id], (err2, result) => {
            if (err2 || result.length === 0) {
                return res.redirect(`/company_profile?id=${encodeURIComponent(id)}&error=Failed to reload updated data`);
            }
            const company = result[0];
            res.redirect(`/company_profile?id=${company.id}&name=${encodeURIComponent(company.name)}&email=${encodeURIComponent(company.email)}&description=${encodeURIComponent(company.description)}&success=Email updated`);
        });
    });
});

// Update company description
app.post('/update-company-description', (req, res) => {
    const { id, description } = req.body;

    const sql = 'UPDATE companies SET description = ? WHERE id = ?';
    db.query(sql, [description, id], (err) => {
        if (err) {
            console.error('❌ Error updating company description:', err);
            return res.redirect(`/company_profile?id=${encodeURIComponent(id)}&error=Could not update description`);
        }

        db.query('SELECT * FROM companies WHERE id = ?', [id], (err2, result) => {
            if (err2 || result.length === 0) {
                return res.redirect(`/company_profile?id=${encodeURIComponent(id)}&error=Failed to reload updated data`);
            }
            const company = result[0];
            res.redirect(`/company_profile?id=${company.id}&name=${encodeURIComponent(company.name)}&email=${encodeURIComponent(company.email)}&description=${encodeURIComponent(company.description)}&success=Description updated`);
        });
    });
});

// Update company password
app.post('/update-company-password', (req, res) => {
    const { id, password } = req.body;

    const saltRounds = 10;

    // First, hash the new password
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            console.error('❌ Error hashing password:', err);
            return res.redirect(`/company_profile?id=${encodeURIComponent(id)}&error=Could not hash password`);
        }

        // Then, update the password in the database
        const sql = 'UPDATE companies SET password = ? WHERE id = ?';
        db.query(sql, [hashedPassword, id], (err) => {
            if (err) {
                console.error('❌ Error updating company password:', err);
                return res.redirect(`/company_profile?id=${encodeURIComponent(id)}&error=Could not update password`);
            }

            // Reload company data after update
            db.query('SELECT * FROM companies WHERE id = ?', [id], (err2, result) => {
                if (err2 || result.length === 0) {
                    return res.redirect(`/company_profile?id=${encodeURIComponent(id)}&error=Failed to reload updated data`);
                }
                const company = result[0];
                res.redirect(`/company_profile?id=${company.id}&name=${encodeURIComponent(company.name)}&email=${encodeURIComponent(company.email)}&description=${encodeURIComponent(company.description)}&success=Password updated`);
            });
        });
    });
});

// Update student's name
app.post('/update-student-name', (req, res) => {
    const { id, name } = req.body;

    // Update the name of the student with the given ID
    const sql = 'UPDATE students SET name = ? WHERE id = ?';
    db.query(sql, [name, id], (err) => {
        if (err) {
            console.error('Error updating student name:', err);
            return res.redirect(`/student_profile?id=${encodeURIComponent(id)}&error=Could not update name`);
        }

        // After update, fetch the updated student data to reload profile
        db.query('SELECT * FROM students WHERE id = ?', [id], (err2, result) => {
            if (err2 || result.length === 0) {
                return res.redirect(`/student_profile?id=${encodeURIComponent(id)}&error=Failed to reload updated data`);
            }

            const student = result[0];
            // Redirect back to profile page with updated data
            res.redirect(`/student_profile?id=${student.id}&name=${encodeURIComponent(student.name)}&email=${encodeURIComponent(student.email)}&university=${encodeURIComponent(student.university)}&skills=${encodeURIComponent(student.skills)}&success=Name updated`);
        });
    });
});

// Update student's email
app.post('/update-student-email', (req, res) => {
    const { id, email } = req.body;

    const sql = 'UPDATE students SET email = ? WHERE id = ?';
    db.query(sql, [email, id], (err) => {
        if (err) {
            console.error('Error updating student email:', err);
            return res.redirect(`/student_profile?id=${encodeURIComponent(id)}&error=Could not update email`);
        }

        db.query('SELECT * FROM students WHERE id = ?', [id], (err2, result) => {
            if (err2 || result.length === 0) {
                return res.redirect(`/student_profile?id=${encodeURIComponent(id)}&error=Failed to reload updated data`);
            }

            const student = result[0];
            res.redirect(`/student_profile?id=${student.id}&name=${encodeURIComponent(student.name)}&email=${encodeURIComponent(student.email)}&university=${encodeURIComponent(student.university)}&skills=${encodeURIComponent(student.skills)}&success=Email updated`);
        });
    });
});

// Update student's university name
app.post('/update-student-university', (req, res) => {
    const { id, university } = req.body;

    const sql = 'UPDATE students SET university = ? WHERE id = ?';
    db.query(sql, [university, id], (err) => {
        if (err) {
            console.error('Error updating student university:', err);
            return res.redirect(`/student_profile?id=${encodeURIComponent(id)}&error=Could not update university`);
        }

        db.query('SELECT * FROM students WHERE id = ?', [id], (err2, result) => {
            if (err2 || result.length === 0) {
                return res.redirect(`/student_profile?id=${encodeURIComponent(id)}&error=Failed to reload updated data`);
            }

            const student = result[0];
            res.redirect(`/student_profile?id=${student.id}&name=${encodeURIComponent(student.name)}&email=${encodeURIComponent(student.email)}&university=${encodeURIComponent(student.university)}&skills=${encodeURIComponent(student.skills)}&success=University updated`);
        });
    });
});

// Update student's listed skills
app.post('/update-student-skills', (req, res) => {
    const { id, skills } = req.body;

    const sql = 'UPDATE students SET skills = ? WHERE id = ?';
    db.query(sql, [skills, id], (err) => {
        if (err) {
            console.error('Error updating student skills:', err);
            return res.redirect(`/student_profile?id=${encodeURIComponent(id)}&error=Could not update skills`);
        }

        db.query('SELECT * FROM students WHERE id = ?', [id], (err2, result) => {
            if (err2 || result.length === 0) {
                return res.redirect(`/student_profile?id=${encodeURIComponent(id)}&error=Failed to reload updated data`);
            }

            const student = result[0];
            res.redirect(`/student_profile?id=${student.id}&name=${encodeURIComponent(student.name)}&email=${encodeURIComponent(student.email)}&university=${encodeURIComponent(student.university)}&skills=${encodeURIComponent(student.skills)}&success=Skills updated`);
        });
    });
});

// Update student's resume file
app.post('/update-student-resume', upload.single('resume'), (req, res) => {
    const { id } = req.body;

    // Check if a file was actually uploaded
    const resumePath = req.file ? req.file.filename : null;
    if (!resumePath) {
        return res.redirect(`/student_profile?id=${id}&error=No file uploaded`);
    }

    const sql = 'UPDATE students SET resume = ? WHERE id = ?';
    db.query(sql, [resumePath, id], (err) => {
        if (err) {
            console.error('Error updating resume file:', err);
            return res.redirect(`/student_profile?id=${id}&error=Could not update resume`);
        }

        console.log(`Resume updated for student ID ${id}`);
        res.redirect(`/student_profile?id=${id}&success=Resume updated`);
    });
});

// Update student's password (with hashing)
app.post('/update-student-password', (req, res) => {
    const { id, password } = req.body;

    const saltRounds = 10;

    // Hash the new password before saving it
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.redirect(`/student_profile?id=${encodeURIComponent(id)}&error=Could not hash password`);
        }

        const sql = 'UPDATE students SET password = ? WHERE id = ?';
        db.query(sql, [hashedPassword, id], (err) => {
            if (err) {
                console.error('Error updating password:', err);
                return res.redirect(`/student_profile?id=${encodeURIComponent(id)}&error=Could not update password`);
            }

            // Reload updated student data
            db.query('SELECT * FROM students WHERE id = ?', [id], (err2, result) => {
                if (err2 || result.length === 0) {
                    return res.redirect(`/student_profile?id=${encodeURIComponent(id)}&error=Failed to reload updated data`);
                }

                const student = result[0];
                res.redirect(`/student_profile?id=${student.id}&name=${encodeURIComponent(student.name)}&email=${encodeURIComponent(student.email)}&university=${encodeURIComponent(student.university)}&skills=${encodeURIComponent(student.skills)}&success=Password updated`);
            });
        });
    });
});

// Create a new internship offer posted by a company
app.post('/add-internship', (req, res) => {
    // Extract all required fields from the request body
    const { company_id, title, description, requirements, location, duration } = req.body;

    // SQL query to insert a new internship into the internships table
    const sql = `
        INSERT INTO internships (company_id, title, description, requirements, location, duration)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [company_id, title, description, requirements, location, duration];

    // Execute the query
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error adding internship:', err);

            // If insertion fails, redirect back to the internships page with an error message
            res.redirect(`/company_internships?id=${company_id}&name=${encodeURIComponent(req.body.c_name)}&email=${encodeURIComponent(req.body.c_email)}&description=${encodeURIComponent(req.body.c_description)}&error=Could not post internship`);
        } else {
            console.log('Internship added. ID:', result.insertId);

            // On success, redirect back with a success message
            res.redirect(`/company_internships?id=${company_id}&name=${encodeURIComponent(req.body.c_name)}&email=${encodeURIComponent(req.body.c_email)}&description=${encodeURIComponent(req.body.c_description)}&success=Internship posted`);
        }
    });
});

// Get all internships posted by a specific company (used on company dashboard)
app.get('/company-internships-data', (req, res) => {
    // Get the company ID from the query string (e.g., ?id=2)
    const companyId = req.query.id;

    // Query to select all internships for that company
    const sql = 'SELECT * FROM internships WHERE company_id = ?';

    db.query(sql, [companyId], (err, results) => {
        if (err) {
            console.error('Error fetching internships:', err);

            // Return JSON error if something goes wrong
            res.status(500).json({ error: 'Error fetching data' });
        } else {
            // Return all internship records as JSON
            res.json(results);
        }
    });
});

// Update the status of an application (e.g. Accepted, Rejected)
app.post('/update-application-status', (req, res) => {
    const { application_id, status } = req.body;

    // SQL query to update application status by ID
    const sql = 'UPDATE applications SET status = ? WHERE id = ?';

    db.query(sql, [status, application_id], (err, result) => {
        if (err) {
            console.error('Error updating application status:', err);

            // Return error if update fails
            res.status(500).json({ error: 'Failed to update status' });
        } else {
            // Return success message as JSON
            res.json({ success: 'Status updated' });
        }
    });
});

// Delete an internship by ID
app.post('/delete-internship', (req, res) => {
    // Extract internship ID and company details from request body
    const { internship_id, company_id, name, email, description } = req.body;

    // SQL query to delete internship by its ID
    const sql = 'DELETE FROM internships WHERE id = ?';

    db.query(sql, [internship_id], (err) => {
        if (err) {
            console.error('Error deleting internship:', err);

            // Redirect with an error message if deletion fails
            return res.redirect(`/company_internships?id=${encodeURIComponent(company_id)}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&description=${encodeURIComponent(description)}&error=Could not delete internship`);
        }

        console.log(`Internship ID ${internship_id} deleted successfully`);

        // Redirect with success message after successful deletion
        res.redirect(`/company_internships?id=${encodeURIComponent(company_id)}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&description=${encodeURIComponent(description)}&success=Internship deleted`);
    });
});

// Student applies for an internship
app.post('/apply', (req, res) => {
    const { student_id, internship_id } = req.body;

    // Prepare SQL to insert a new application with status set to "pending"
    const sql = 'INSERT INTO applications (student_id, internship_id, status) VALUES (?, ?, ?)';

    db.query(sql, [student_id, internship_id, 'pending'], (err, result) => {
        if (err) {
            console.error('Error applying to internship:', err);

            // If the student already applied (duplicate entry), send a specific error
            if (err.code === 'ER_DUP_ENTRY') {
                res.json({ error: 'You have already applied for this internship' });
            } else {
                // Generic failure response
                res.json({ error: 'Application failed' });
            }
        } else {
            // If successful, return confirmation message
            res.json({ success: 'Application submitted successfully!' });
        }
    });
});

// Get list of all available internships (for students)
app.get('/internships', (req, res) => {
    // This query returns internships and includes the company name for each one
    const sql = `
        SELECT internships.*, companies.name AS company
        FROM internships
        JOIN companies ON internships.company_id = companies.id
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching internships with companies:', err);

            // Return JSON error if something goes wrong
            res.status(500).json({ error: 'Failed to load internships' });
        } else {
            // Return full list of internships with company info
            res.json(result);
        }
    });
});

// Get all applications submitted by a specific student
app.get('/student-applications', (req, res) => {
    const studentId = req.query.id; // Student ID is passed via query string (?id=123)

    // Join applications with internship and company data
    const sql = `
      SELECT 
        internships.title,
        companies.name AS company,
        companies.email AS company_email,
        applications.status
      FROM applications
      JOIN internships ON applications.internship_id = internships.id
      JOIN companies ON internships.company_id = companies.id
      WHERE applications.student_id = ?
    `;

    db.query(sql, [studentId], (err, results) => {
        if (err) {
            console.error('Error fetching student applications:', err);

            // Send error if something fails in the query
            res.status(500).json({ error: 'Database error' });
        } else {
            // Send back the student's applications with relevant data
            res.json(results);
        }
    });
});

// Get all applications submitted for a company's internships
app.get('/company-applications', (req, res) => {
    const companyId = req.query.id; // Company ID comes from the URL query string

    // Query the database to get:
    // - application details (ID and status)
    // - information about the student who applied (name, email, skills, resume)
    // - the title of the internship they applied for
    // Only applications for internships posted by this company will be returned
    const sql = `
      SELECT 
        applications.id AS application_id,
        applications.status,
        students.name AS student_name,
        students.email AS student_email,
        students.skills AS student_skills,
        students.resume AS student_resume,
        internships.title AS internship_title
      FROM applications
      JOIN students ON applications.student_id = students.id
      JOIN internships ON applications.internship_id = internships.id
      WHERE internships.company_id = ?
    `;

    // Execute the query with the provided company ID
    db.query(sql, [companyId], (err, results) => {
        if (err) {
            console.error('Error fetching company applications:', err);

            // If an error occurs during the query, return an error response
            res.status(500).json({ error: 'Database error' });
        } else {
            // On success, return the list of applications as JSON
            res.json(results);
        }
    });
});

// Serve uploaded resume files publicly from the "uploads" directory
// These files become accessible through URLs like: /uploads/filename.pdf
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the Express server and listen for incoming requests on the specified port
app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
});
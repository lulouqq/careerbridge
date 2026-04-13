// Get all the URL parameters from the address bar (e.g., ?id=1&name=Nick&email=example@mail.com...)
const params = new URLSearchParams(window.location.search);

// Extract values from URL parameters
const id = params.get('id');
const s_name = params.get('name');
const email = params.get('email');
const university = params.get('university');
const skills = params.get('skills');

// If name is available, update display and form fields
if (s_name) {
    document.getElementById('display-name').innerText = s_name;
    document.getElementById('edit-name-input').value = s_name;
    document.getElementById('name-id').value = id;
}

// If email is available, update display and form fields
if (email) {
    document.getElementById('display-email').innerText = email;
    document.getElementById('edit-email-input').value = email;
    document.getElementById('email-id').value = id;
}

// If university is available, update display and form fields
if (university) {
    document.getElementById('display-university').innerText = university;
    document.getElementById('edit-university-input').value = university;
    document.getElementById('university-id').value = id;
}

// If skills are available, update display and form fields
if (skills) {
    document.getElementById('display-skills').innerText = skills;
    document.getElementById('edit-skills-input').value = skills;
    document.getElementById('skills-id').value = id;
}

// Set the student ID for password and resume update forms
if (id) {
    document.getElementById('password-id').value = id;
    document.getElementById('resume-id').value = id;
}

// Show a success or error message if available in the URL
const success = params.get('success');
const error = params.get('error');
const messageBox = document.getElementById('message-box');
if (success) {
    messageBox.innerHTML = `<p style="color: green;">✅ ${decodeURIComponent(success)}</p>`;
} else if (error) {
    messageBox.innerHTML = `<p style="color: red;">❌ ${decodeURIComponent(error)}</p>`;
}

// Function to show/hide the edit form for a specific field
function toggleEdit(field) {
    const section = document.getElementById(`edit-${field}-section`);
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

// Generate a link back to the student dashboard with the same URL parameters
const dashboardLink = `/student_dashboard?id=${encodeURIComponent(id)}&name=${encodeURIComponent(s_name)}&email=${encodeURIComponent(email)}&university=${encodeURIComponent(university)}&skills=${encodeURIComponent(skills)}`;

// Set the href for the "Back to Dashboard" link
document.getElementById('back_to_dashboard').href = dashboardLink;
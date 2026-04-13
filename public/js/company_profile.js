// Parse URL query parameters (like ?id=1&name=Company)
const params = new URLSearchParams(window.location.search);

// Extract each value from the URL parameters
const id = params.get('id');
const c_name = params.get('name');
const email = params.get('email');
const description = params.get('description');

// If company name is provided, display and fill it into form fields
if (c_name) {
    document.getElementById('display-name').innerText = c_name; // Show name
    document.getElementById('edit-name-input').value = c_name;  // Pre-fill input for editing
    document.getElementById('name-id').value = id;              // Add hidden ID input
}

// If email is provided, display and fill it into form fields
if (email) {
    document.getElementById('display-email').innerText = email;
    document.getElementById('edit-email-input').value = email;
    document.getElementById('email-id').value = id;
}

// If description is provided, display and fill it into form fields
if (description) {
    document.getElementById('display-description').innerText = description;
    document.getElementById('edit-description-input').value = description;
    document.getElementById('description-id').value = id;
}

// Always set the ID for password update form
if (id) {
    document.getElementById('password-id').value = id;
}

// Display success or error messages from query params
const success = params.get('success');
const error = params.get('error');

const messageBox = document.getElementById('message-box');
if (success) {
    messageBox.innerHTML = `<p style="color: green;">✅ ${decodeURIComponent(success)}</p>`;
} else if (error) {
    messageBox.innerHTML = `<p style="color: red;">❌ ${decodeURIComponent(error)}</p>`;
}

// Show or hide the edit form section when "Edit" button is clicked
function toggleEdit(field) {
    const section = document.getElementById(`edit-${field}-section`);
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

// Set the "Back to Dashboard" button with all the current info as query params
const dashboardLink = `/company_dashboard?id=${encodeURIComponent(id)}&name=${encodeURIComponent(c_name)}&email=${encodeURIComponent(email)}&description=${encodeURIComponent(description)}`;
document.getElementById('back_to_dashboard').href = dashboardLink;
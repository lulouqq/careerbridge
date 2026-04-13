// Get query parameters from the URL (e.g., ?id=1&name=Google)
const params = new URLSearchParams(window.location.search);

// Extract individual values from the query string
const id = params.get('id');
const c_name = params.get('name');
const email = params.get('email');
const description = params.get('description');

// If the company name exists, show it in the greeting section
if (c_name) {
    document.getElementById('hello_text').innerHTML += c_name;
}

// If the email exists, display it in the appropriate section
if (email) {
    document.getElementById('email_text').innerHTML += email;
}

// Create a link to the company profile page, keeping all the data in the URL
const profileLink = `/company_profile?id=${encodeURIComponent(id)}&name=${encodeURIComponent(c_name)}&email=${encodeURIComponent(email)}&description=${encodeURIComponent(description)}`;

// Create a link to the company internships page with all info in the URL
const internshipsLink = `/company_internships?id=${encodeURIComponent(id)}&name=${encodeURIComponent(c_name)}&email=${encodeURIComponent(email)}&description=${encodeURIComponent(description)}`;

// Set the href attributes of the navigation links on the page
document.getElementById('profile_link').href = profileLink;
document.getElementById('internships_link').href = internshipsLink;

// Fetch all applications for this company from the server
fetch(`/company-applications?id=${encodeURIComponent(id)}`)
    .then(res => res.json()) // Convert the response to JSON
    .then(data => {
        const container = document.getElementById('applications-container');

        // If no applications were found, show a message
        if (data.length === 0) {
            container.innerHTML = '<p>No applications yet.</p>';
        } else {
            // Otherwise, loop through each application and display it
            data.forEach(app => {
                const div = document.createElement('div');
                div.className = 'application-card';

                // Set a CSS class based on the current status of the application
                const statusClass =
                    app.status === 'Accepted' ? 'status-accepted' :
                    app.status === 'Rejected' ? 'status-rejected' :
                    'status-pending';

                // Add HTML content for each application card
                div.innerHTML = `
  <p><strong>Student:</strong> ${app.student_name}</p>
  <p><strong>Email:</strong> ${app.student_email}</p>
  <p><strong>Skills:</strong> ${app.student_skills}</p>
  <a href="/uploads/${app.student_resume}" download>📄 Download Resume</a>
  <p><strong>Internship:</strong> ${app.internship_title}</p>
  <p><strong>Status:</strong> <span id="status-${app.application_id}" class="${statusClass}">${app.status}</span></p>
  <button onclick="updateStatus(${app.application_id}, 'Accepted')">✅ Accept</button>
  <button onclick="updateStatus(${app.application_id}, 'Rejected')">❌ Reject</button>
`;
                // Add the application card to the container
                container.appendChild(div);
            });
        }
    })
    .catch(err => {
        // If something goes wrong with the fetch, show an error
        console.error('❌ Failed to load applications:', err);
        document.getElementById('applications-container').innerHTML = '<p style="color: #e74c3c;">Error loading applications</p>';
    });

/**
 * Function to update the status of an application (Accept/Reject)
 */
function updateStatus(appId, newStatus) {
    fetch('/update-application-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_id: appId, status: newStatus })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // If successful, update the status text and CSS class on the page
                const statusElement = document.getElementById(`status-${appId}`);
                statusElement.textContent = newStatus;
                statusElement.className = newStatus === 'Accepted' ? 'status-accepted' : 'status-rejected';
            } else {
                // Show error message from server
                alert('❌ ' + data.error);
            }
        })
        .catch(err => {
            // Show a generic error if request fails
            alert('❌ Error updating status');
            console.error(err);
        });
}
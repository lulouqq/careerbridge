// Get parameters from the URL (e.g., after login or redirect)
const params = new URLSearchParams(window.location.search);

// Extract student info from URL
const id = params.get('id');
const s_name = params.get('name');
const email = params.get('email');
const university = params.get('university');
const skills = params.get('skills');

// If we have the student's name, add it to the welcome message
if (s_name) {
    document.getElementById('hello_text').innerHTML += s_name;
}

// If we have the student's email, show it as well
if (email) {
    document.getElementById('email_text').innerHTML += email;
}

// Build links for profile and internships, preserving student info in the URL
const profileLink = `/student_profile?id=${encodeURIComponent(id)}&name=${encodeURIComponent(s_name)}&email=${encodeURIComponent(email)}&university=${encodeURIComponent(university)}&skills=${encodeURIComponent(skills)}`;
const internshipsLink = `/internships_list?id=${encodeURIComponent(id)}&name=${encodeURIComponent(s_name)}&email=${encodeURIComponent(email)}&university=${encodeURIComponent(university)}&skills=${encodeURIComponent(skills)}`;

// Set those links in the navigation
document.getElementById('profile_link').href = profileLink;
document.getElementById('internships_link').href = internshipsLink;

// Request the list of internship applications made by this student
fetch(`/student-applications?id=${id}`)
    .then(res => res.json()) // Convert response to JSON
    .then(data => {
        const container = document.getElementById('applications-list');
        container.innerHTML = ''; // Clear container before rendering

        // If no applications yet, show message
        if (data.length === 0) {
            container.innerHTML = '<p>You have not applied to any internships yet.</p>';
        } else {
            // For each application, create a card with details
            data.forEach(app => {
                const div = document.createElement('div');
                div.className = 'application-card';

                // Determine which CSS class to use for status
                const statusClass = app.status === 'Accepted' ? 'status-accepted' :
                    app.status === 'Rejected' ? 'status-rejected' : 'status-pending';

                // Create HTML content for the card
                div.innerHTML = `
              <p><strong>Internship:</strong> ${app.title}</p>
              <p><strong>Company:</strong> ${app.company}</p>
              <p><strong>Status:</strong> <span class="${statusClass}">${app.status}</span></p>
              ${app.status === 'Accepted' ? `<p><strong>Contact Email:</strong> ${app.company_email}</p>` : ''}
            `;

                // Add the card to the page
                container.appendChild(div);
            });
        }
    })
    .catch(err => {
        // If there's an error, log it and show an error message
        console.error('❌ Error fetching applications:', err);
        document.getElementById('applications-list').innerHTML = '<p style="color: #e74c3c;">Error loading applications.</p>';
    });
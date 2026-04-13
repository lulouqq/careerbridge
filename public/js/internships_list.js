// Get URL parameters passed to this page (e.g., id, name, email, etc.)
const params = new URLSearchParams(window.location.search);
const studentId = params.get('id');
const s_name = params.get('name');
const email = params.get('email');
const university = params.get('university');
const skills = params.get('skills');

// Build the dashboard link so the student can go back with their info preserved
const dashboardLink = `/student_dashboard?id=${encodeURIComponent(studentId)}&name=${encodeURIComponent(s_name)}&email=${encodeURIComponent(email)}&university=${encodeURIComponent(university)}&skills=${encodeURIComponent(skills)}`;
document.getElementById('back_to_dashboard').href = dashboardLink;

// Fetch all available internships from the server
fetch('/internships')
    .then(res => res.json()) // Parse the response as JSON
    .then(data => {
        const container = document.getElementById('internship-list');

        // If there are no internships, show a message
        if (data.length === 0) {
            container.innerHTML = '<p>No internships available at the moment.</p>';
        } else {
            // Loop through each internship and display its details
            data.forEach(intern => {
                const div = document.createElement('div');
                div.innerHTML = `
              <h3>${intern.title}</h3>
              <p><strong>Comapny:</strong> ${intern.company}</p>
              <p><strong>Description:</strong> ${intern.description}</p>
              <p><strong>Location:</strong> ${intern.location}</p>
              <p><strong>Duration:</strong> ${intern.duration}</p>
              <button onclick="apply(${intern.id})">Apply</button>
              <hr>
            `;
                container.appendChild(div);
            });
        }
    });

// This function is called when the student clicks "Apply" for an internship
function apply(internshipId) {
    fetch('/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, internship_id: internshipId }) // Send student and internship IDs
    })
        .then(res => res.json())
        .then(data => {
            const box = document.getElementById('message-box');
            // Show a success or error message depending on the result
            if (data.success) {
                box.innerHTML = `<p style="color: green;">✅ ${data.success}</p>`;
            } else {
                box.innerHTML = `<p style="color: red;">❌ ${data.error}</p>`;
            }
        });
}
// Get query parameters from the URL (e.g. ?id=1&name=Google&email=...etc)
const params = new URLSearchParams(window.location.search);

// Extract specific values from the query string
const companyId = params.get('id');
const c_name = params.get('name');
const email = params.get('email');
const description = params.get('description');

// Fill hidden form fields with company info (used when deleting an internship)
document.getElementById('company_id').value = companyId;
document.getElementById('c_name').value = c_name;
document.getElementById('c_email').value = email;
document.getElementById('c_description').value = description;

// Display the company name in the internship section header
document.getElementById('company-internships-name').innerHTML = `${c_name}'s Internships`;

// Fetch internships posted by this company from the server
fetch(`/company-internships-data?id=${companyId}`)
    .then(res => res.json()) // Convert response to JSON
    .then(data => {
        const container = document.getElementById('internship-list');

        // If no internships found, show message
        if (data.length === 0) {
            container.innerHTML = '<p>No internships posted yet.</p>';
        } else {
            // Otherwise, render each internship as a card with delete option
            data.forEach(intern => {
                const div = document.createElement('div');
                div.innerHTML = `
              <h3>${intern.title}</h3>
              <p><strong>Description:</strong> ${intern.description}</p>
              <p><strong>Location:</strong> ${intern.location}</p>
              <p><strong>Duration:</strong> ${intern.duration}</p>

              <!-- Form to delete internship with confirmation popup -->
              <form action="/delete-internship" method="POST" onsubmit="return confirm('Are you sure you want to delete this internship?');">
                <input type="hidden" name="internship_id" value="${intern.id}">
                <input type="hidden" name="company_id" value="${companyId}">
                <input type="hidden" name="name" value="${c_name}">
                <input type="hidden" name="email" value="${email}">
                <input type="hidden" name="description" value="${description}">
                <button type="submit">🗑️ Delete</button>
              </form>

              <hr>
            `;
                container.appendChild(div); // Add this internship to the list
            });
        }
    });

// Check if there's a success or error message in the URL (for example, after deleting an internship)
const success = params.get('success');
const error = params.get('error');
const messageBox = document.getElementById('message-box');

if (success) {
    messageBox.innerHTML = `<p style="color: green;">✅ ${decodeURIComponent(success)}</p>`;
} else if (error) {
    messageBox.innerHTML = `<p style="color: red;">❌ ${decodeURIComponent(error)}</p>`;
}

// Create a back link to the company dashboard with all data in the URL
const dashboardLink = `/company_dashboard?id=${encodeURIComponent(companyId)}&name=${encodeURIComponent(c_name)}&email=${encodeURIComponent(email)}&description=${encodeURIComponent(description)}`;

// Set the link for "Back to Dashboard" button
document.getElementById('back_to_dashboard').href = dashboardLink;
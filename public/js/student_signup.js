// Create an object to read URL parameters (e.g., ?error=Wrong+password)
const params = new URLSearchParams(window.location.search);

// Check if there is an "error" parameter in the URL
if (params.has('error')) {
    // If found, display the error message inside the HTML element with id="error"
    document.getElementById('error').innerText = params.get('error');
}
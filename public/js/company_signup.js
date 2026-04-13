// Get the query parameters from the URL (e.g. ?error=Invalid+password)
const params = new URLSearchParams(window.location.search);

// If the URL contains an "error" parameter
if (params.has('error')) {
    // Find the element with ID "error" and display the error message inside it
    document.getElementById('error').innerText = params.get('error');
}
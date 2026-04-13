// Get all the URL parameters from the address bar (e.g., ?error=Something+went+wrong)
const params = new URLSearchParams(window.location.search);

// If the URL has an 'error' parameter, display its value inside the element with id="error"
if (params.has('error')) {
    document.getElementById('error').innerText = params.get('error');
}

// If the URL has a 'success' parameter, display its value inside the element with id="success"
if (params.has('success')) {
    document.getElementById('success').innerText = params.get('success');
}
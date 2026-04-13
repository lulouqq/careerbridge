// Parse the query string from the current URL (e.g. ?error=Something+went+wrong)
const params = new URLSearchParams(window.location.search);

// If there's an 'error' parameter in the URL, display its message in the element with ID 'error'
if (params.has('error')) {
    document.getElementById('error').innerText = params.get('error');
}

// If there's a 'success' parameter in the URL, display its message in the element with ID 'success'
if (params.has('success')) {
    document.getElementById('success').innerText = params.get('success');
}
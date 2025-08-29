document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Hardcoded credentials for simplicity
            if (username === 'admin' && password === 'password') {
                // Save login state to localStorage
                localStorage.setItem('isAdmin', 'true');
                // Redirect to the admin dashboard
                window.location.href = 'admin.html';
            } else {
                alert('Invalid username or password.');
            }
        });
    } else {
        console.error('Login form with ID "login-form" was not found.');
    }
});
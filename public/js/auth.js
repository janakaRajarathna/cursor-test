// DOM Elements
const loginFormElement = document.getElementById('loginFormElement');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Event Listeners
loginFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        showAlert('Please fill in all fields', 'danger');
        return;
    }

    try {
        showLoading();
        const response = await apiRequest('auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        // Store token and user info
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        // Update UI and show assignments section
        updateUIForUser(response.user);
        showSection('assignments');
        showAlert('Login successful');
    } catch (error) {
        console.error('Login error:', error);
    } finally {
        hideLoading();
    }
}); 
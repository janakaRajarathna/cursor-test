// Global variables
let currentUser = null;
let currentSection = 'login';

// DOM Elements
const loginForm = document.getElementById('loginForm');
const assignmentsSection = document.getElementById('assignmentsSection');
const submissionsSection = document.getElementById('submissionsSection');
const analyticsSection = document.getElementById('analyticsSection');
const userInfo = document.getElementById('userInfo');
const logoutBtn = document.getElementById('logoutBtn');

// Navigation Links
const assignmentsLink = document.getElementById('assignmentsLink');
const submissionsLink = document.getElementById('submissionsLink');
const analyticsLink = document.getElementById('analyticsLink');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            currentUser = user;
            showSection('assignments');
        }
    }

    // Navigation event listeners
    assignmentsLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('assignments');
    });

    submissionsLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('submissions');
    });

    analyticsLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('analytics');
    });

    // Logout event listener
    logoutBtn.addEventListener('click', logout);
});

// Show/Hide Sections
function showSection(section) {
    // Hide all sections
    loginForm.classList.add('d-none');
    assignmentsSection.classList.add('d-none');
    submissionsSection.classList.add('d-none');
    analyticsSection.classList.add('d-none');

    // Show selected section
    switch (section) {
        case 'login':
            loginForm.classList.remove('d-none');
            break;
        case 'assignments':
            assignmentsSection.classList.remove('d-none');
            loadAssignments();
            break;
        case 'submissions':
            submissionsSection.classList.remove('d-none');
            loadSubmissions();
            break;
        case 'analytics':
            analyticsSection.classList.remove('d-none');
            loadAnalytics();
            break;
    }

    currentSection = section;
}

// Update UI based on user role
function updateUIForUser(user) {
    currentUser = user;
    userInfo.textContent = `${user.username} (${user.role})`;

    // Show/hide elements based on role
    const createAssignmentBtn = document.getElementById('createAssignmentBtn');
    if (createAssignmentBtn) {
        createAssignmentBtn.style.display = user.role === 'lecturer' ? 'block' : 'none';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;
    showSection('login');
}

// Show alert message
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Show loading spinner
function showLoading() {
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    document.body.appendChild(spinner);
}

// Hide loading spinner
function hideLoading() {
    const spinner = document.querySelector('.spinner');
    if (spinner) {
        spinner.remove();
    }
}

// API request helper
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const response = await fetch(`/api/${endpoint}`, {
            ...defaultOptions,
            ...options
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        showAlert(error.message, 'danger');
        throw error;
    }
}

// Export functions
window.showSection = showSection;
window.updateUIForUser = updateUIForUser;
window.showAlert = showAlert;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.apiRequest = apiRequest; 
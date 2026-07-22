// API Configuration
const API_URL = 'http://localhost:5500/api';

// Global variables
let authToken = null;
let currentUser = null;

// API Call Helper
async function apiCall(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'API call failed');
        }

        return response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Login Function
async function login(username, password, role) {
    try {
        const result = await apiCall('/login', {
            method: 'POST',
            body: JSON.stringify({ username, password, role })
        });
        
        authToken = result.token;
        currentUser = result.user;
        
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(currentUser));
        
        console.log('✅ Login successful:', currentUser.full_name);
        
        // Redirect based on role
        if (currentUser.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else if (currentUser.role === 'healthcare_worker') {
            window.location.href = 'healthcare-dashboard.html';
        } else {
            window.location.href = 'patient-dashboard.html';
        }
        
        return result;
    } catch (error) {
        console.error('❌ Login failed:', error.message);
        throw error;
    }
}

// Logout Function
function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Check Authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        authToken = token;
        currentUser = JSON.parse(user);
        return true;
    }
    return false;
}

// Dashboard Functions
async function loadDashboardStats(role) {
    try {
        return await apiCall(`/dashboard/${role}`);
    } catch (error) {
        console.error('Error loading dashboard:', error);
        throw error;
    }
}

async function loadPatients() {
    try {
        return await apiCall('/patients');
    } catch (error) {
        console.error('Error loading patients:', error);
        throw error;
    }
}

async function loadDevices() {
    try {
        return await apiCall('/devices');
    } catch (error) {
        console.error('Error loading devices:', error);
        throw error;
    }
}

async function loadActivities() {
    try {
        return await apiCall('/activities');
    } catch (error) {
        console.error('Error loading activities:', error);
        throw error;
    }
}

async function registerPatient(data) {
    try {
        return await apiCall('/register', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error('Error registering patient:', error);
        throw error;
    }
}

// Auto-login check
if (checkAuth()) {
    console.log('✅ User authenticated:', currentUser.username);
    
    if (window.location.pathname.includes('login.html')) {
        if (currentUser.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else if (currentUser.role === 'healthcare_worker') {
            window.location.href = 'healthcare-dashboard.html';
        } else {
            window.location.href = 'patient-dashboard.html';
        }
    }
}

console.log('✅ RefugeeCare IoT Client Loaded');
console.log(`📡 API: ${API_URL}`);
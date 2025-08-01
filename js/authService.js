
// Auth Service for handling authentication related operations
const authService = {
    API_BASE_URL: 'http://localhost:5000/api',

    // Register a new user
    async register(userData) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }
            
            // Save auth data
            this.setAuthData(data);
            
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    // Log in a user
    async login(credentials) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            
            // Save auth data
            this.setAuthData(data);
            
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    // Log out the current user
    logout() {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userProfile');
    },

    // Get the current user's profile
    async getProfile() {
        try {
            const token = this.getToken();
            
            if (!token) {
                throw new Error('No authentication token found');
            }
            
            const response = await fetch(`${this.API_BASE_URL}/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch profile');
            }
            
            // Update stored user data
            localStorage.setItem('userProfile', JSON.stringify(data));
            
            return data;
        } catch (error) {
            console.error('Get profile error:', error);
            
            // If token expired, try to refresh
            if (error.message.includes('token') && this.getRefreshToken()) {
                try {
                    await this.refreshToken();
                    // Retry the original request
                    return this.getProfile();
                } catch (refreshError) {
                    this.logout();
                    throw new Error('Session expired. Please login again.');
                }
            }
            
            throw error;
        }
    },

    // Update the user's profile
    async updateProfile(profileData) {
        try {
            const token = this.getToken();
            
            if (!token) {
                throw new Error('No authentication token found');
            }
            
            const response = await fetch(`${this.API_BASE_URL}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update profile');
            }
            
            // Update stored user data
            localStorage.setItem('userProfile', JSON.stringify(data.user));
            
            return data;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    },

    // Update course progress
    async updateProgress(progressData) {
        try {
            const token = this.getToken();
            
            if (!token) {
                throw new Error('No authentication token found');
            }
            
            const response = await fetch(`${this.API_BASE_URL}/progress`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(progressData)
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update progress');
            }
            
            return data;
        } catch (error) {
            console.error('Update progress error:', error);
            throw error;
        }
    },

    // Refresh the access token
    async refreshToken() {
        try {
            const refreshToken = this.getRefreshToken();
            
            if (!refreshToken) {
                throw new Error('No refresh token found');
            }
            
            const response = await fetch(`${this.API_BASE_URL}/refresh-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to refresh token');
            }
            
            // Save new token
            localStorage.setItem('jwtToken', data.token);
            
            return data;
        } catch (error) {
            console.error('Refresh token error:', error);
            throw error;
        }
    },

    // Helper functions
    setAuthData(data) {
        localStorage.setItem('jwtToken', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('userProfile', JSON.stringify(data.user));
    },
    
    getToken() {
        return localStorage.getItem('jwtToken');
    },
    
    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    },
    
    getUserProfile() {
        const profile = localStorage.getItem('userProfile');
        return profile ? JSON.parse(profile) : null;
    },
    
    isAuthenticated() {
        return !!this.getToken();
    }
};

// Make it available globally
window.authService = authService;

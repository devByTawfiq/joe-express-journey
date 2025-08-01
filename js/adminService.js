
/**
 * Admin Service for JOEeXPRESS Tech Hub
 * Handles API interactions for admin functionality
 */

const adminService = {
    // Base URL for API requests
    baseURL: 'http://localhost:3000/api',
    
    // Get API headers with auth token
    getHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    },
    
    // Check if user has admin privileges
    isAdmin() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user && user.role === 'admin';
    },
    
    // Get all users
    async getUsers() {
        try {
            // In a real implementation, this would be:
            // const response = await fetch(`${this.baseURL}/users`, {
            //     method: 'GET',
            //     headers: this.getHeaders()
            // });
            // return await response.json();
            
            // For now, return mock data
            return Promise.resolve([
                { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'student', course: 'softwareDev', registrationDate: '2024-01-15T10:30:00', status: 'active' },
                { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'student', course: 'dataAnalysis', registrationDate: '2024-01-20T14:20:00', status: 'active' },
                { id: 3, firstName: 'Admin', lastName: 'User', email: 'admin@jetechhub.com', role: 'admin', course: 'member', registrationDate: '2023-12-01T09:00:00', status: 'active' },
                { id: 4, firstName: 'Mark', lastName: 'Johnson', email: 'mark@example.com', role: 'student', course: 'forex', registrationDate: '2024-02-10T11:15:00', status: 'inactive' },
                { id: 5, firstName: 'Sarah', lastName: 'Williams', email: 'sarah@example.com', role: 'student', course: 'videoGraphics', registrationDate: '2024-02-15T16:45:00', status: 'active' }
            ]);
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },
    
    // Get user by ID
    async getUser(userId) {
        try {
            // In a real implementation, this would be:
            // const response = await fetch(`${this.baseURL}/users/${userId}`, {
            //     method: 'GET',
            //     headers: this.getHeaders()
            // });
            // return await response.json();
            
            // For now, mock the response
            const users = await this.getUsers();
            const user = users.find(u => u.id === userId);
            return user || null;
        } catch (error) {
            console.error(`Error fetching user with ID ${userId}:`, error);
            throw error;
        }
    },
    
    // Create a new user
    async createUser(userData) {
        try {
            // In a real implementation, this would be:
            // const response = await fetch(`${this.baseURL}/users`, {
            //     method: 'POST',
            //     headers: this.getHeaders(),
            //     body: JSON.stringify(userData)
            // });
            // return await response.json();
            
            // For mock purposes, we'll just return the data with an ID
            return {
                ...userData,
                id: Math.floor(Math.random() * 1000) + 10,
                registrationDate: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },
    
    // Update an existing user
    async updateUser(userId, userData) {
        try {
            // In a real implementation, this would be:
            // const response = await fetch(`${this.baseURL}/users/${userId}`, {
            //     method: 'PUT',
            //     headers: this.getHeaders(),
            //     body: JSON.stringify(userData)
            // });
            // return await response.json();
            
            // For mock purposes, return the updated data
            return {
                ...userData,
                id: userId
            };
        } catch (error) {
            console.error(`Error updating user with ID ${userId}:`, error);
            throw error;
        }
    },
    
    // Delete a user
    async deleteUser(userId) {
        try {
            // In a real implementation, this would be:
            // const response = await fetch(`${this.baseURL}/users/${userId}`, {
            //     method: 'DELETE',
            //     headers: this.getHeaders()
            // });
            // return await response.json();
            
            // For mock purposes, just return success
            return { success: true, message: 'User deleted successfully' };
        } catch (error) {
            console.error(`Error deleting user with ID ${userId}:`, error);
            throw error;
        }
    },
    
    // Get all messages
    async getMessages() {
        try {
            // In a real implementation, this would be an API call
            // For now, return mock data
            return Promise.resolve([
                { id: 1, name: 'Michael Brown', email: 'michael@example.com', phone: '08012345678', message: 'I\'m interested in the Software Development course. Can you provide more details about the curriculum?', date: '2024-04-05T10:30:00', status: 'new' },
                { id: 2, name: 'Linda Carter', email: 'linda@example.com', phone: '07098765432', message: 'Hello, I\'d like to know if you offer any weekend classes for the Data Analysis course.', date: '2024-04-08T14:45:00', status: 'read' },
                { id: 3, name: 'Robert Johnson', email: 'robert@example.com', phone: '09087654321', message: 'I\'m having trouble accessing my student account. Can someone help me reset my password?', date: '2024-04-10T09:15:00', status: 'responded' },
                { id: 4, name: 'Jessica Davis', email: 'jessica@example.com', phone: '08123456789', message: 'Is there a discount for signing up for multiple courses at once?', date: '2024-05-01T16:20:00', status: 'new' },
                { id: 5, name: 'David Wilson', email: 'david@example.com', phone: '07012345678', message: 'I\'m interested in the Forex Trading course. Do you have any prerequisites for this program?', date: '2024-05-03T11:40:00', status: 'new' }
            ]);
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    },
    
    // Update message status
    async updateMessageStatus(messageId, status) {
        try {
            // In a real implementation, this would be an API call
            // For now, just return success
            return Promise.resolve({ success: true, message: 'Message status updated successfully' });
        } catch (error) {
            console.error(`Error updating message status for message ID ${messageId}:`, error);
            throw error;
        }
    },
    
    // Get all gadgets
    async getGadgets() {
        try {
            // In a real implementation, this would be an API call
            // For now, return mock data
            return Promise.resolve([
                { id: 1, name: 'iPhone 13', category: 'phone', price: 450000, description: 'Apple iPhone 13 with 128GB storage in excellent condition', imageUrl: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=300', available: true, featured: true },
                { id: 2, name: 'Samsung Galaxy S21', category: 'phone', price: 380000, description: 'Samsung Galaxy S21 with 256GB storage, barely used', imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=300', available: true, featured: false },
                { id: 3, name: 'MacBook Pro M1', category: 'laptop', price: 750000, description: '2020 MacBook Pro with M1 chip, 8GB RAM, 512GB SSD', imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=300', available: true, featured: true },
                { id: 4, name: 'Dell XPS 15', category: 'laptop', price: 650000, description: 'Dell XPS 15 with 16GB RAM, 1TB SSD, and 4K display', imageUrl: 'https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?q=80&w=300', available: false, featured: false },
                { id: 5, name: 'iPad Pro 11"', category: 'tablet', price: 420000, description: 'iPad Pro 11-inch with 256GB storage and Apple Pencil', imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=300', available: true, featured: true }
            ]);
        } catch (error) {
            console.error('Error fetching gadgets:', error);
            throw error;
        }
    },
    
    // Create a new gadget
    async createGadget(gadgetData) {
        try {
            // In a real implementation, this would be an API call
            // For now, just return mock success
            return Promise.resolve({
                ...gadgetData,
                id: Math.floor(Math.random() * 1000) + 10
            });
        } catch (error) {
            console.error('Error creating gadget:', error);
            throw error;
        }
    },
    
    // Update an existing gadget
    async updateGadget(gadgetId, gadgetData) {
        try {
            // In a real implementation, this would be an API call
            // For now, just return mock success
            return Promise.resolve({
                ...gadgetData,
                id: gadgetId
            });
        } catch (error) {
            console.error(`Error updating gadget with ID ${gadgetId}:`, error);
            throw error;
        }
    },
    
    // Delete a gadget
    async deleteGadget(gadgetId) {
        try {
            // In a real implementation, this would be an API call
            // For now, just return mock success
            return Promise.resolve({ success: true, message: 'Gadget deleted successfully' });
        } catch (error) {
            console.error(`Error deleting gadget with ID ${gadgetId}:`, error);
            throw error;
        }
    },
    
    // Get dashboard stats
    async getDashboardStats() {
        try {
            // In a real implementation, this would fetch stats from the server
            // For now, we'll just compile stats from our mock data
            const users = await this.getUsers();
            const messages = await this.getMessages();
            const gadgets = await this.getGadgets();
            
            return {
                totalUsers: users.length,
                totalMessages: messages.length,
                totalGadgets: gadgets.length,
                pendingTransactions: Math.floor(Math.random() * 10) // Random for demo
            };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    }
};

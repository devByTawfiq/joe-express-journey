// Supabase configuration
const supabaseUrl = 'https://icqzgoagqosthgipepdq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljcXpnb2FncW9zdGhnaXBlcGRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwODI1NzAsImV4cCI6MjA2NDY1ODU3MH0.nzLqXrmUOmplR71fW-fumg58DiUOs_cKDqmjeuT8Yrg';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Global state
let currentUser = null;

// Service types mapping
const serviceTypes = {
    'software-development': 'Software Development',
    'delivery-services': 'Delivery Services', 
    'repairs': 'Repairs',
    'tech-services': 'Tech Services'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    setupServiceCards();
});

// Check authentication status
async function checkAuth() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        currentUser = user;
    } catch (error) {
        console.error('Auth check error:', error);
        currentUser = null;
    }
}

// Setup service cards with click handlers
function setupServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach((card, index) => {
        const serviceNames = ['software-development', 'delivery-services', 'repairs', 'tech-services'];
        const serviceName = serviceNames[index];
        
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => openServiceModal(serviceName));
        
        // Add visual feedback
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 15px 50px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '';
        });
    });
}

// Open service application modal
function openServiceModal(serviceType) {
    if (!currentUser) {
        showNotification('Please sign in to apply for services', 'error');
        setTimeout(() => {
            window.location.href = 'getStarted.html';
        }, 2000);
        return;
    }

    const modal = createServiceModal(serviceType);
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Create service application modal
function createServiceModal(serviceType) {
    const modal = document.createElement('div');
    modal.className = 'service-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeServiceModal(this.parentElement)">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2>Apply for ${serviceTypes[serviceType]}</h2>
                    <button class="close-btn" onclick="closeServiceModal(this.closest('.service-modal'))">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="serviceApplicationForm" onsubmit="submitServiceApplication(event, '${serviceType}')">
                        <div class="form-group">
                            <label for="fullName">Full Name *</label>
                            <input type="text" id="fullName" name="fullName" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email *</label>
                            <input type="email" id="email" name="email" value="${currentUser?.email || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="phone">Phone Number</label>
                            <input type="tel" id="phone" name="phone">
                        </div>
                        <div class="form-group">
                            <label for="message">Tell us about your project/requirements *</label>
                            <textarea id="message" name="message" rows="4" placeholder="Please describe what you need help with..." required></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="button" onclick="closeServiceModal(this.closest('.service-modal'))" class="btn-secondary">Cancel</button>
                            <button type="submit" class="btn-primary">Submit Application</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    return modal;
}

// Submit service application
async function submitServiceApplication(event, serviceType) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    try {
        const applicationData = {
            user_id: currentUser.id,
            service_type: serviceType,
            full_name: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message')
        };

        const { data, error } = await supabase
            .from('service_applications')
            .insert([applicationData])
            .select();

        if (error) throw error;

        showNotification('Application submitted successfully! We will contact you soon.', 'success');
        closeServiceModal(form.closest('.service-modal'));
        
    } catch (error) {
        console.error('Submit application error:', error);
        showNotification('Error submitting application. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Application';
    }
}

// Close service modal
function closeServiceModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.remove();
    }, 300);
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Add styles to the document
const styles = `
<style>
.service-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.service-modal.show {
    opacity: 1;
    visibility: visible;
}

.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.modal-content {
    background: white;
    border-radius: 15px;
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    transform: scale(0.9);
    transition: transform 0.3s ease;
}

.service-modal.show .modal-content {
    transform: scale(1);
}

.modal-header {
    padding: 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h2 {
    margin: 0;
    color: var(--primary-600);
    font-size: 1.5rem;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-btn:hover {
    color: #333;
}

.modal-body {
    padding: 20px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: #333;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 12px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--primary-600);
}

.form-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 30px;
}

.btn-primary,
.btn-secondary {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
}

.btn-primary {
    background: var(--primary-600);
    color: white;
}

.btn-primary:hover {
    background: var(--primary-700);
}

.btn-primary:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.btn-secondary {
    background: #f5f5f5;
    color: #666;
}

.btn-secondary:hover {
    background: #e0e0e0;
}

.notification {
    position: fixed;
    top: 100px;
    right: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    z-index: 10001;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
}

.notification.show {
    opacity: 1;
    transform: translateX(0);
}

.notification.success {
    border-left: 4px solid #4CAF50;
}

.notification.error {
    border-left: 4px solid #f44336;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px 20px;
}

.notification-content i {
    font-size: 18px;
}

.notification.success i {
    color: #4CAF50;
}

.notification.error i {
    color: #f44336;
}

@media (max-width: 768px) {
    .modal-overlay {
        padding: 10px;
    }
    
    .modal-header {
        padding: 15px;
    }
    
    .modal-body {
        padding: 15px;
    }
    
    .form-actions {
        flex-direction: column;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', styles);
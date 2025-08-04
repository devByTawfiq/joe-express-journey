
// Supabase configuration
const supabaseUrl = 'https://icqzgoagqosthgipepdq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljcXpnb2FncW9zdGhnaXBlcGRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwODI1NzAsImV4cCI6MjA2NDY1ODU3MH0.nzLqXrmUOmplR71fW-fumg58DiUOs_cKDqmjeuT8Yrg';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Global state
let currentUser = null;
let gadgets = [];
let filteredGadgets = [];

// DOM elements
const authRequired = document.getElementById('authRequired');
const filtersSection = document.getElementById('filtersSection');
const loadingState = document.getElementById('loadingState');
const gadgetsGrid = document.getElementById('gadgetsGrid');
const emptyState = document.getElementById('emptyState');
const addGadgetBtn = document.getElementById('addGadgetBtn');
const addGadgetForm = document.getElementById('addGadgetForm');
const authSection = document.getElementById('authSection');

// Filter elements
const categoryFilter = document.getElementById('categoryFilter');
const conditionFilter = document.getElementById('conditionFilter');
const searchInput = document.getElementById('searchInput');

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    if (currentUser) {
        await loadGadgets();
        setupFilters();
        setupAddGadgetForm();
    }
});

// Check authentication status
async function checkAuth() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        currentUser = user;
        
        if (currentUser) {
            authRequired.classList.add('d-none');
            filtersSection.classList.remove('d-none');
            addGadgetBtn.classList.remove('d-none');
            authSection.innerHTML = `
                <span class="me-3">Welcome, ${currentUser.email}</span>
                <button class="btn btn-outline-primary" onclick="signOut()">Sign Out</button>
            `;
        } else {
            authRequired.classList.remove('d-none');
            filtersSection.classList.add('d-none');
            addGadgetBtn.classList.add('d-none');
            loadingState.classList.add('d-none');
        }
    } catch (error) {
        console.error('Auth check error:', error);
        authRequired.classList.remove('d-none');
    }
}

// Sign out function
async function signOut() {
    try {
        await supabase.auth.signOut();
        window.location.reload();
    } catch (error) {
        console.error('Sign out error:', error);
    }
}

// Load gadgets from database
async function loadGadgets() {
    try {
        loadingState.classList.remove('d-none');
        gadgetsGrid.classList.add('d-none');
        emptyState.classList.add('d-none');

        const { data, error } = await supabase
            .from('gadgets')
            .select('*')
            .eq('available', true)
            .order('created_at', { ascending: false });

        if (error) throw error;

        gadgets = data || [];
        filteredGadgets = [...gadgets];
        
        loadingState.classList.add('d-none');
        
        if (gadgets.length === 0) {
            emptyState.classList.remove('d-none');
        } else {
            renderGadgets();
        }
    } catch (error) {
        console.error('Load gadgets error:', error);
        loadingState.classList.add('d-none');
        emptyState.classList.remove('d-none');
    }
}

// Render gadgets to the grid
function renderGadgets() {
    if (filteredGadgets.length === 0) {
        gadgetsGrid.classList.add('d-none');
        emptyState.classList.remove('d-none');
        return;
    }

    gadgetsGrid.classList.remove('d-none');
    emptyState.classList.add('d-none');

    gadgetsGrid.innerHTML = filteredGadgets.map(gadget => `
        <div class="col-md-6 col-lg-4">
            <div class="gadget-card">
                <img src="${gadget.image_url || 'https://via.placeholder.com/300x200?text=No+Image'}" 
                     alt="${gadget.name}" class="gadget-image">
                <h3 class="gadget-title">${gadget.name}</h3>
                <div class="gadget-price">₦${formatPrice(gadget.price)}</div>
                <div class="condition-badge condition-${gadget.condition}">
                    ${gadget.condition.charAt(0).toUpperCase() + gadget.condition.slice(1)}
                </div>
                <p class="gadget-description">${gadget.description || 'No description available'}</p>
                <div class="d-flex gap-2">
                    ${gadget.seller_id !== currentUser.id ? `
                        <button class="btn btn-success flex-fill" onclick="buyGadget('${gadget.id}')">
                            <i class="fab fa-whatsapp"></i> Buy via WhatsApp
                        </button>
                    ` : `
                        <button class="btn btn-outline-primary flex-fill" onclick="editGadget('${gadget.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-outline-danger" onclick="deleteGadget('${gadget.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    `}
                </div>
            </div>
        </div>
    `).join('');
}

// Format price with commas
function formatPrice(price) {
    return parseFloat(price).toLocaleString();
}

// Setup filters
function setupFilters() {
    categoryFilter.addEventListener('change', applyFilters);
    conditionFilter.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', applyFilters);
}

// Apply filters
function applyFilters() {
    const category = categoryFilter.value;
    const condition = conditionFilter.value;
    const search = searchInput.value.toLowerCase();

    filteredGadgets = gadgets.filter(gadget => {
        const matchesCategory = !category || gadget.category === category;
        const matchesCondition = !condition || gadget.condition === condition;
        const matchesSearch = !search || 
            gadget.name.toLowerCase().includes(search) ||
            gadget.description?.toLowerCase().includes(search);

        return matchesCategory && matchesCondition && matchesSearch;
    });

    renderGadgets();
}

// Setup add gadget form
function setupAddGadgetForm() {
    addGadgetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(addGadgetForm);
        const gadgetData = {
            name: formData.get('name'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            condition: formData.get('condition'),
            image_url: formData.get('image_url'),
            description: formData.get('description'),
            seller_id: currentUser.id
        };

        try {
            const { data, error } = await supabase
                .from('gadgets')
                .insert([gadgetData])
                .select();

            if (error) throw error;

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addGadgetModal'));
            modal.hide();
            
            // Reset form
            addGadgetForm.reset();
            
            // Reload gadgets
            await loadGadgets();
            
            showNotification('Gadget added successfully!', 'success');
        } catch (error) {
            console.error('Add gadget error:', error);
            showNotification('Error adding gadget. Please try again.', 'error');
        }
    });
}

// Buy gadget function with WhatsApp redirect
async function buyGadget(gadgetId) {
    try {
        const gadget = gadgets.find(g => g.id === gadgetId);
        if (!gadget) return;

        // Get user profile for buyer details
        const { data: buyerProfile } = await supabase
            .from('profiles')
            .select('full_name, phone')
            .eq('id', currentUser.id)
            .single();

        // Get seller profile for contact
        const { data: sellerProfile } = await supabase
            .from('profiles')
            .select('phone')
            .eq('id', gadget.seller_id)
            .single();

        // Prepare WhatsApp message
        const buyerName = buyerProfile?.full_name || currentUser.email;
        const buyerPhone = buyerProfile?.phone || 'Not provided';
        const sellerPhone = sellerProfile?.phone || '2348012345678'; // Default fallback

        const message = `Hi! I'm interested in purchasing your ${gadget.name}.

*Gadget Details:*
- Name: ${gadget.name}
- Price: ₦${formatPrice(gadget.price)}
- Condition: ${gadget.condition.charAt(0).toUpperCase() + gadget.condition.slice(1)}
- Category: ${gadget.category}

*Buyer Details:*
- Name: ${buyerName}
- Email: ${currentUser.email}
- Phone: ${buyerPhone}

Please let me know if it's still available. Thank you!`;

        // Create WhatsApp URL
        const whatsappUrl = `https://wa.me/${sellerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');

        showNotification('Redirecting to WhatsApp to contact seller...', 'success');
        
    } catch (error) {
        console.error('Buy gadget error:', error);
        showNotification('Error processing request. Please try again.', 'error');
    }
}

// Swap gadget function
async function swapGadget(gadgetId) {
    const swapProposal = prompt('What would you like to swap for this gadget?');
    if (!swapProposal) return;

    try {
        const gadget = gadgets.find(g => g.id === gadgetId);
        
        const { data, error } = await supabase
            .from('gadget_transactions')
            .insert([{
                gadget_id: gadgetId,
                buyer_id: currentUser.id,
                seller_id: gadget.seller_id,
                transaction_type: 'swap'
            }]);

        if (error) throw error;

        showNotification('Swap request sent! The seller will be notified.', 'success');
    } catch (error) {
        console.error('Swap gadget error:', error);
        showNotification('Error processing swap request. Please try again.', 'error');
    }
}

// Delete gadget function
async function deleteGadget(gadgetId) {
    if (!confirm('Are you sure you want to delete this gadget?')) return;

    try {
        const { error } = await supabase
            .from('gadgets')
            .delete()
            .eq('id', gadgetId);

        if (error) throw error;

        showNotification('Gadget deleted successfully!', 'success');
        await loadGadgets();
    } catch (error) {
        console.error('Delete gadget error:', error);
        showNotification('Error deleting gadget. Please try again.', 'error');
    }
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
    notification.style.position = 'fixed';
    notification.style.top = '100px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        window.location.reload();
    } else if (event === 'SIGNED_OUT') {
        window.location.reload();
    }
});

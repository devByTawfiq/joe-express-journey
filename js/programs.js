
// Programs Page JavaScript

// Program slideshow functionality
class ProgramSlideshow {
constructor(container) {
this.container = container;
this.slides = container.querySelectorAll('.slide');
this.currentSlide = 0;
this.slideInterval = null;
this.isPlaying = true;

this.init();
}

init() {
if (this.slides.length <= 1) return;

// Add navigation buttons event listeners
const prevBtn = this.container.querySelector('.slide-prev');
const nextBtn = this.container.querySelector('.slide-next');

if (prevBtn) {
prevBtn.addEventListener('click', () => this.previousSlide());
}

if (nextBtn) {
nextBtn.addEventListener('click', () => this.nextSlide());
}

// Start auto-play
this.startAutoPlay();

// Pause on hover
this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
this.container.addEventListener('mouseleave', () => this.startAutoPlay());

console.log(`Slideshow initialized with ${this.slides.length} slides`);
}

showSlide(index) {
// Remove active class from all slides
this.slides.forEach(slide => slide.classList.remove('active'));

// Add active class to current slide
if (this.slides[index]) {
this.slides[index].classList.add('active');
this.currentSlide = index;
}
}

nextSlide() {
const next = (this.currentSlide + 1) % this.slides.length;
this.showSlide(next);
}

previousSlide() {
const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
this.showSlide(prev);
}

startAutoPlay() {
if (this.slideInterval) {
clearInterval(this.slideInterval);
}

this.slideInterval = setInterval(() => {
if (this.isPlaying) {
this.nextSlide();
}
}, 4000); // Change slide every 4 seconds
}

pauseAutoPlay() {
this.isPlaying = false;
}

resumeAutoPlay() {
this.isPlaying = true;
}
}

// Initialize programs page functionality
function initProgramsPage() {
console.log('Programs page initialized');

// Initialize all slideshows
initSlideshows();

// Initialize program enrollment
initProgramEnrollment();

// Initialize sidebar navigation
initSidebarNavigation();

// Initialize program filtering (if needed)
initProgramFiltering();
}

// Initialize slideshows
function initSlideshows() {
const slideshowContainers = document.querySelectorAll('.slideshow-container');
const slideshows = [];

slideshowContainers.forEach(container => {
const slideshow = new ProgramSlideshow(container);
slideshows.push(slideshow);
});

console.log(`${slideshows.length} slideshows initialized`);

// Store slideshows globally for potential use
window.programSlideshows = slideshows;
}

// Initialize program enrollment
function initProgramEnrollment() {
const enrollButtons = document.querySelectorAll('.btn-program');

enrollButtons.forEach(button => {
button.addEventListener('click', function(e) {
e.preventDefault();

const programCard = this.closest('.program-card');
const programTitle = programCard.querySelector('.program-title').textContent;

handleProgramEnrollment(programTitle, this);
});
});

console.log(`${enrollButtons.length} enrollment buttons initialized`);
}

function handleProgramEnrollment(programTitle, button) {
console.log(`Enrollment requested for: ${programTitle}`);

// Show loading state
const originalText = button.textContent;
button.textContent = 'Processing...';
button.disabled = true;

// Simulate enrollment process
setTimeout(() => {
// Show enrollment modal or redirect to enrollment form
showEnrollmentModal(programTitle);

// Restore button
button.textContent = originalText;
button.disabled = false;
}, 1000);
}

function showEnrollmentModal(programTitle) {
// Create modal
const modal = document.createElement('div');
modal.className = 'enrollment-modal';
modal.innerHTML = `
<div class="modal-backdrop">
<div class="modal-content">
<div class="modal-header">
<h3>Enroll in ${programTitle}</h3>
<button class="modal-close">&times;</button>
</div>
<div class="modal-body">
<form class="enrollment-form">
<div class="form-group">
<label for="fullName">Full Name *</label>
<input type="text" id="fullName" name="fullName" required>
</div>
<div class="form-group">
<label for="email">Email Address *</label>
<input type="email" id="email" name="email" required>
</div>
<div class="form-group">
<label for="phone">Phone Number *</label>
<input type="tel" id="phone" name="phone" required>
</div>
<div class="form-group">
<label for="experience">Previous Experience</label>
<select id="experience" name="experience">
<option value="beginner">Beginner</option>
<option value="intermediate">Intermediate</option>
<option value="advanced">Advanced</option>
</select>
</div>
<div class="form-group">
<label for="motivation">Why do you want to join this program?</label>
<textarea id="motivation" name="motivation" rows="4"></textarea>
</div>
<div class="form-actions">
<button type="button" class="btn btn-outline">Cancel</button>
<button type="submit" class="btn btn-primary">Submit Enrollment</button>
</div>
</form>
</div>
</div>
</div>
`;

// Add modal styles
modal.style.cssText = `
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
z-index: 1000;
opacity: 0;
visibility: hidden;
transition: all 0.3s ease;
`;

// Add modal to page
document.body.appendChild(modal);

// Show modal
setTimeout(() => {
modal.style.opacity = '1';
modal.style.visibility = 'visible';
}, 10);

// Handle modal interactions
setupModalInteractions(modal, programTitle);
}

function setupModalInteractions(modal, programTitle) {
const closeBtn = modal.querySelector('.modal-close');
const cancelBtn = modal.querySelector('.btn-outline');
const form = modal.querySelector('.enrollment-form');
const backdrop = modal.querySelector('.modal-backdrop');

// Close modal functions
function closeModal() {
modal.style.opacity = '0';
modal.style.visibility = 'hidden';
setTimeout(() => {
if (modal.parentNode) {
modal.parentNode.removeChild(modal);
}
}, 300);
}

// Event listeners
if (closeBtn) {
closeBtn.addEventListener('click', closeModal);
}

if (cancelBtn) {
cancelBtn.addEventListener('click', closeModal);
}

// Close on backdrop click
backdrop.addEventListener('click', function(e) {
if (e.target === backdrop) {
closeModal();
}
});

// Handle form submission
if (form) {
form.addEventListener('submit', function(e) {
e.preventDefault();
handleEnrollmentSubmission(form, programTitle, closeModal);
});
}

// Close on escape key
document.addEventListener('keydown', function(e) {
if (e.key === 'Escape') {
closeModal();
}
});
}

function handleEnrollmentSubmission(form, programTitle, closeModal) {
const formData = new FormData(form);
const data = Object.fromEntries(formData);

console.log('Enrollment submission:', { program: programTitle, ...data });

const submitBtn = form.querySelector('button[type="submit"]');
const originalText = submitBtn.textContent;

// Show loading state
submitBtn.textContent = 'Submitting...';
submitBtn.disabled = true;

// Simulate submission
setTimeout(() => {
// Show success message
if (window.JETechHub && window.JETechHub.showNotification) {
window.JETechHub.showNotification(
`Thank you! Your enrollment for ${programTitle} has been submitted. We'll contact you soon.`,
'success'
);
}

// Close modal
closeModal();

// Reset form
form.reset();
submitBtn.textContent = originalText;
submitBtn.disabled = false;
}, 2000);
}

// Initialize sidebar navigation
function initSidebarNavigation() {
const sidebarLinks = document.querySelectorAll('.sidebar-link');

sidebarLinks.forEach(link => {
link.addEventListener('click', function(e) {
e.preventDefault();

const targetId = this.getAttribute('href').substring(1);
const targetElement = document.getElementById(targetId);

if (targetElement) {
// Remove active class from all sidebar links
sidebarLinks.forEach(l => l.classList.remove('active'));

// Add active class to clicked link
this.classList.add('active');

// Scroll to target
const headerHeight = document.querySelector('.header').offsetHeight;
const targetPosition = targetElement.offsetTop - headerHeight - 20;

window.scrollTo({
top: targetPosition,
behavior: 'smooth'
});
}
});
});

// Update active sidebar link on scroll
const programCards = document.querySelectorAll('.program-card');
if (programCards.length > 0) {
const observer = new IntersectionObserver(
(entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
const programTitle = entry.target.querySelector('.program-title').textContent;
const correspondingLink = Array.from(sidebarLinks).find(link => 
link.textContent.trim() === programTitle.trim()
);

if (correspondingLink) {
sidebarLinks.forEach(l => l.classList.remove('active'));
correspondingLink.classList.add('active');
}
}
});
},
{
threshold: 0.3,
rootMargin: '-100px 0px -50% 0px'
}
);

programCards.forEach(card => observer.observe(card));
}

console.log('Sidebar navigation initialized');
}

// Initialize program filtering (placeholder for future enhancement)
function initProgramFiltering() {
// This could be enhanced to add filtering by duration, level, etc.
console.log('Program filtering ready for future implementation');
}

// Program statistics animation
function animateProgramStats() {
const statsElements = document.querySelectorAll('.stat-number');

statsElements.forEach(element => {
const target = parseInt(element.textContent);
const suffix = element.textContent.replace(/[0-9]/g, '');
let current = 0;
const increment = target / 100;
const duration = 2000; // 2 seconds
const stepTime = duration / 100;

const timer = setInterval(() => {
current += increment;
if (current >= target) {
element.textContent = target + suffix;
clearInterval(timer);
} else {
element.textContent = Math.floor(current) + suffix;
}
}, stepTime);
});
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
// Only initialize programs functionality if we're on the programs page
if (document.body.classList.contains('programs-page') || 
window.location.pathname.includes('programs')) {
initProgramsPage();

// Animate stats when they come into view
const statsSection = document.querySelector('.programs-cta');
if (statsSection) {
const observer = new IntersectionObserver(
(entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
animateProgramStats();
observer.unobserve(entry.target);
}
});
},
{ threshold: 0.5 }
);

observer.observe(statsSection);
}
}
});

// Export functions for potential use
window.ProgramsPage = {
ProgramSlideshow,
showEnrollmentModal,
animateProgramStats
};

console.log('Programs JavaScript loaded successfully');

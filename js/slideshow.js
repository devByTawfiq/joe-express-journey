
/**
 * Course Card Slideshow
 * Automatically rotates images in course cards every 5 seconds
 */

document.addEventListener('DOMContentLoaded', function() {
    // Find all card slideshow containers
    const slideshows = document.querySelectorAll('.card-slideshow');
    
    // Initialize each slideshow
    slideshows.forEach(slideshow => {
        const images = slideshow.querySelectorAll('img');
        const container = slideshow.closest('.course-image') || slideshow.closest('.card-image') || slideshow.parentElement;
        let currentIndex = 0;
        
        // Handle fallback images
        images.forEach(img => {
            img.addEventListener('error', function() {
                // Use a default placeholder image if the image fails to load
                const category = img.closest('.gadget-item')?.dataset?.category || 'general';
                let fallbackSrc = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop&q=60'; // Default tech image
                
                if (category === 'phone') {
                    fallbackSrc = 'https://images.unsplash.com/photo-1511707171634-5f897ff02ff9?w=800&auto=format&fit=crop&q=60';
                } else if (category === 'laptop') {
                    fallbackSrc = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=60';
                } else if (category === 'tablet') {
                    fallbackSrc = 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=60';
                } else if (category === 'accessory') {
                    fallbackSrc = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60';
                }
                
                this.src = fallbackSrc;
            });
        });
        
        // Create dots for navigation only if there are multiple images
        if (images.length > 1) {
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'slideshow-controls';
            
            for (let i = 0; i < images.length; i++) {
                const dot = document.createElement('div');
                dot.className = i === 0 ? 'slideshow-dot active' : 'slideshow-dot';
                dot.dataset.index = i;
                dot.addEventListener('click', () => {
                    showImage(i);
                });
                dotsContainer.appendChild(dot);
            }
            
            container.appendChild(dotsContainer);
        }
        
        // Set initial state - show first image
        if (images.length > 0) {
            images[0].classList.add('active');
        }
        
        // Function to show a specific image
        function showImage(index) {
            // Hide all images
            images.forEach(img => img.classList.remove('active'));
            
            // Update dots if they exist
            const dots = container.querySelectorAll('.slideshow-dot');
            if (dots.length) {
                dots.forEach(dot => dot.classList.remove('active'));
                dots[index].classList.add('active');
            }
            
            // Show the selected image
            images[index].classList.add('active');
            currentIndex = index;
        }
        
        // Auto-rotate images every 5 seconds if there are multiple images
        if (images.length > 1) {
            setInterval(() => {
                currentIndex = (currentIndex + 1) % images.length;
                showImage(currentIndex);
            }, 5000);
        }
    });

    console.log("Slideshow script initialized with", document.querySelectorAll('.card-slideshow').length, "slideshows");
});

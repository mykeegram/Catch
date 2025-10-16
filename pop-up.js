// Function to open story popup
function openStoryPopup(storyData) {
    const popup = document.getElementById('story-popup');
    popup.classList.add('active');
    document.body.classList.add('popup-open');
    
    // Create content container if it doesn't exist
    if (!popup.querySelector('#story-popup-content')) {
        const content = document.createElement('div');
        content.id = 'story-popup-content';
        popup.appendChild(content);
    }
}

// Function to close story popup
function closeStoryPopup() {
    const popup = document.getElementById('story-popup');
    popup.classList.remove('active');
    document.body.classList.remove('popup-open');
}

// Swipe down gesture to close popup
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('story-popup');
    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    let popupContent = null;
    
    if (popup) {
        popup.addEventListener('touchstart', function(e) {
            popupContent = popup.querySelector('#story-popup-content');
            if (!popupContent) return;
            
            startY = e.touches[0].clientY;
            isDragging = true;
            popupContent.style.transition = 'none';
        });
        
        popup.addEventListener('touchmove', function(e) {
            if (!isDragging || !popupContent) return;
            
            currentY = e.touches[0].clientY;
            const deltaY = currentY - startY;
            
            // Only allow downward swipes
            if (deltaY > 0) {
                popupContent.style.transform = `translateY(${deltaY}px)`;
            }
        });
        
        popup.addEventListener('touchend', function(e) {
            if (!isDragging || !popupContent) return;
            
            const deltaY = currentY - startY;
            popupContent.style.transition = 'transform 0.3s ease';
            
            // If swiped down more than 150px, close the popup
            if (deltaY > 150) {
                popupContent.style.transform = 'translateY(100%)';
                setTimeout(() => {
                    closeStoryPopup();
                    popupContent.style.transform = 'translateY(0)';
                }, 300);
            } else {
                // Reset to original position
                popupContent.style.transform = 'translateY(0)';
            }
            
            isDragging = false;
            startY = 0;
            currentY = 0;
        });
    }
});

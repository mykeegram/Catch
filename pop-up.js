// Function to open story popup
function openStoryPopup(storyData) {
    const popup = document.getElementById('story-popup');
    popup.classList.add('active');
    document.body.classList.add('popup-open');
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
    
    if (popup) {
        popup.addEventListener('touchstart', function(e) {
            startY = e.touches[0].clientY;
            isDragging = true;
            popup.style.transition = 'none';
        });
        
        popup.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            
            currentY = e.touches[0].clientY;
            const deltaY = currentY - startY;
            
            // Only allow downward swipes
            if (deltaY > 0) {
                popup.style.transform = `translateY(${deltaY}px)`;
            }
        });
        
        popup.addEventListener('touchend', function(e) {
            if (!isDragging) return;
            
            const deltaY = currentY - startY;
            popup.style.transition = 'transform 0.3s ease';
            
            // If swiped down more than 150px, close the popup
            if (deltaY > 150) {
                popup.style.transform = 'translateY(100%)';
                setTimeout(() => {
                    closeStoryPopup();
                    popup.style.transform = 'translateY(0)';
                }, 300);
            } else {
                // Reset to original position
                popup.style.transform = 'translateY(0)';
            }
            
            isDragging = false;
            startY = 0;
            currentY = 0;
        });
    }
});

        // Function to open story popup
function openStoryPopup(story) {
    const popup = document.getElementById('story-popup');
    popup.classList.add('active');
    document.body.classList.add('popup-open');
    
    // Remove existing reply box
    const existingReplyBox = popup.querySelector('.reply-box');
    if (existingReplyBox) {
        existingReplyBox.remove();
    }
    
    // Only show reply box if it's NOT "Your story"
    if (story.username !== "Your story") {
        const replyBox = document.createElement('div');
        replyBox.className = 'reply-box';
        replyBox.innerHTML = '<span class="reply-placeholder">Reply privately...</span>';
        popup.appendChild(replyBox);
    }
}

// Function to close story popup
function closeStoryPopup() {
    const popup = document.getElementById('story-popup');
    popup.classList.remove('active');
    document.body.classList.remove('popup-open');
}

// Swipe down to close popup
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('story-popup');
    let startY = 0;
    let currentY = 0;
    
    if (popup) {
        popup.addEventListener('touchstart', function(e) {
            startY = e.touches[0].clientY;
            currentY = startY;
        });
        
        popup.addEventListener('touchmove', function(e) {
            currentY = e.touches[0].clientY;
        });
        
        popup.addEventListener('touchend', function(e) {
            const deltaY = currentY - startY;
            
            // Swipe down to close
            if (deltaY > 100) {
                closeStoryPopup();
            }
        });
    }
});

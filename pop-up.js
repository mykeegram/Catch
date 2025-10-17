// Global variables for story navigation
let currentStoryIndex = 0;
let allStories = [];
let rotationY = 0;

// Function to open story popup
function openStoryPopup(storyData) {
    const popup = document.getElementById('story-popup');
    popup.classList.add('active');
    document.body.classList.add('popup-open');
    
    // Find the index of the clicked story
    currentStoryIndex = stories.findIndex(s => s.username === storyData.username);
    allStories = stories;
    rotationY = 0;
    
    // Create content container if it doesn't exist
    let content = popup.querySelector('#story-popup-content');
    if (!content) {
        content = document.createElement('div');
        content.id = 'story-popup-content';
        popup.appendChild(content);
    }
    
    // Render the 3D box
    renderStoryBox();
}

// Function to render 3D story box
function renderStoryBox() {
    const content = document.getElementById('story-popup-content');
    content.innerHTML = '';
    
    const container = document.createElement('div');
    container.className = 'story-box-container';
    
    // Get stories in circular order
    const stories_order = [
        allStories[currentStoryIndex],
        allStories[(currentStoryIndex + 1) % allStories.length],
        allStories[(currentStoryIndex + 2) % allStories.length]
    ];
    
    // Create cube faces
    const faces = ['front', 'right'];
    faces.forEach((face, index) => {
        const faceEl = document.createElement('div');
        faceEl.className = `story-box-face story-box-${face}`;
        
        // Add reply input for right face (Chizaram and VaVia)
        if (face === 'right') {
            const replyInput = document.createElement('div');
            replyInput.className = 'reply-input';
            replyInput.textContent = 'Reply privately...';
            faceEl.appendChild(replyInput);
        }
        
        container.appendChild(faceEl);
    });
    
    container.style.transform = `rotateY(${rotationY}deg)`;
    content.appendChild(container);
}

// Function to close story popup
function closeStoryPopup() {
    const popup = document.getElementById('story-popup');
    popup.classList.remove('active');
    document.body.classList.remove('popup-open');
}

// Pure dragging functionality (no swiping)
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('story-popup');
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    
    if (popup) {
        popup.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
        });
        
        popup.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;
            
            const container = popup.querySelector('.story-box-container');
            if (!container) return;
            
            // Only rotate if horizontal drag is more dominant
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                const dragRotation = (deltaX / 5);
                container.style.transition = 'none';
                container.style.transform = `rotateY(${rotationY + dragRotation}deg)`;
            }
        });
        
        popup.addEventListener('touchend', function(e) {
            if (!isDragging) return;
            isDragging = false;
            
            const currentX = e.changedTouches[0].clientX;
            const currentY = e.changedTouches[0].clientY;
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;
            
            const container = popup.querySelector('.story-box-container');
            if (!container) return;
            
            container.style.transition = 'transform 0.6s ease-out';
            
            // Close on vertical drag down only
            if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 100) {
                closeStoryPopup();
                return;
            }
            
            // Check if dragged enough to go to next/previous story
            const dragThreshold = 100;
            
            if (Math.abs(deltaX) > dragThreshold) {
                if (deltaX > 0) {
                    // Dragged right - go to previous story (only if not at "Your story")
                    if (currentStoryIndex > 0) {
                        currentStoryIndex = (currentStoryIndex - 1 + allStories.length) % allStories.length;
                        rotationY += 90;
                        renderStoryBox();
                    } else {
                        // At "Your story" - close popup
                        container.style.transition = 'transform 0.3s ease';
                        closeStoryPopup();
                    }
                } else {
                    // Dragged left - go to next story (only if not at last story)
                    if (currentStoryIndex < allStories.length - 1) {
                        currentStoryIndex = (currentStoryIndex + 1) % allStories.length;
                        rotationY -= 90;
                        renderStoryBox();
                    } else {
                        // At last story - close popup
                        container.style.transition = 'transform 0.3s ease';
                        closeStoryPopup();
                    }
                }
            } else {
                // Didn't drag far enough - snap back
                container.style.transform = `rotateY(${rotationY}deg)`;
            }
        });
    }
});

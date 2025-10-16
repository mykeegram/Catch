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
        allStories[(currentStoryIndex + 2) % allStories.length],
        allStories[(currentStoryIndex + 3) % allStories.length]
    ];
    
    // Create cube faces
    const faces = ['front', 'right', 'back', 'left', 'top', 'bottom'];
    faces.forEach((face, index) => {
        const faceEl = document.createElement('div');
        faceEl.className = `story-box-face story-box-${face}`;
        
        if (index < 4) {
            faceEl.textContent = stories_order[index].username;
        }
        
        container.appendChild(faceEl);
    });
    
    container.style.transform = `rotateY(${rotationY}deg)`;
    content.appendChild(container);
}

// Function to rotate to next story
function nextStory() {
    currentStoryIndex = (currentStoryIndex + 1) % allStories.length;
    rotationY -= 90;
    renderStoryBox();
}

// Function to rotate to previous story
function prevStory() {
    currentStoryIndex = (currentStoryIndex - 1 + allStories.length) % allStories.length;
    rotationY += 90;
    renderStoryBox();
}

// Function to close story popup
function closeStoryPopup() {
    const popup = document.getElementById('story-popup');
    popup.classList.remove('active');
    document.body.classList.remove('popup-open');
}

// Touch/drag functionality
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('story-popup');
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let dragStartTime = 0;
    
    if (popup) {
        popup.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
            dragStartTime = Date.now();
        });
        
        popup.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;
            
            // Only preview rotation if horizontal swipe is more dominant
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                const container = popup.querySelector('.story-box-container');
                if (container) {
                    const previewRotation = (deltaX / 10);
                    container.style.transition = 'none';
                    container.style.transform = `rotateY(${rotationY - previewRotation}deg)`;
                }
            }
        });
        
        popup.addEventListener('touchend', function(e) {
            if (!isDragging) return;
            isDragging = false;
            
            const currentX = e.changedTouches[0].clientX;
            const currentY = e.changedTouches[0].clientY;
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;
            const dragDuration = Date.now() - dragStartTime;
            const velocity = Math.abs(deltaX) / dragDuration;
            
            const container = popup.querySelector('.story-box-container');
            if (container) {
                container.style.transition = 'transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            }
            
            // Close on vertical swipe
            if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 100) {
                closeStoryPopup();
                return;
            }
            
            // Rotate on horizontal swipe
            const threshold = 80;
            if (Math.abs(deltaX) > threshold || velocity > 0.3) {
                if (deltaX > 0) {
                    nextStory();
                } else {
                    prevStory();
                }
            } else {
                // Snap back
                const container = popup.querySelector('.story-box-container');
                if (container) {
                    container.style.transform = `rotateY(${rotationY}deg)`;
                }
            }
        });
    }
});

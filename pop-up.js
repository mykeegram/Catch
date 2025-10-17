// Global variables for story navigation
let currentStoryIndex = 0;
let allStories = [];

// Function to open story popup
function openStoryPopup(story) {
    const popup = document.getElementById('story-popup');
    popup.classList.add('active');
    document.body.classList.add('popup-open');
    
    // Find the index of the clicked story
    currentStoryIndex = stories.findIndex(s => s.username === story.username);
    allStories = stories;
    
    // Create content container if it doesn't exist
    let content = popup.querySelector('#story-popup-content');
    if (!content) {
        content = document.createElement('div');
        content.id = 'story-popup-content';
        popup.appendChild(content);
    }
    
    // Render the story cube
    renderStoryCube();
}

// Function to render story cube
function renderStoryCube() {
    const content = document.getElementById('story-popup-content');
    content.innerHTML = '';
    
    const container = document.createElement('div');
    container.className = 'story-cube-container';
    
    // Create cube faces for all stories
    for (let i = 0; i < allStories.length; i++) {
        const story = allStories[i];
        const face = document.createElement('div');
        face.className = 'story-cube-face';
        
        // Calculate rotation angle for each face
        const anglePerFace = 360 / allStories.length;
        const rotationAngle = (i - currentStoryIndex) * anglePerFace;
        
        face.style.transform = `rotateY(${rotationAngle}deg) translateZ(200px)`;
        
        // Set background image or color
        if (story.isImage) {
            face.style.backgroundImage = `url(${story.avatar})`;
        } else {
            face.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            face.style.fontSize = '48px';
            face.style.fontWeight = 'bold';
            face.style.color = 'white';
            face.textContent = story.username;
        }
        
        container.appendChild(face);
    }
    
    content.appendChild(container);
    
    // Add reply box if not "Your story"
    const currentStory = allStories[currentStoryIndex];
    if (currentStory.username !== "Your story") {
        const replyBox = document.createElement('div');
        replyBox.className = 'reply-box';
        replyBox.innerHTML = `<span class="reply-placeholder">Reply to ${currentStory.username}'s Story</span>`;
        container.appendChild(replyBox);
    }
}

// Function to switch to a specific story
function switchToStory(newIndex) {
    if (newIndex < 0 || newIndex >= allStories.length) return;
    
    currentStoryIndex = newIndex;
    renderStoryCube();
}

// Function to close story popup
function closeStoryPopup() {
    const popup = document.getElementById('story-popup');
    popup.classList.remove('active');
    document.body.classList.remove('popup-open');
}

// Swipe down to close and horizontal swipe/drag to navigate
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('story-popup');
    let startY = 0;
    let startX = 0;
    let currentY = 0;
    let currentX = 0;
    let isDragging = false;
    
    if (popup) {
        popup.addEventListener('touchstart', function(e) {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
            currentY = startY;
            currentX = startX;
            isDragging = true;
        });
        
        popup.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            currentY = e.touches[0].clientY;
            currentX = e.touches[0].clientX;
            
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;
            
            // Only allow dragging if it's more horizontal than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                const container = popup.querySelector('.story-cube-container');
                if (container) {
                    // Rotate cube based on drag distance
                    const anglePerFace = 360 / allStories.length;
                    const dragRotation = (deltaX / 100) * anglePerFace;
                    container.style.transition = 'none';
                    container.style.transform = `rotateY(${dragRotation}deg)`;
                }
            }
        });
        
        popup.addEventListener('touchend', function(e) {
            const deltaY = currentY - startY;
            const deltaX = currentX - startX;
            
            // Swipe down to close
            if (deltaY > 100 && Math.abs(deltaY) > Math.abs(deltaX)) {
                closeStoryPopup();
                isDragging = false;
                return;
            }
            
            const container = popup.querySelector('.story-cube-container');
            if (container) {
                container.style.transition = 'transform 0.6s ease';
                container.style.transform = 'rotateY(0deg)';
            }
            
            // Swipe left - next story
            if (deltaX < -50) {
                switchToStory((currentStoryIndex + 1) % allStories.length);
            }
            // Swipe right - previous story
            else if (deltaX > 50) {
                switchToStory((currentStoryIndex - 1 + allStories.length) % allStories.length);
            }
            
            isDragging = false;
        });
    }
});

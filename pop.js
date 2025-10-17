// Global variables for story navigation
let currentStoryIndex = 0;
let allStories = [];
let likedStories = {
    'Chizaram': false,
    'VaVia': false
};

// Load liked stories from memory on startup
function loadLikedStories() {
    if (typeof likedStories === 'object') {
        // Initialize liked state for each story
        allStories.forEach(story => {
            if (story.username !== "Your story" && !(story.username in likedStories)) {
                likedStories[story.username] = false;
            }
        });
    }
}

// Function to open story popup
function openStoryPopup(story) {
    const popup = document.getElementById('story-popup');
    popup.classList.add('active');
    document.body.classList.add('popup-open');
    
    // Find the index of the clicked story
    currentStoryIndex = stories.findIndex(s => s.username === story.username);
    allStories = stories;
    loadLikedStories();
    
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
        
        // Reduced translateZ for closer cube faces
        face.style.transform = `rotateY(${rotationAngle}deg) translateZ(100px)`;
        
        // Create ash-white content div
        const contentDiv = document.createElement('div');
        contentDiv.className = 'story-content-div';
        
        face.appendChild(contentDiv);
        
        // Add reply box to each face if not "Your story"
        if (story.username !== "Your story") {
            const replyBox = document.createElement('div');
            replyBox.className = 'reply-box';
            
            const replySpan = document.createElement('span');
            replySpan.className = 'reply-placeholder';
            replySpan.textContent = `Reply to ${story.username}'s Story`;
            
            const heartIcon = document.createElement('div');
            heartIcon.className = 'heart-icon';
            heartIcon.dataset.username = story.username;
            
            // Check if this story is liked
            if (likedStories[story.username]) {
                heartIcon.classList.add('liked');
            }
            
            heartIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`;
            
            heartIcon.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleLike(story.username, heartIcon);
            });
            
            replyBox.appendChild(replySpan);
            replyBox.appendChild(heartIcon);
            face.appendChild(replyBox);
        }
        
        container.appendChild(face);
    }
    
    content.appendChild(container);
}

// Function to toggle like
function toggleLike(username, heartElement) {
    likedStories[username] = !likedStories[username];
    
    if (likedStories[username]) {
        heartElement.classList.add('liked');
    } else {
        heartElement.classList.remove('liked');
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
                    // Rotate cube based on drag distance, reduced sensitivity
                    const anglePerFace = 360 / allStories.length;
                    const dragRotation = (deltaX / 200) * anglePerFace;
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
                container.style.transition = 'transform 0.4s ease';
                container.style.transform = 'rotateY(0deg)';
            }
            
            // Swipe left - next story
            if (deltaX < -100) {
                switchToStory((currentStoryIndex + 1) % allStories.length);
            }
            // Swipe right - previous story
            else if (deltaX > 100) {
                switchToStory((currentStoryIndex - 1 + allStories.length) % allStories.length);
            }
            
            isDragging = false;
        });
    }
});

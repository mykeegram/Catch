// Global variables for story navigation
let currentUserIndex = 0;
let currentInternalStoryIndex = 0;
let allStories = [];
let likedStories = {};

// Store internal stories for each user
const userInternalStories = {
    'Your story': [
        { id: 1, title: 'Your Story 1' },
        { id: 2, title: 'Your Story 2' },
        { id: 3, title: 'Your Story 3' }
    ],
    'Chizaram': [
        { id: 1, title: 'Chizaram Story 1' },
        { id: 2, title: 'Chizaram Story 2' },
        { id: 3, title: 'Chizaram Story 3' },
        { id: 4, title: 'Chizaram Story 4' }
    ],
    'VaVia': [
        { id: 1, title: 'VaVia Story 1' },
        { id: 2, title: 'VaVia Story 2' }
    ]
};

// Load liked stories from memory on startup
function loadLikedStories() {
    if (typeof likedStories === 'object') {
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
    popup.classList.remove('closing');
    document.body.classList.add('popup-open');
    
    // Find the index of the clicked story
    currentUserIndex = stories.findIndex(s => s.username === story.username);
    currentInternalStoryIndex = 0;
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
        const rotationAngle = (i - currentUserIndex) * anglePerFace;
        
        // Reduced translateZ for closer cube faces
        face.style.transform = `rotateY(${rotationAngle}deg) translateZ(100px)`;
        
        // Create story content div with gradient based on internal story index
        const contentDiv = document.createElement('div');
        contentDiv.className = 'story-content-div';
        
        // Apply gradient class if this is not the first internal story
        if (currentInternalStoryIndex > 0) {
            const gradientClass = `gradient-${(currentInternalStoryIndex % 6) || 1}`;
            contentDiv.classList.add(gradientClass);
        }
        
        face.appendChild(contentDiv);
        
        // Add tap zones for internal navigation
        const tapZoneLeft = document.createElement('div');
        tapZoneLeft.className = 'tap-zone tap-zone-left';
        tapZoneLeft.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateInternalStory(-1);
        });
        face.appendChild(tapZoneLeft);
        
        const tapZoneRight = document.createElement('div');
        tapZoneRight.className = 'tap-zone tap-zone-right';
        tapZoneRight.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateInternalStory(1);
        });
        face.appendChild(tapZoneRight);
        
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

// Function to navigate internal stories (tap left/right)
function navigateInternalStory(direction) {
    const currentUsername = allStories[currentUserIndex].username;
    const internalStories = userInternalStories[currentUsername] || [];
    
    const newIndex = currentInternalStoryIndex + direction;
    
    // Clamp to valid range
    if (newIndex >= 0 && newIndex < internalStories.length) {
        currentInternalStoryIndex = newIndex;
        renderStoryCube();
    }
}

// Function to switch to a specific user story
function switchToUserStory(newIndex) {
    // Check if trying to go back from first user
    if (newIndex < 0) {
        closeStoryPopupWithAnimation();
        return;
    }
    
    // Check if trying to go forward from last user
    if (newIndex >= allStories.length) {
        closeStoryPopupWithAnimation();
        return;
    }
    
    currentUserIndex = newIndex;
    currentInternalStoryIndex = 0;
    renderStoryCube();
}

// Function to close story popup with pop-out animation
function closeStoryPopupWithAnimation() {
    const popup = document.getElementById('story-popup');
    popup.classList.add('closing');
    
    setTimeout(() => {
        popup.classList.remove('active');
        popup.classList.remove('closing');
        document.body.classList.remove('popup-open');
    }, 300);
}

// Function to close story popup immediately
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
                    // For edge users (Your story and VaVia), limit drag rotation
                    const isEdgeUser = currentUserIndex === 0 || currentUserIndex === allStories.length - 1;
                    const maxDragRotation = isEdgeUser ? 20 : 60; // Reduced limit for edge users
                    
                    let dragRotation = (deltaX / 200) * (360 / allStories.length);
                    dragRotation = Math.max(-maxDragRotation, Math.min(maxDragRotation, dragRotation));
                    
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
                closeStoryPopupWithAnimation();
                isDragging = false;
                return;
            }
            
            const container = popup.querySelector('.story-cube-container');
            if (container) {
                container.style.transition = 'transform 0.4s ease';
                container.style.transform = 'rotateY(0deg)';
            }
            
            const isEdgeUser = currentUserIndex === 0 || currentUserIndex === allStories.length - 1;
            
            if (isEdgeUser) {
                // For edge users, check if swipe is strong enough to trigger action
                const swipeThreshold = 150; // Higher threshold for edge users
                
                // Swipe left on last user or swipe right on first user - close popup
                if ((deltaX < -swipeThreshold && currentUserIndex === allStories.length - 1) ||
                    (deltaX > swipeThreshold && currentUserIndex === 0)) {
                    closeStoryPopupWithAnimation();
                } else {
                    // Reset if threshold not met
                    container.style.transform = 'rotateY(0deg)';
                }
            } else {
                // For middle users, use normal swipe behavior
                if (deltaX < -100) {
                    switchToUserStory(currentUserIndex + 1);
                } else if (deltaX > 100) {
                    switchToUserStory(currentUserIndex - 1);
                }
            }
            
            isDragging = false;
        });
    }
});

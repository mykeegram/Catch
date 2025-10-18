// Global variables for story navigation
let currentUserIndex = 0;
let currentInternalStoryIndex = 0;
let allStories = [];
let likedStories = {
    'Chizaram': false,
    'VaVia': false
};

// Story data structure with internal stories
const storyDatabase = {
    'Your story': {
        internalStories: [
            { id: 1, content: 'Your Story 1' },
            { id: 2, content: 'Your Story 2' },
            { id: 3, content: 'Your Story 3' }
        ]
    },
    'Chizaram': {
        internalStories: [
            { id: 1, content: 'Chizaram Story 1' },
            { id: 2, content: 'Chizaram Story 2' },
            { id: 3, content: 'Chizaram Story 3' },
            { id: 4, content: 'Chizaram Story 4' }
        ]
    },
    'VaVia': {
        internalStories: [
            { id: 1, content: 'VaVia Story 1' },
            { id: 2, content: 'VaVia Story 2' }
        ]
    }
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
    
    // Create cube faces for all stories (users)
    for (let i = 0; i < allStories.length; i++) {
        const story = allStories[i];
        const face = document.createElement('div');
        face.className = 'story-cube-face';
        
        // Calculate rotation angle for each face
        const anglePerFace = 360 / allStories.length;
        const rotationAngle = (i - currentUserIndex) * anglePerFace;
        
        // Reduced translateZ for closer cube faces
        face.style.transform = `rotateY(${rotationAngle}deg) translateZ(100px)`;
        
        // Create ash-white content div
        const contentDiv = document.createElement('div');
        contentDiv.className = 'story-content-div';
        
        // Add internal story content
        const currentUser = story.username;
        const internalStories = storyDatabase[currentUser]?.internalStories || [];
        const internalStory = internalStories[currentInternalStoryIndex] || { content: 'No story' };
        
        contentDiv.innerHTML = `<div class="internal-story-content">${internalStory.content}</div>`;
        
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
    
    // Add tap zones for internal story navigation
    addTapZones(content);
}

// Add tap zones for internal story navigation
function addTapZones(content) {
    const leftZone = document.createElement('div');
    leftZone.className = 'tap-zone tap-zone-left';
    leftZone.addEventListener('click', function(e) {
        e.stopPropagation();
        navigateInternalStory(-1);
    });
    content.appendChild(leftZone);
    
    const rightZone = document.createElement('div');
    rightZone.className = 'tap-zone tap-zone-right';
    rightZone.addEventListener('click', function(e) {
        e.stopPropagation();
        navigateInternalStory(1);
    });
    content.appendChild(rightZone);
}

// Check if element is within reply box or heart icon
function isClickOnInteractiveElement(element) {
    return element.closest('.reply-box') || element.closest('.heart-icon');
}

// Navigate internal stories (tap left/right)
function navigateInternalStory(direction) {
    const currentUser = allStories[currentUserIndex];
    const internalStories = storyDatabase[currentUser.username]?.internalStories || [];
    
    const newIndex = currentInternalStoryIndex + direction;
    
    // Check bounds
    if (newIndex < 0 || newIndex >= internalStories.length) {
        return; // Don't navigate out of bounds for internal stories
    }
    
    currentInternalStoryIndex = newIndex;
    renderStoryCube();
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

// Function to switch to a specific user's story
function switchToUserStory(newUserIndex) {
    if (newUserIndex < 0 || newUserIndex >= allStories.length) {
        // If trying to go before first user or after last user, close popup
        closeStoryPopup();
        return;
    }
    
    currentUserIndex = newUserIndex;
    currentInternalStoryIndex = 0; // Reset to first internal story
    renderStoryCube();
}

// Function to close story popup
function closeStoryPopup() {
    const popup = document.getElementById('story-popup');
    popup.classList.remove('active');
    document.body.classList.remove('popup-open');
}

// Swipe down to close and horizontal swipe/drag to navigate between users
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
            
            // Swipe left - next user's story or close if on last user
            if (deltaX < -100) {
                if (currentUserIndex === allStories.length - 1) {
                    closeStoryPopup();
                } else {
                    switchToUserStory(currentUserIndex + 1);
                }
            }
            // Swipe right - previous user's story or close if on first user
            else if (deltaX > 100) {
                if (currentUserIndex === 0) {
                    closeStoryPopup();
                } else {
                    switchToUserStory(currentUserIndex - 1);
                }
            }
            
            isDragging = false;
        });
    }
});

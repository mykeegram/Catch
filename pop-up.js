// Global variables for story navigation
let currentUserIndex = 0;
let currentInternalStoryIndex = 0;
let allStories = [];
let likedStories = {};

// Store internal stories for each user with their own like status
const userInternalStories = {
    'Your story': [
        { id: 1, title: 'Your Story 1', liked: false },
        { id: 2, title: 'Your Story 2', liked: false },
        { id: 3, title: 'Your Story 3', liked: false }
    ],
    'Chizaram': [
        { id: 1, title: 'Chizaram Story 1', liked: false },
        { id: 2, title: 'Chizaram Story 2', liked: false },
        { id: 3, title: 'Chizaram Story 3', liked: false },
        { id: 4, title: 'Chizaram Story 4', liked: false }
    ],
    'VaVia': [
        { id: 1, title: 'VaVia Story 1', liked: false },
        { id: 2, title: 'VaVia Story 2', liked: false }
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
        
        // Create story header (progress bar, profile pic, username, timestamp)
        const storyHeader = document.createElement('div');
        storyHeader.className = 'story-header';
        
        // Progress bars container
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-bars-container';
        
        const internalStories = userInternalStories[story.username] || [];
        for (let j = 0; j < internalStories.length; j++) {
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            
            const progressFill = document.createElement('div');
            progressFill.className = 'progress-fill';
            
            // Set progress based on current internal story index
            if (j < currentInternalStoryIndex) {
                progressFill.style.width = '100%';
            } else if (j === currentInternalStoryIndex) {
                progressFill.style.width = '50%'; // Static 50% for current story
            } else {
                progressFill.style.width = '0%';
            }
            
            progressBar.appendChild(progressFill);
            progressContainer.appendChild(progressBar);
        }
        
        storyHeader.appendChild(progressContainer);
        
        // User info row
        const userInfoRow = document.createElement('div');
        userInfoRow.className = 'story-user-info';
        
        // Profile picture
        const profilePic = document.createElement('img');
        profilePic.className = 'story-profile-pic';
        profilePic.src = story.profilePic;
        profilePic.alt = story.username;
        
        // Username and timestamp container
        const userTextContainer = document.createElement('div');
        userTextContainer.className = 'story-user-text';
        
        const username = document.createElement('span');
        username.className = 'story-username';
        username.textContent = story.username;
        
        const timestamp = document.createElement('span');
        timestamp.className = 'story-timestamp';
        timestamp.textContent = 'Oct 01 at 8:30 PM';
        
        userTextContainer.appendChild(username);
        userTextContainer.appendChild(timestamp);
        
        userInfoRow.appendChild(profilePic);
        userInfoRow.appendChild(userTextContainer);
        
        // Three-dot menu button
        const menuButton = document.createElement('div');
        menuButton.className = 'story-menu-button';
        menuButton.innerHTML = '⋮';
        menuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            // Add menu functionality here if needed
        });
        
        userInfoRow.appendChild(menuButton);
        storyHeader.appendChild(userInfoRow);
        
        // Create story content div with gradient based on internal story index
        const contentDiv = document.createElement('div');
        contentDiv.className = 'story-content-div';
        
        // Apply gradient class if this is not the first internal story
        if (currentInternalStoryIndex > 0) {
            const gradientClass = `gradient-${(currentInternalStoryIndex % 6) || 1}`;
            contentDiv.classList.add(gradientClass);
        }
        
        // Append header INSIDE the content div
        contentDiv.appendChild(storyHeader);
        
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
            heartIcon.dataset.storyId = currentInternalStoryIndex;
            
            // Get current internal story
            const internalStories = userInternalStories[story.username] || [];
            const currentStory = internalStories[currentInternalStoryIndex];
            
            // Check if this specific internal story is liked
            if (currentStory && currentStory.liked) {
                heartIcon.classList.add('liked');
            }
            
            heartIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`;
            
            heartIcon.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleLikeForInternalStory(story.username, currentInternalStoryIndex, heartIcon);
            });
            
            replyBox.appendChild(replySpan);
            replyBox.appendChild(heartIcon);
            face.appendChild(replyBox);
        }
        
        container.appendChild(face);
    }
    
    content.appendChild(container);
}

// Function to toggle like for specific internal story
function toggleLikeForInternalStory(username, storyIndex, heartElement) {
    const internalStories = userInternalStories[username];
    if (internalStories && internalStories[storyIndex]) {
        internalStories[storyIndex].liked = !internalStories[storyIndex].liked;
        
        if (internalStories[storyIndex].liked) {
            heartElement.classList.add('liked');
        } else {
            heartElement.classList.remove('liked');
        }
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
                    let maxDragRotation = 60; // Default for middle users
                    
                    // "Your story" (first user) - limit right swipe (positive deltaX), allow left swipe
                    if (currentUserIndex === 0) {
                        if (deltaX > 0) {
                            maxDragRotation = 20; // Limit right drag
                        } else {
                            maxDragRotation = 60; // Allow left drag
                        }
                    }
                    // "VaVia" (last user) - limit left swipe (negative deltaX), allow right swipe
                    else if (currentUserIndex === allStories.length - 1) {
                        if (deltaX < 0) {
                            maxDragRotation = 20; // Limit left drag
                        } else {
                            maxDragRotation = 60; // Allow right drag
                        }
                    }
                    
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
            
            const isFirstUser = currentUserIndex === 0;
            const isLastUser = currentUserIndex === allStories.length - 1;
            
            if (isFirstUser) {
                // "Your story" - allow going back to Chizaram, close on right swipe limit
                if (deltaX > 150) {
                    // Right swipe strong enough - close popup
                    closeStoryPopupWithAnimation();
                } else if (deltaX < -100) {
                    // Left swipe - go to Chizaram
                    switchToUserStory(currentUserIndex + 1);
                }
            } else if (isLastUser) {
                // "VaVia" - allow going back to previous user, close on left swipe limit
                if (deltaX < -150) {
                    // Left swipe strong enough - close popup
                    closeStoryPopupWithAnimation();
                } else if (deltaX > 100) {
                    // Right swipe - go to previous user
                    switchToUserStory(currentUserIndex - 1);
                }
            } else {
                // Middle users - normal behavior
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

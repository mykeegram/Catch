// Global variables for story navigation
let currentStoryIndex = 0;
let allStories = [];

// Function to open story popup
function openStoryPopup(storyData) {
    const popup = document.getElementById('story-popup');
    popup.classList.add('active');
    document.body.classList.add('popup-open');
    
    // Find the index of the clicked story
    currentStoryIndex = stories.findIndex(s => s.username === storyData.username);
    allStories = stories;
    
    // Create content container if it doesn't exist
    let content = popup.querySelector('#story-popup-content');
    if (!content) {
        content = document.createElement('div');
        content.id = 'story-popup-content';
        popup.appendChild(content);
    }
    
    // Render the story pages
    renderStoryPages();
}

// Function to render story pages
function renderStoryPages() {
    const content = document.getElementById('story-popup-content');
    content.innerHTML = '';
    
    // Create story pages for current, previous, and next
    for (let i = 0; i < allStories.length; i++) {
        const page = document.createElement('div');
        page.className = 'story-page';
        page.dataset.index = i;
        
        // Set page state
        if (i === currentStoryIndex) {
            page.classList.add('current');
        } else if (i === currentStoryIndex + 1 || (currentStoryIndex === allStories.length - 1 && i === 0)) {
            page.classList.add('next');
        } else {
            page.classList.add('prev');
        }
        
        // Style based on story
        const story = allStories[i];
        if (story.username === "Your story") {
            page.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        } else if (story.username === "Chizaram") {
            page.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
        } else if (story.username === "VaVia") {
            page.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
        }
        
        page.textContent = story.username;
        content.appendChild(page);
    }
}

// Function to switch to a specific story
function switchToStory(newIndex) {
    if (newIndex < 0 || newIndex >= allStories.length) return;
    
    const pages = document.querySelectorAll('.story-page');
    
    pages.forEach(page => {
        const pageIndex = parseInt(page.dataset.index);
        page.classList.remove('current', 'next', 'prev');
        
        if (pageIndex === newIndex) {
            page.classList.add('current');
        } else if (pageIndex === newIndex + 1 || (newIndex === allStories.length - 1 && pageIndex === 0)) {
            page.classList.add('next');
        } else {
            page.classList.add('prev');
        }
    });
    
    currentStoryIndex = newIndex;
}

// Function to close story popup
function closeStoryPopup() {
    const popup = document.getElementById('story-popup');
    popup.classList.remove('active');
    document.body.classList.remove('popup-open');
}

// 3D flip drag functionality
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('story-popup');
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;
    let popupContent = null;
    let dragStartTime = 0;
    
    if (popup) {
        popup.addEventListener('touchstart', function(e) {
            popupContent = popup.querySelector('#story-popup-content');
            if (!popupContent) return;
            
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            currentX = startX;
            currentY = startY;
            isDragging = true;
            dragStartTime = Date.now();
        });
        
        popup.addEventListener('touchmove', function(e) {
            if (!isDragging || !popupContent) return;
            
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;
            
            // Calculate rotation based on horizontal drag
            const pages = popupContent.querySelectorAll('.story-page');
            const maxRotation = 90;
            const dragThreshold = window.innerWidth / 3;
            const rotation = (deltaX / dragThreshold) * maxRotation;
            
            pages.forEach(page => {
                const pageIndex = parseInt(page.dataset.index);
                
                if (pageIndex === currentStoryIndex) {
                    // Current page rotates out
                    page.style.transition = 'none';
                    page.style.transform = `rotateY(${rotation}deg)`;
                } else if (deltaX < 0 && pageIndex === currentStoryIndex + 1) {
                    // Next page (swipe left)
                    page.style.transition = 'none';
                    page.style.transform = `rotateY(${90 + rotation}deg)`;
                } else if (deltaX > 0 && pageIndex === currentStoryIndex - 1) {
                    // Previous page (swipe right)
                    page.style.transition = 'none';
                    page.style.transform = `rotateY(${-90 + rotation}deg)`;
                }
            });
            
            // Handle vertical drag for close
            if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 0) {
                popupContent.style.transform = `translateY(${deltaY}px)`;
            }
        });
        
        popup.addEventListener('touchend', function(e) {
            if (!isDragging || !popupContent) return;
            
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;
            const dragDuration = Date.now() - dragStartTime;
            const velocity = Math.abs(deltaX) / dragDuration;
            
            const pages = popupContent.querySelectorAll('.story-page');
            
            // Reset transitions
            pages.forEach(page => {
                page.style.transition = 'transform 0.6s';
            });
            
            // Determine if vertical close
            if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 150) {
                popupContent.style.transition = 'transform 0.3s ease';
                popupContent.style.transform = 'translateY(100%)';
                setTimeout(() => {
                    closeStoryPopup();
                    popupContent.style.transform = 'translateY(0)';
                }, 300);
                isDragging = false;
                return;
            }
            
            // Determine if horizontal switch
            const threshold = window.innerWidth / 4;
            const shouldSwitch = Math.abs(deltaX) > threshold || velocity > 0.5;
            
            if (shouldSwitch) {
                if (deltaX < 0 && currentStoryIndex < allStories.length - 1) {
                    // Swipe left - next story
                    switchToStory(currentStoryIndex + 1);
                } else if (deltaX > 0 && currentStoryIndex > 0) {
                    // Swipe right - previous story
                    switchToStory(currentStoryIndex - 1);
                } else {
                    // Reset if at boundaries
                    switchToStory(currentStoryIndex);
                }
            } else {
                // Reset to current position
                switchToStory(currentStoryIndex);
            }
            
            // Reset vertical transform
            popupContent.style.transition = 'transform 0.3s ease';
            popupContent.style.transform = 'translateY(0)';
            
            isDragging = false;
            startX = 0;
            startY = 0;
            currentX = 0;
            currentY = 0;
        });
    }
});

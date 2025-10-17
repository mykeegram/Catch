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
    
    // Create story pages
    for (let i = 0; i < allStories.length; i++) {
        const page = document.createElement('div');
        page.className = 'story-page';
        page.dataset.index = i;
        
        // Set page state
        if (i === currentStoryIndex) {
            page.classList.add('current');
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

// Function to close story popup
function closeStoryPopup() {
    const popup = document.getElementById('story-popup');
    popup.classList.remove('active');
    document.body.classList.remove('popup-open');
}

// Close popup on touch
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('story-popup');
    
    if (popup) {
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                closeStoryPopup();
            }
        });
    }
});

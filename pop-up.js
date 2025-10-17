// Function to open story popup
function openStoryPopup(storyData) {
    const popup = document.getElementById('story-popup');
    popup.classList.add('active');
    document.body.classList.add('popup-open');
}

// Function to close story popup
function closeStoryPopup() {
    const popup = document.getElementById('story-popup');
    popup.classList.remove('active');
    document.body.classList.remove('popup-open');
}

// Close popup on click outside
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

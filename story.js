// Stories data
const stories = [
    {
        username: "Your story",
        avatar: "M",
        isImage: false,
        isYourStory: true,
        hasStory: true  // Set to false to show the + button
    },
    {
        username: "Chizaram",
        avatar: "C",
        isImage: false
    },
    {
        username: "VaVia",
        avatar: "https://i.ibb.co/C5b875C6/Screenshot-20250904-050841.jpg",
        isImage: true
    }
];

// Function to render stories
function renderStories() {
    const container = document.getElementById('stories-container');
    container.innerHTML = '';

    stories.forEach(story => {
        const storyItem = document.createElement('div');
        storyItem.className = 'story-item';

        const storyAvatar = document.createElement('div');
        storyAvatar.className = 'story-avatar';
        
        // Apply styling for "Your story"
        if (story.isYourStory) {
            storyAvatar.style.position = 'relative';
            // Only show gradient border if there's a story
            if (story.hasStory) {
                storyAvatar.style.background = 'linear-gradient(135deg, #54D079, #3FB963)';
            } else {
                storyAvatar.style.background = 'transparent';
            }
        }
        
        // Apply multiple story gradient for Chizaram
        if (story.username === 'Chizaram') {
            storyAvatar.style.background = `conic-gradient(
                from 0deg,
                #f09433 0deg,
                #e6683c 40deg,
                #dc2743 80deg,
                #cc2366 120deg,
                #bc1888 170deg,
                transparent 170deg 175deg,
                #f09433 175deg,
                #e6683c 215deg,
                #dc2743 255deg,
                #cc2366 295deg,
                #bc1888 355deg,
                transparent 355deg 360deg
            )`;
        }

        const avatarInner = document.createElement('div');
        avatarInner.className = 'story-avatar-inner';

        const avatarContent = document.createElement('div');
        avatarContent.className = 'story-avatar-content';

        if (story.isImage) {
            const img = document.createElement('img');
            img.src = story.avatar;
            img.alt = story.username;
            avatarContent.appendChild(img);
        } else {
            avatarContent.textContent = story.avatar;
            // Apply orange background for "Your story"
            if (story.isYourStory) {
                avatarContent.style.background = 'linear-gradient(135deg, #ff9500, #ff7b00)';
            }
        }

        avatarInner.appendChild(avatarContent);
        storyAvatar.appendChild(avatarInner);

        const username = document.createElement('div');
        username.className = 'story-username';
        username.textContent = story.username;

        storyItem.appendChild(storyAvatar);
        storyItem.appendChild(username);

        // Add plus button for "Your story" only if there's no story
        if (story.isYourStory && !story.hasStory) {
            const plusButton = document.createElement('div');
            plusButton.style.cssText = `
                position: absolute;
                bottom: 0;
                right: 0;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color: #749cbf;
                border: 2px solid white;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 16px;
                font-weight: 500;
                line-height: 1;
            `;
            plusButton.textContent = '+';
            storyAvatar.appendChild(plusButton);
        }

        container.appendChild(storyItem);
    });
}

// Render stories on page load
renderStories();

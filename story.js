// Stories data
const stories = [
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
        }

        avatarInner.appendChild(avatarContent);
        storyAvatar.appendChild(avatarInner);

        const username = document.createElement('div');
        username.className = 'story-username';
        username.textContent = story.username;

        storyItem.appendChild(storyAvatar);
        storyItem.appendChild(username);

        container.appendChild(storyItem);
    });
}

// Render stories on page load
renderStories();

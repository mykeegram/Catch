// chat.js
// Conversations data
const conversations = [
    {
        name: "Chizaram",
        message: "Yo! Chizaram's in",
        time: "Wed",
        badge: 1,
        avatar: "C",
        isImage: false
    },
    {
        name: "VaVia",
        message: "Hey there! How are you?",
        time: "Tue",
        badge: 2,
        avatar: "https://i.ibb.co/C5b875C6/Screenshot-20250904-050841.jpg",
        isImage: true
    }
];

// Sample chat messages for demonstration
const chatMessages = {
    'Chizaram': [
        { text: 'Yo! Chizaram\'s in', sender: 'received', time: 'Wed 10:30 AM' },
        { text: 'Hey! What\'s up?', sender: 'sent', time: 'Wed 10:32 AM' }
    ],
    'VaVia': [
        { text: 'Hey there! How are you?', sender: 'received', time: 'Tue 3:15 PM' },
        { text: 'I\'m good, you?', sender: 'sent', time: 'Tue 3:16 PM' }
    ]
};

// Function to render conversations
function renderConversations() {
    const container = document.getElementById('conversations-container');
    container.innerHTML = '';

    conversations.forEach(conv => {
        const conversationItem = document.createElement('div');
        conversationItem.className = 'conversation-item';

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar';
        
        if (conv.isImage) {
            const img = document.createElement('img');
            img.src = conv.avatar;
            img.alt = conv.name;
            avatarDiv.appendChild(img);
        } else {
            avatarDiv.textContent = conv.avatar;
        }

        const contentDiv = document.createElement('div');
        contentDiv.className = 'conversation-content';
        contentDiv.innerHTML = `
            <div class="conversation-header">
                <span class="conversation-name">${conv.name}</span>
            </div>
            <div class="conversation-message">${conv.message}</div>
        `;

        const rightSection = document.createElement('div');
        rightSection.className = 'right-section';
        rightSection.innerHTML = `
            <span class="conversation-time">${conv.time}</span>
            <div class="badge">${conv.badge}</div>
        `;

        conversationItem.appendChild(avatarDiv);
        conversationItem.appendChild(contentDiv);
        conversationItem.appendChild(rightSection);

        container.appendChild(conversationItem);
    });

    // Add click event listeners after rendering
    addConversationListeners();
}

// Function to create and render chat interface
function openChat(conversation) {
    // Use existing chat container
    const chatContainer = document.getElementById('chat-container');

    // Render chat content
    chatContainer.innerHTML = `
        <div class="chat-header">
            <div class="back-button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </div>
            <div class="chat-title">${conversation.name}</div>
        </div>
        <div class="chat-content" id="chat-content"></div>
    `;

    // Render messages
    const chatContent = chatContainer.querySelector('#chat-content');
    const messages = chatMessages[conversation.name] || [];
    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${message.sender}`;
        messageDiv.textContent = message.text;
        chatContent.appendChild(messageDiv);
    });

    // Slide in chat and slide out conversations
    chatContainer.classList.add('open');
    document.getElementById('conversations-container').classList.add('slide-left');
    document.querySelector('.header').classList.add('slide-left');
    document.querySelector('.floating-button').classList.add('hidden');

    // Add event listener for back button
    const backButton = chatContainer.querySelector('.back-button');
    backButton.addEventListener('click', closeChat);
}

// Function to close chat
function closeChat() {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.classList.remove('open');
    document.getElementById('conversations-container').classList.remove('slide-left');
    document.querySelector('.header').classList.remove('slide-left');
    document.querySelector('.floating-button').classList.remove('hidden');

    // Clear content after animation completes (300ms matches transition duration)
    setTimeout(() => {
        chatContainer.innerHTML = '';
    }, 300);
}

// Add click event listeners to conversation items
function addConversationListeners() {
    const conversationItems = document.querySelectorAll('.conversation-item');
    conversationItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openChat(conversations[index]);
        });
    });
}

// Call renderConversations on page load
document.addEventListener('DOMContentLoaded', () => {
    renderConversations();
});

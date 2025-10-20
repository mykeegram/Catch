
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
    Chizaram: [
        { type: "text", text: "Yo! Chizaram's in", sender: "received", time: "Wed 10:30 AM" },
        { type: "audio", duration: "0:14", sender: "received", time: "Wed 10:32 AM" },
        { type: "text", text: "Hey! What's up?", sender: "sent", time: "Wed 10:34 AM" }
    ],
    VaVia: [
        { type: "text", text: "Hey there! How are you?", sender: "received", time: "Tue 3:15 PM" },
        { type: "audio", duration: "0:08", sender: "sent", time: "Tue 3:16 PM" },
        { type: "text", text: "I'm good, you?", sender: "sent", time: "Tue 3:17 PM" }
    ]
};

// Function to render conversations
function renderConversations() {
    try {
        const container = document.getElementById("conversations-container");
        if (!container) throw new Error("Conversations container not found");
        container.innerHTML = "";

        conversations.forEach(conv => {
            const conversationItem = document.createElement("div");
            conversationItem.className = "conversation-item";

            const avatarDiv = document.createElement("div");
            avatarDiv.className = "avatar";
            
            if (conv.isImage) {
                const img = document.createElement("img");
                img.src = conv.avatar;
                img.alt = conv.name;
                avatarDiv.appendChild(img);
            } else {
                avatarDiv.textContent = conv.avatar;
            }

            const contentDiv = document.createElement("div");
            contentDiv.className = "conversation-content";
            contentDiv.innerHTML = `
                <div class="conversation-header">
                    <span class="conversation-name">${conv.name}</span>
                </div>
                <div class="conversation-message">${conv.message}</div>
            `;

            const rightSection = document.createElement("div");
            rightSection.className = "right-section";
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
    } catch (error) {
        console.error("Error rendering conversations:", error);
    }
}

// Function to create and render chat interface
function openChat(conversation) {
    try {
        const chatContainer = document.getElementById("chat-container");
        if (!chatContainer) throw new Error("Chat container not found");

        const conversationsContainer = document.getElementById("conversations-container");
        if (!conversationsContainer) throw new Error("Conversations container not found in openChat");

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
            <div class="chat-content" id="chat-content">
                <div class="date-divider">
                    <span class="date-badge">${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                </div>
            </div>
        `;

        // Render messages
        const chatContent = chatContainer.querySelector("#chat-content");
        const messages = chatMessages[conversation.name] || [];
        messages.forEach(message => {
            const messageDiv = document.createElement("div");
            messageDiv.className = `chat-message ${message.sender} ${message.type === "audio" ? "audio-message" : ""}`;
            
            if (message.type === "audio") {
                // Generate 34 waveform bars
                const waveformBars = Array.from({ length: 34 }, () => '<div class="wave-bar"></div>').join('');
                messageDiv.innerHTML = `
                    <div class="message-bubble">
                        <div class="audio-controls">
                            <button class="play-button">
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="currentColor" d="M8 5v14l11-7z"/>
                                </svg>
                            </button>
                            <div class="waveform">${waveformBars}</div>
                            <span class="audio-duration">${message.duration}</span>
                        </div>
                        <div class="message-time">
                            ${message.time}
                            ${message.sender === "sent" ? `
                            <span class="check-marks">
                                <svg viewBox="0 0 16 15" width="16" height="15">
                                    <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"/>
                                </svg>
                            </span>
                            ` : ''}
                        </div>
                    </div>
                `;
            } else {
                messageDiv.innerHTML = `
                    <div class="message-bubble">
                        <div class="message-text">${message.text}</div>
                        <div class="message-time">
                            ${message.time}
                            ${message.sender === "sent" ? `
                            <span class="check-marks">
                                <svg viewBox="0 0 16 15" width="16" height="15">
                                    <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"/>
                                </svg>
                            </span>
                            ` : ''}
                        </div>
                    </div>
                `;
            }
            chatContent.appendChild(messageDiv);
        });

        // Add play/pause functionality for audio messages
        chatContent.querySelectorAll('.play-button').forEach(button => {
            button.addEventListener('click', function() {
                const isPlaying = this.classList.contains('playing');
                
                if (isPlaying) {
                    // Pause
                    this.classList.remove('playing');
                    this.innerHTML = `
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="currentColor" d="M8 5v14l11-7z"/>
                        </svg>
                    `;
                } else {
                    // Play
                    this.classList.add('playing');
                    this.innerHTML = `
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="currentColor" d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                    `;
                    
                    // Auto-pause after duration
                    const duration = this.closest('.audio-message').querySelector('.audio-duration').textContent;
                    const seconds = duration.split(':').reduce((acc, time) => (60 * acc) + +time);
                    
                    setTimeout(() => {
                        if (this.classList.contains('playing')) {
                            this.classList.remove('playing');
                            this.innerHTML = `
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="currentColor" d="M8 5v14l11-7z"/>
                                </svg>
                            `;
                        }
                    }, seconds * 1000);
                }
            });
        });

        // Slide in chat and slide out index area
        chatContainer.classList.add("open");
        conversationsContainer.classList.add("slide-left");
        console.log("Applied slide-left to conversations-container"); // Debug log
        document.querySelector(".header").classList.add("slide-left");
        document.querySelector(".stories-container").classList.add("slide-left");
        document.querySelector(".floating-button").classList.add("hidden");

        // Add event listener for back button
        const backButton = chatContainer.querySelector(".back-button");
        backButton.addEventListener("click", closeChat);
    } catch (error) {
        console.error("Error opening chat:", error);
    }
}

// Function to close chat
function closeChat() {
    try {
        const chatContainer = document.getElementById("chat-container");
        const conversationsContainer = document.getElementById("conversations-container");
        if (!conversationsContainer) throw new Error("Conversations container not found in closeChat");

        chatContainer.classList.remove("open");
        conversationsContainer.classList.remove("slide-left");
        console.log("Removed slide-left from conversations-container"); // Debug log
        document.querySelector(".header").classList.remove("slide-left");
        document.querySelector(".stories-container").classList.remove("slide-left");
        document.querySelector(".floating-button").classList.remove("hidden");

        // Clear content after animation completes (300ms matches transition duration)
        setTimeout(() => {
            chatContainer.innerHTML = "";
        }, 300);
    } catch (error) {
        console.error("Error closing chat:", error);
    }
}

// Add click event listeners to conversation items
function addConversationListeners() {
    try {
        const conversationItems = document.querySelectorAll(".conversation-item");
        conversationItems.forEach((item, index) => {
            item.addEventListener("click", () => {
                openChat(conversations[index]);
            });
        });
    } catch (error) {
        console.error("Error adding conversation listeners:", error);
    }
}

// Call renderConversations on page load
document.addEventListener("DOMContentLoaded", () => {
    try {
        renderConversations();
    } catch (error) {
        console.error("Error initializing conversations:", error);
    }
});

// chat.js
import { initializeWavePlay } from './wave-play.js';

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
    },
    {
        name: "Donald Trump",
        message: "Discussion group",
        time: "Mon",
        badge: 0,
        avatar: "DT",
        isImage: false,
        isGroup: true
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
    ],
    "Donald Trump": []  // Empty messages for the group discussion
};

// Function to render conversations
function renderConversations() {
    try {
        console.log("Starting renderConversations"); // Debug log
        const container = document.getElementById("conversations-container");
        if (!container) throw new Error("Conversations container not found");
        container.innerHTML = "";

        conversations.forEach(conv => {
            console.log(`Rendering conversation for ${conv.name}`); // Debug log
            const conversationItem = document.createElement("div");
            conversationItem.className = "conversation-item";

            const avatarContainer = document.createElement("div");
            avatarContainer.className = "avatar-container";

            const avatarDiv = document.createElement("div");
            avatarDiv.className = "avatar";
            
            if (conv.isImage) {
                const img = document.createElement("img");
                img.src = conv.avatar;
                img.alt = conv.name;
                img.onerror = () => console.error(`Failed to load avatar for ${conv.name}`); // Debug image errors
                avatarDiv.appendChild(img);
            } else {
                avatarDiv.textContent = conv.avatar;
            }

            // Add badge for sidebar view, placed on avatar
            const badgeOverlay = document.createElement("div");
            badgeOverlay.className = "badge-overlay";
            badgeOverlay.textContent = conv.badge;
            avatarContainer.appendChild(avatarDiv);
            avatarContainer.appendChild(badgeOverlay);

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

            conversationItem.appendChild(avatarContainer);
            conversationItem.appendChild(contentDiv);
            conversationItem.appendChild(rightSection);

            container.appendChild(conversationItem);
        });

        console.log("Finished rendering conversations"); // Debug log
        // Add click event listeners after rendering
        addConversationListeners();
    } catch (error) {
        console.error("Error rendering conversations:", error);
    }
}

// Function to create and render discussion panel (empty, Discord-like)
function openDiscussion(conversation) {
    try {
        console.log(`Opening discussion for ${conversation.name}`); // Debug log
        const discussionsContainer = document.getElementById("discussions-container");
        if (!discussionsContainer) throw new Error("Discussions container not found");

        const conversationsContainer = document.getElementById("conversations-container");
        if (!conversationsContainer) throw new Error("Conversations container not found in openDiscussion");

        // Render empty discussion content
        discussionsContainer.innerHTML = `
            <div class="discussion-header">
                <div class="back-button">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </div>
                <div class="discussion-title">${conversation.name}</div>
            </div>
            <div class="discussion-content" id="discussion-content">
                <!-- Empty for now, like a new Discord DM -->
                <div class="empty-state">
                    <p>No messages yet. Start the conversation!</p>
                </div>
            </div>
        `;

        // Slide conversations to left (25% width with avatars and counters) and show discussions (75%)
        conversationsContainer.classList.add("slide-left-quarter");
        discussionsContainer.classList.add("open");
        console.log("Applied slide-left-quarter to conversations-container"); // Debug log
        document.querySelector(".header").classList.add("slide-left");
        document.querySelector(".stories-container").classList.add("slide-left");
        document.querySelector(".floating-button").classList.add("hidden");

        // Add event listener for back button
        const backButton = discussionsContainer.querySelector(".back-button");
        backButton.addEventListener("click", closeDiscussion);
    } catch (error) {
        console.error("Error opening discussion:", error);
    }
}

// Function to close discussion
function closeDiscussion() {
    try {
        console.log("Closing discussion"); // Debug log
        const discussionsContainer = document.getElementById("discussions-container");
        const conversationsContainer = document.getElementById("conversations-container");
        if (!conversationsContainer) throw new Error("Conversations container not found in closeDiscussion");

        discussionsContainer.classList.remove("open");
        conversationsContainer.classList.remove("slide-left-quarter");
        console.log("Removed slide-left-quarter from conversations-container"); // Debug log
        document.querySelector(".header").classList.remove("slide-left");
        document.querySelector(".stories-container").classList.remove("slide-left");
        document.querySelector(".floating-button").classList.remove("hidden");

        // Clear content after animation completes (300ms matches transition duration)
        setTimeout(() => {
            discussionsContainer.innerHTML = "";
        }, 300);
    } catch (error) {
        console.error("Error closing discussion:", error);
    }
}

// Function to create and render chat interface
function openChat(conversation) {
    try {
        console.log(`Opening chat for ${conversation.name}`); // Debug log
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
            console.log(`Rendering message: ${message.type} for ${conversation.name}`); // Debug log
            const messageDiv = document.createElement("div");
            messageDiv.className = `chat-message ${message.sender} ${message.type === "audio" ? "audio-message" : ""}`;
            
            if (message.type === "audio") {
                // Generate 28 waveform bars
                const waveformBars = Array.from({ length: 28 }, () => '<div class="wave-bar"></div>').join('');
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

        // Initialize wave play functionality for rendered messages
        console.log("Initializing wave-play"); // Debug log
        initializeWavePlay();

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
        console.log("Closing chat"); // Debug log
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
        console.log("Adding conversation listeners"); // Debug log
        const conversationItems = document.querySelectorAll(".conversation-item");
        console.log(`Found ${conversationItems.length} conversation items`); // Debug log
        conversationItems.forEach((item, index) => {
            item.addEventListener("click", () => {
                console.log(`Clicked conversation: ${conversations[index].name}`); // Debug log
                if (conversations[index].isGroup) {
                    openDiscussion(conversations[index]);
                } else {
                    openChat(conversations[index]);
                }
            });
        });
    } catch (error) {
        console.error("Error adding conversation listeners:", error);
    }
}

// Call renderConversations on page load
document.addEventListener("DOMContentLoaded", () => {
    try {
        console.log("DOMContentLoaded: Initializing conversations"); // Debug log
        renderConversations();
    } catch (error) {
        console.error("Error initializing conversations:", error);
    }
});

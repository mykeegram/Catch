// chat.js
import { initializeWavePlay } from './wave-play.js';
import { createReplySection } from './reply.js';
import { renderHeader } from './header.js';
import { createMessageInput } from './message.js'; 

// -------------------------------------------------
// Conversations data (omitted for brevity)
// -------------------------------------------------
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

// -------------------------------------------------
// Sample chat messages (omitted for brevity)
// -------------------------------------------------
const chatMessages = {
    Chizaram: [
        { type: "text", text: "U fit give me your WhatsApp number", sender: "received", time: "Wed 2:01 PM",
          reply: { name: "Jackson Dave", text: "Afa" } },
        { type: "text", text: "Mykee Blogger", sender: "received", time: "Wed 10:40 AM" },
        { type: "audio", duration: "0:14", sender: "received", time: "Wed 10:42 AM" },
        { type: "text", text: "Here you go: +234 123 456 7890", sender: "sent", time: "Wed 2:05 PM",
          reply: { name: "Mykee Blogger", text: "U fit give me your WhatsApp number" } },
        { type: "text", text: "Who be this", sender: "sent", time: "Wed 10:56 AM" },
        { type: "audio", duration: "0:08", sender: "sent", time: "Wed 10:57 AM" },
        { type: "text", text: "Messiah", sender: "received", time: "Wed 10:58 AM" }
    ],
    VaVia: [
        { type: "text", text: "Hey there! How are you?", sender: "received", time: "Tue 3:15 PM" },
        { type: "audio", duration: "0:08", sender: "sent", time: "Tue 3:16 PM" },
        { type: "text", text: "I'm good, you?", sender: "sent", time: "Tue 3:17 PM" }
    ],
    "Donald Trump": []
};

// -------------------------------------------------
// AUTO-SCROLL LOGIC
// -------------------------------------------------
let hasUserScrolledUp = false;

/**
 * Attaches event listeners to the chat input and content area 
 * to manage auto-scrolling on key press/focus.
 */
function setupAutoScrollOnInput(chatContentElement, chatInputElement) {
    if (!chatContentElement || !chatInputElement) return;

    // 1. Reset flag and immediately scroll to bottom when the chat is opened
    hasUserScrolledUp = false;
    scrollToBottom(chatContentElement, 'auto');

    // 2. Detect when the user manually scrolls up
    chatContentElement.addEventListener('scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = chatContentElement;
        
        // A simple way to check if the user is near the bottom (within 20px)
        const isNearBottom = (scrollHeight - scrollTop) <= (clientHeight + 20);

        // Update the flag: if they are not near the bottom, they have scrolled up.
        hasUserScrolledUp = !isNearBottom;
    });

    // 3. Auto-scroll on input focus/key press (typing)
    const handleInputFocus = () => {
        // Only scroll if the user is currently at or near the bottom
        if (!hasUserScrolledUp) {
            // Use a short delay to allow the virtual keyboard to appear
            setTimeout(() => {
                scrollToBottom(chatContentElement, 'smooth');
            }, 100); 
        }
    };

    // Listen for focus (initial click) and input (typing)
    chatInputElement.addEventListener('focus', handleInputFocus);
    chatInputElement.addEventListener('input', handleInputFocus);

    // Initial check (in case content is already long)
    chatContentElement.dispatchEvent(new Event('scroll'));
}

/**
 * Utility function to scroll the chat container to the very bottom.
 */
function scrollToBottom(element, behavior = 'smooth') {
    element.scrollTo({
        top: element.scrollHeight,
        behavior: behavior
    });
}

// -------------------------------------------------
// Render conversation list (omitted for brevity)
// -------------------------------------------------
function renderConversations() {
    // ... (Your existing function remains here) ...
}

// -------------------------------------------------
// Open discussion (group) (omitted for brevity)
// -------------------------------------------------
function openDiscussion(conversation) {
    // ... (Your existing function remains here) ...
}

// -------------------------------------------------
// Close discussion (omitted for brevity)
// -------------------------------------------------
function closeDiscussion() {
    // ... (Your existing function remains here) ...
}

// -------------------------------------------------
// Open chat – uses .app-chat-header
// -------------------------------------------------
function openChat(conversation) {
    try {
        const chat = document.getElementById("chat-container");
        const convs = document.getElementById("conversations-container");
        if (!chat || !convs) throw new Error("Missing containers");

        chat.innerHTML = `
            <header class="app-chat-header" role="banner" aria-label="Chat header"></header>
            <div class="chat-content" id="chat-content">
                <div class="date-divider">
                    <span class="date-badge">${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                </div>
            </div>
            ${createMessageInput()} 
        `;

        const header = chat.querySelector(".app-chat-header");
        renderHeader(header, {
            title: conversation.name,
            avatar: conversation.isImage
                ? `<img src="${conversation.avatar}" alt="${conversation.name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`
                : conversation.avatar,
            badge: conversation.badge,
            subtext: "last seen recently",
            onBack: closeChat
        });

        const content = chat.querySelector("#chat-content");
        const msgs = chatMessages[conversation.name] || [];

        msgs.forEach(msg => {
            // ... (Message rendering logic remains here) ...
            const msgDiv = document.createElement("div");
            msgDiv.className = `chat-message ${msg.sender} ${msg.type === "audio" ? "audio-message" : ""}`;

            const bubble = document.createElement("div");
            bubble.className = "message-bubble";

            // ---- Reply ----
            if (msg.reply) {
                const replySec = createReplySection(msg.reply);
                if (replySec) bubble.appendChild(replySec);
            }

            // ---- Text / Audio ----
            if (msg.type === "audio") {
                const bars = Array.from({ length: 28 }, () => '<div class="wave-bar"></div>').join('');
                bubble.innerHTML += `
                    <div class="audio-controls">
                        <button class="play-button">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path fill="currentColor" d="M8 5v14l11-7z"/>
                            </svg>
                        </button>
                        <div class="waveform">${bars}</div>
                        <span class="audio-duration">${msg.duration}</span>
                    </div>
                `;
            } else {
                bubble.innerHTML += `<div class="message-text">${msg.text}</div>`;
            }

            // ---- Time + Checkmarks ----
            bubble.innerHTML += `
                <div class="message-time">
                    ${msg.time}
                    ${msg.sender === "sent" ? `
                    <span class="check-marks">
                        <svg viewBox="0 0 16 15" width="16" height="15">
                            <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"/>
                        </svg>
                    </span>` : ''}
                </div>
            `;

            msgDiv.appendChild(bubble);
            content.appendChild(msgDiv);
        });

        initializeWavePlay();
        
        // Find the input element after rendering
        const chatInputElement = chat.querySelector('#chat-input-div');
        
        // === ATTACH SCROLL LOGIC HERE ===
        setupAutoScrollOnInput(content, chatInputElement);

        // ---- Open animation ----
        chat.classList.add("open");
        convs.classList.add("slide-left");
        document.querySelector(".header").classList.add("slide-left");
        document.querySelector(".stories-container").classList.add("slide-left");
        document.querySelector(".floating-button").classList.add("hidden");
    } catch (e) { console.error(e); }
}

// -------------------------------------------------
// Close chat (omitted for brevity)
// -------------------------------------------------
function closeChat() {
    // ... (Your existing function remains here) ...
}

// -------------------------------------------------
// Conversation click listeners (omitted for brevity)
// -------------------------------------------------
function addConversationListeners() {
    // ... (Your existing function remains here) ...
}

// -------------------------------------------------
// Init (omitted for brevity)
// -------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    try { renderConversations(); } catch (e) { console.error(e); }
});


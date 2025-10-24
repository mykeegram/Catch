// chat.js
import { initializeWavePlay } from './wave-play.js';
import { createReplySection } from './reply.js';
import { renderHeader } from './header.js';          // <-- NEW

// -------------------------------------------------
// Conversations data
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
// Sample chat messages (with replies)
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
// Render conversation list
// -------------------------------------------------
function renderConversations() {
    try {
        const container = document.getElementById("conversations-container");
        if (!container) throw new Error("Conversations container not found");
        container.innerHTML = "";

        conversations.forEach(conv => {
            const item = document.createElement("div");
            item.className = "conversation-item";

            // ---- Avatar ----
            const avatarWrap = document.createElement("div");
            avatarWrap.className = "avatar-container";

            const avatarDiv = document.createElement("div");
            avatarDiv.className = "avatar";

            if (conv.isImage) {
                const img = document.createElement("img");
                img.src = conv.avatar;
                img.alt = conv.name;
                img.onerror = () => console.error(`Avatar load error: ${conv.name}`);
                avatarDiv.appendChild(img);
            } else {
                avatarDiv.textContent = conv.avatar;
            }

            const badgeOverlay = document.createElement("div");
            badgeOverlay.className = "badge-overlay";
            badgeOverlay.textContent = conv.badge;
            if (conv.badge === 0) badgeOverlay.style.display = "none";

            avatarWrap.appendChild(avatarDiv);
            avatarWrap.appendChild(badgeOverlay);

            // ---- Content ----
            const content = document.createElement("div");
            content.className = "conversation-content";
            content.innerHTML = `
                <div class="conversation-header">
                    <span class="conversation-name">${conv.name}</span>
                </div>
                <div class="conversation-message">${conv.message}</div>
            `;

            // ---- Right side ----
            const right = document.createElement("div");
            right.className = "right-section";
            right.innerHTML = `
                <span class="conversation-time">${conv.time}</span>
                <div class="badge">${conv.badge > 0 ? conv.badge : ""}</div>
            `;

            item.append(avatarWrap, content, right);
            container.appendChild(item);
        });

        addConversationListeners();
    } catch (e) { console.error(e); }
}

// -------------------------------------------------
// Open discussion (group) – uses .app-chat-header
// -------------------------------------------------
function openDiscussion(conversation) {
    try {
        const discussions = document.getElementById("discussions-container");
        const convs = document.getElementById("conversations-container");
        if (!discussions || !convs) throw new Error("Missing containers");

        discussions.innerHTML = `
            <header class="app-chat-header" role="banner" aria-label="Discussion header"></header>
            <div class="discussion-content" id="discussion-content">
                <div class="empty-state"><p>No messages yet. Start the conversation!</p></div>
            </div>
        `;

        const header = discussions.querySelector(".app-chat-header");
        renderHeader(header, {
            title: conversation.name,
            avatar: conversation.avatar,
            badge: conversation.badge,
            subtext: "Discussion group",
            onBack: closeDiscussion
        });

        convs.classList.add("slide-left-quarter");
        discussions.classList.add("open");
        document.querySelector(".header").classList.add("slide-left");
        document.querySelector(".stories-container").classList.add("slide-left");
        document.querySelector(".floating-button").classList.add("hidden");
    } catch (e) { console.error(e); }
}

// -------------------------------------------------
// Close discussion
// -------------------------------------------------
function closeDiscussion() {
    try {
        const discussions = document.getElementById("discussions-container");
        const convs = document.getElementById("conversations-container");
        if (!convs) throw new Error("Conversations container missing");

        discussions.classList.remove("open");
        convs.classList.remove("slide-left-quarter");
        document.querySelector(".header").classList.remove("slide-left");
        document.querySelector(".stories-container").classList.remove("slide-left");
        document.querySelector(".floating-button").classList.remove("hidden");

        setTimeout(() => { discussions.innerHTML = ""; }, 300);
    } catch (e) { console.error(e); }
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

        // ---- Open animation ----
        chat.classList.add("open");
        convs.classList.add("slide-left");
        document.querySelector(".header").classList.add("slide-left");
        document.querySelector(".stories-container").classList.add("slide-left");
        document.querySelector(".floating-button").classList.add("hidden");
    } catch (e) { console.error(e); }
}

// -------------------------------------------------
// Close chat
// -------------------------------------------------
function closeChat() {
    try {
        const chat = document.getElementById("chat-container");
        const convs = document.getElementById("conversations-container");
        if (!convs) throw new Error("Conversations container missing");

        chat.classList.remove("open");
        convs.classList.remove("slide-left");
        document.querySelector(".header").classList.remove("slide-left");
        document.querySelector(".stories-container").classList.remove("slide-left");
        document.querySelector(".floating-button").classList.remove("hidden");

        setTimeout(() => { chat.innerHTML = ""; }, 300);
    } catch (e) { console.error(e); }
}

// -------------------------------------------------
// Conversation click listeners
// -------------------------------------------------
function addConversationListeners() {
    try {
        const items = document.querySelectorAll(".conversation-item");
        items.forEach((el, i) => {
            el.addEventListener("click", () => {
                if (conversations[i].isGroup) openDiscussion(conversations[i]);
                else openChat(conversations[i]);
            });
        });
    } catch (e) { console.error(e); }
}

// -------------------------------------------------
// Init
// -------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    try { renderConversations(); } catch (e) { console.error(e); }
});

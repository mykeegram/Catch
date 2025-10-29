// test-chat.js
import { initializeWavePlay } from './wave-play.js';
import { createReplySection } from './reply.js';
import { renderHeader } from './header.js';
import { 
    createMessageInput, 
    initializeKeyboardHandling,
    initializeSendMicSwitch
} from './message.js';
import { initializeEmojiPicker } from './emoji.js';
import { createImageSection } from './image.js';

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

const chatMessages = {
    Chizaram: [
        { type: "text", text: "U fit give me your WhatsApp number", sender: "received", time: "Wed 2:01 PM",
          reply: { name: "Jackson Dave", text: "Afa" } },
        { type: "text", text: "Mykee Blogger", sender: "received", time: "Wed 10:40 AM" },
        { type: "image", url: "https://i.ibb.co/C5b875C6/Screenshot-20250904-050841.jpg", sender: "received", time: "Wed 10:42 AM" },
        { type: "text", text: "Here you go: +234 123 456 7890", sender: "sent", time: "Wed 2:05 PM",
          reply: { name: "Mykee Blogger", text: "U fit give me your WhatsApp number" } },
        { type: "text", text: "Who be this", sender: "sent", time: "Wed 10:56 AM" },
        { type: "audio", duration: "0:08", sender: "sent", time: "Wed 10:57 AM" },
        { type: "text", text: "Messiah", sender: "received", time: "Wed 10:58 AM" },
        { type: "image", url: "https://i.ibb.co/C5b875C6/Screenshot-20250904-050841.jpg", sender: "sent", time: "Wed 10:59 AM" }
    ],
    VaVia: [
        { type: "text", text: "Hey there! How are you?", sender: "received", time: "Tue 3:15 PM" },
        { type: "audio", duration: "0:08", sender: "sent", time: "Tue 3:16 PM" },
        { type: "text", text: "I'm good, you?", sender: "sent", time: "Tue 3:17 PM" }
    ],
    "Donald Trump": []
};

// -------------------------------------------------
// Global Image Overlay State
// -------------------------------------------------
let imageOverlay = null;
let overlayImages = [];
let currentOverlayIndex = 0;

// =================================================
// IMAGE OVERLAY: Initialize once
// =================================================
function initializeImageOverlay() {
    if (imageOverlay) return;

    const overlayHTML = `
        <div class="image-overlay" id="imageOverlay">
            <div class="overlay-header">
                <div class="overlay-close" id="closeOverlay"></div>
                <div class="overlay-title">
                    <span class="overlay-title-name" id="overlayName"></span>
                    <span class="overlay-title-time" id="overlayTime"></span>
                </div>
                <div class="overlay-menu"></div>
            </div>
            <div class="overlay-image-container">
                <div class="swipe-indicator left hidden" id="prevBtn">
                    <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                </div>
                <img src="" alt="Full image" class="overlay-image" id="overlayImage">
                <div class="swipe-indicator right hidden" id="nextBtn">
                    <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', overlayHTML);
    imageOverlay = document.getElementById('imageOverlay');
    const overlayImg = document.getElementById('overlayImage');
    const closeBtn = document.getElementById('closeOverlay');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const container = imageOverlay.querySelector('.overlay-image-container');

    let touchStartX = 0;
    let touchEndX = 0;

    function updateOverlay(index) {
        if (index < 0 || index >= overlayImages.length) return;
        currentOverlayIndex = index;
        const imgData = overlayImages[index];
        overlayImg.src = imgData.src;
        document.getElementById('overlayName').textContent = imgData.sender;
        document.getElementById('overlayTime').textContent = imgData.time;

        prevBtn.classList.toggle('hidden', index === 0);
        nextBtn.classList.toggle('hidden', index === overlayImages.length - 1);
    }

    function showNext() { if (currentOverlayIndex < overlayImages.length - 1) updateOverlay(currentOverlayIndex + 1); }
    function showPrev() { if (currentOverlayIndex > 0) updateOverlay(currentOverlayIndex - 1); }

    function closeOverlay() {
        imageOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    container.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? showNext() : showPrev();
        }
    }, { passive: true });

    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    closeBtn.addEventListener('click', closeOverlay);
    imageOverlay.addEventListener('click', e => {
        if (e.target === imageOverlay) closeOverlay();
    });

    document.addEventListener('keydown', e => {
        if (!imageOverlay.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'Escape') closeOverlay();
    });

    function blockImageDownload(el) {
        el.addEventListener('contextmenu', e => e.preventDefault());
        el.addEventListener('dragstart', e => e.preventDefault());
        el.addEventListener('touchstart', e => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
        el.addEventListener('touchmove', e => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
    }

    blockImageDownload(overlayImg);
}

// =================================================
// RENDER CONVERSATIONS
// =================================================
function renderConversations() {
    try {
        const container = document.getElementById("conversations-container");
        if (!container) throw new Error("Conversations container not found");
        container.innerHTML = "";

        conversations.forEach(conv => {
            const item = document.createElement("div");
            item.className = "conversation-item";

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

            const content = document.createElement("div");
            content.className = "conversation-content";
            content.innerHTML = `
                <div class="conversation-header">
                    <span class="conversation-name">${conv.name}</span>
                </div>
                <div class="conversation-message">${conv.message}</div>
            `;

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

// =================================================
// CONVERSATION LISTENERS
// =================================================
function addConversationListeners() {
    try {
        const items = document.querySelectorAll(".conversation-item");
        items.forEach((el, i) => {
            el.addEventListener("click", () => {
                const conv = conversations[i];
                if (conv.isGroup) {
                    openDiscussion(conv);
                } else {
                    openChat(conv);
                }
            });
        });
    } catch (e) { console.error(e); }
}

// =================================================
// OPEN DISCUSSION (GROUP)
// =================================================
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
            onBack: closeDiscussion,
            type: "group"
        });

        convs.classList.add("slide-left-quarter");
        discussions.classList.add("open");
        document.querySelector(".header").classList.add("slide-left");
        document.querySelector(".stories-container").classList.add("slide-left");
        document.querySelector(".floating-button").classList.add("hidden");
    } catch (e) { console.error(e); }
}

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

// =================================================
// OPEN CHAT (1-ON-1)
// =================================================
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
            onBack: closeChat,
            type: "one-to-one"
        });

        const content = chat.querySelector("#chat-content");
        const msgs = chatMessages[conversation.name] || [];

        overlayImages = [];

        msgs.forEach((msg, index) => {
            const msgDiv = document.createElement("div");
            msgDiv.className = `chat-message ${msg.sender}`;
            if (msg.type === "audio") msgDiv.classList.add("audio-message");
            if (msg.type === "image") msgDiv.classList.add("image-message");

            const bubble = document.createElement("div");
            bubble.className = "message-bubble";

            if (msg.reply) {
                const replySec = createReplySection(msg.reply);
                if (replySec) bubble.appendChild(replySec);
            }

            if (msg.type === "image") {
                const senderName = msg.sender === "sent" ? "You" : conversation.name;
                const imgEl = createImageSection(msg.url, "Chat image", senderName, msg.time);

                overlayImages.push({
                    src: msg.url,
                    sender: senderName,
                    time: msg.time
                });

                imgEl.addEventListener('click', () => {
                    initializeImageOverlay();
                    currentOverlayIndex = overlayImages.length - 1;
                    updateOverlay(currentOverlayIndex);
                    imageOverlay.classList.add('active');
                    document.body.classList.add('no-scroll');
                });

                imgEl.addEventListener('contextmenu', e => e.preventDefault());
                imgEl.addEventListener('dragstart', e => e.preventDefault());

                bubble.appendChild(imgEl);
            } else if (msg.type === "audio") {
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

        setTimeout(() => {
            content.scrollTop = content.scrollHeight;
        }, 150);

        setTimeout(() => {
            initializeKeyboardHandling();
            initializeEmojiPicker();
            initializeSendMicSwitch();
        }, 200);

        chat.classList.add("open");
        convs.classList.add("slide-left");
        document.querySelector(".header").classList.add("slide-left");
        document.querySelector(".stories-container").classList.add("slide-left");
        document.querySelector(".floating-button").classList.add("hidden");
    } catch (e) { console.error(e); }
}

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

// =================================================
// INIT — NOW SAFE
// =================================================
document.addEventListener("DOMContentLoaded", () => {
    try { 
        renderConversations(); 
    } catch (e) { 
        console.error(e); 
    }
});

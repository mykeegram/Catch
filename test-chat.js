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
// Conversations & Messages
// -------------------------------------------------
const conversations = [/* ... same as before ... */];

const chatMessages = { /* ... same as before ... */ };

// -------------------------------------------------
// Global Image Overlay State
// -------------------------------------------------
let imageOverlay = null;
let overlayImages = [];
let currentOverlayIndex = 0;

// -------------------------------------------------
// Initialize Image Overlay
// -------------------------------------------------
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

    // Touch swipe
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

    // Buttons
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    closeBtn.addEventListener('click', closeOverlay);
    imageOverlay.addEventListener('click', e => {
        if (e.target === imageOverlay) closeOverlay();
    });

    // Keyboard
    document.addEventListener('keydown', e => {
        if (!imageOverlay.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'Escape') closeOverlay();
    });

    // Prevent all image download attempts
    function blockImageDownload(el) {
        el.addEventListener('contextmenu', e => e.preventDefault());
        el.addEventListener('dragstart', e => e.preventDefault());
        el.addEventListener('touchstart', e => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
        el.addEventListener('touchmove', e => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
    }

    blockImageDownload(overlayImg);
}

// -------------------------------------------------
// Open Chat (Updated Image Handling)
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
            onBack: closeChat,
            type: "one-to-one"
        });

        const content = chat.querySelector("#chat-content");
        const msgs = chatMessages[conversation.name] || [];

        overlayImages = []; // Reset overlay list

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

                // Add to overlay list
                overlayImages.push({
                    src: msg.url,
                    sender: senderName,
                    time: msg.time
                });

                imgEl.addEventListener('click', () => {
                    initializeImageOverlay();
                    updateOverlay(overlayImages.length - 1);
                    imageOverlay.classList.add('active');
                    document.body.classList.add('no-scroll');
                });

                // Prevent download
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

// -------------------------------------------------
// Rest of your functions (renderConversations, etc.)
// -------------------------------------------------
// ... (keep all other functions unchanged: closeChat, openDiscussion, etc.)

// -------------------------------------------------
// Init
// -------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    try { renderConversations(); } catch (e) { console.error(e); }
});

// js/emoji.js

let wasAtBottom = false;
let isEmojiPickerOpen = false;
let chatContent = null;
let emojiPicker = null;
let emojiBtn = null;

/**
 * Initializes the emoji picker behavior.
 * Call this once after the chat is open.
 */
export function initializeEmojiPicker() {
    chatContent = document.getElementById('chat-content');
    emojiBtn = document.getElementById('emoji-btn');
    emojiPicker = document.getElementById('emoji-picker');

    if (!chatContent || !emojiBtn || !emojiPicker) {
        console.warn('Emoji picker: missing required elements');
        return;
    }

    // Create empty emoji panel if not already in DOM
    if (!document.getElementById('emoji-picker')) {
        const panel = document.createElement('div');
        panel.id = 'emoji-picker';
        panel.className = 'emoji-picker';
        // Leave empty – you can fill it later
        document.body.appendChild(panel);
        emojiPicker = panel;
    }

    // Toggle on click
    emojiBtn.addEventListener('click', toggleEmojiPicker);

    console.log('Emoji picker initialized');
}

/**
 * Toggles the emoji picker open/close with smooth animation
 * and smart scroll behavior (same as keyboard)
 */
function toggleEmojiPicker() {
    if (isEmojiPickerOpen) {
        closeEmojiPicker();
    } else {
        openEmojiPicker();
    }
}

function openEmojiPicker() {
    if (isEmojiPickerOpen) return;

    wasAtBottom = isScrolledToBottom();
    isEmojiPickerOpen = true;

    emojiPicker.classList.add('open');
    document.body.classList.add('emoji-picker-active');

    // Push chat up only if user was at bottom
    if (wasAtBottom) {
        setTimeout(() => scrollToBottom(), 50);
        setTimeout(() => scrollToBottom(), 200);
        setTimeout(() => scrollToBottom(), 350);
    }

    // Focus stays on input (optional)
    const input = document.getElementById('chat-input-div');
    if (input) input.focus();
}

function closeEmojiPicker() {
    if (!isEmojiPickerOpen) return;

    isEmojiPickerOpen = false;
    emojiPicker.classList.remove('open');
    document.body.classList.remove('emoji-picker-active');

    // Optional: scroll back if needed (usually not)
    setTimeout(() => {
        if (wasAtBottom) scrollToBottom();
    }, 300);
}

/**
 * Check if user is near the bottom of chat
 */
function isScrolledToBottom() {
    if (!chatContent) return false;
    const threshold = 80;
    return (
        chatContent.scrollHeight -
        chatContent.scrollTop -
        chatContent.clientHeight < threshold
    );
}

/**
 * Scroll to bottom smoothly
 */
function scrollToBottom() {
    if (!chatContent) return;
    chatContent.scrollTo({
        top: chatContent.scrollHeight,
        behavior: 'smooth'
    });
}

/**
 * Optional: Close picker when clicking outside
 */
document.addEventListener('click', (e) => {
    if (
        isEmojiPickerOpen &&
        !emojiPicker.contains(e.target) &&
        !emojiBtn.contains(e.target)
    ) {
        closeEmojiPicker();
    }
});

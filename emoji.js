// js/emoji.js

let wasAtBottom = false;
let isEmojiPickerOpen = false;
let chatContent = null;
let emojiBtn = null;

/**
 * Initializes the emoji picker behavior.
 * Call this once after the chat is open.
 */
export function initializeEmojiPicker() {
    chatContent = document.getElementById('chat-content');
    emojiBtn = document.getElementById('emoji-btn');

    if (!chatContent || !emojiBtn) {
        console.warn('Emoji picker: missing required elements (chat-content or emoji-btn)');
        return;
    }

    // Auto-create emoji picker panel if not in DOM
    let emojiPicker = document.getElementById('emoji-picker');
    if (!emojiPicker) {
        emojiPicker = document.createElement('div');
        emojiPicker.id = 'emoji-picker';
        emojiPicker.className = 'emoji-picker';
        // Empty container — you can fill later
        document.body.appendChild(emojiPicker);
    }

    // Toggle on click
    emojiBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleEmojiPicker();
    });

    console.log('Emoji picker initialized');
}

/**
 * Toggle emoji picker open/close
 */
function toggleEmojiPicker() {
    if (isEmojiPickerOpen) {
        closeEmojiPicker();
    } else {
        openEmojiPicker();
    }
}

/**
 * Open emoji picker
 */
function openEmojiPicker() {
    if (isEmojiPickerOpen) return;

    wasAtBottom = isScrolledToBottom();
    isEmojiPickerOpen = true;

    const picker = document.getElementById('emoji-picker');
    picker.classList.add('open');
    document.body.classList.add('emoji-picker-active');

    // Push chat up only if at bottom
    if (wasAtBottom) {
        setTimeout(scrollToBottom, 50);
        setTimeout(scrollToBottom, 200);
        setTimeout(scrollToBottom, 350);
    }

    // Keep input focused
    const input = document.getElementById('chat-input-div');
    if (input) input.focus();
}

/**
 * Close emoji picker
 */
function closeEmojiPicker() {
    if (!isEmojiPickerOpen) return;

    isEmojiPickerOpen = false;
    const picker = document.getElementById('emoji-picker');
    picker.classList.remove('open');
    document.body.classList.remove('emoji-picker-active');

    setTimeout(() => {
        if (wasAtBottom) scrollToBottom();
    }, 300);
}

/**
 * Check if user is near bottom
 */
function isScrolledToBottom() {
    if (!chatContent) return false;
    const threshold = 80;
    return chatContent.scrollHeight - chatContent.scrollTop - chatContent.clientHeight < threshold;
}

/**
 * Scroll to bottom
 */
function scrollToBottom() {
    if (!chatContent) return;
    chatContent.scrollTo({
        top: chatContent.scrollHeight,
        behavior: 'smooth'
    });
}

/**
 * Close when clicking outside
 */
document.addEventListener('click', (e) => {
    const picker = document.getElementById('emoji-picker');
    if (
        isEmojiPickerOpen &&
        picker &&
        !picker.contains(e.target) &&
        !emojiBtn?.contains(e.target)
    ) {
        closeEmojiPicker();
    }
});

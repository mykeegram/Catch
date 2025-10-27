// js/emoji.js

let wasAtBottom = false;
let isEmojiPickerOpen = false;
let chatContainer = null;
let chatContent = null;
let emojiBtn = null;
let inputDiv = null;

export function initializeEmojiPicker() {
    chatContainer = document.getElementById('chat-container');
    chatContent   = document.getElementById('chat-content');
    emojiBtn      = document.getElementById('emoji-btn');
    inputDiv      = document.getElementById('chat-input-div');

    if (!chatContainer || !chatContent || !emojiBtn) {
        console.warn('Emoji picker: missing required elements');
        return;
    }

    // Create emoji picker container (inside chat-container)
    let picker = document.getElementById('emoji-picker');
    if (!picker) {
        picker = document.createElement('div');
        picker.id = 'emoji-picker';
        picker.className = 'emoji-picker';
        chatContainer.appendChild(picker);
    }

    // Toggle on emoji button click
    emojiBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleEmojiPicker();
    });

    console.log('Emoji picker initialized');
}

/* ------------------------------------------------- */
function toggleEmojiPicker() {
    isEmojiPickerOpen ? closeEmojiPicker() : openEmojiPicker();
}

/* ------------------------------------------------- */
function openEmojiPicker() {
    if (isEmojiPickerOpen) return;

    // 1. Remove keyboard focus
    if (inputDiv) inputDiv.blur();

    wasAtBottom = isAtBottom();
    isEmojiPickerOpen = true;

    const picker = document.getElementById('emoji-picker');
    picker.classList.add('open');

    // 2. Trigger layout push + padding
    document.body.classList.add('emoji-picker-active');

    // 3. Scroll to bottom (like keyboard)
    setTimeout(() => {
        if (wasAtBottom) scrollToBottom();
    }, 100);
}

/* ------------------------------------------------- */
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

/* ------------------------------------------------- */
function isAtBottom() {
    if (!chatContent) return false;
    const threshold = 100;
    return chatContent.scrollHeight - chatContent.scrollTop - chatContent.clientHeight < threshold;
}

/* ------------------------------------------------- */
function scrollToBottom() {
    if (!chatContent) return;
    chatContent.scrollTo({
        top: chatContent.scrollHeight,
        behavior: 'smooth'
    });
}

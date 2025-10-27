// js/emoji.js

let wasAtBottom = false;
let isEmojiPickerOpen = false;
let chatContent = null;
let emojiBtn = null;
let inputDiv = null;
let inputArea = null;

export function initializeEmojiPicker() {
    chatContent = document.getElementById('chat-content');
    emojiBtn    = document.getElementById('emoji-btn');
    inputDiv    = document.getElementById('chat-input-div');
    inputArea   = document.querySelector('.chat-input-area');

    if (!chatContent || !emojiBtn || !inputArea) {
        console.warn('Emoji picker: missing required elements');
        return;
    }

    // Create picker INSIDE .chat-input-area
    let picker = document.getElementById('emoji-picker');
    if (!picker) {
        picker = document.createElement('div');
        picker.id = 'emoji-picker';
        picker.className = 'emoji-picker';
        inputArea.appendChild(picker);
    }

    emojiBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleEmojiPicker();
    });

    console.log('Emoji picker initialized inside .chat-input-area');
}

/* ------------------------------------------------- */
function toggleEmojiPicker() {
    isEmojiPickerOpen ? closeEmojiPicker() : openEmojiPicker();
}

/* ------------------------------------------------- */
function openEmojiPicker() {
    if (isEmojiPickerOpen) return;

    // Remove keyboard focus
    if (inputDiv) inputDiv.blur();

    wasAtBottom = isAtBottom();
    isEmojiPickerOpen = true;

    const picker = document.getElementById('emoji-picker');
    picker.classList.add('open');
    document.body.classList.add('emoji-picker-active');

    // Scroll like keyboard
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

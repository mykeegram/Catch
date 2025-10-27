// js/emoji.js

let wasAtBottom = false;
let isEmojiPickerOpen = false;
let chatContainer = null;
let emojiBtn = null;
let inputDiv = null;

export function initializeEmojiPicker() {
    chatContainer = document.getElementById('chat-container');
    emojiBtn = document.getElementById('emoji-btn');
    inputDiv = document.getElementById('chat-input-div');

    if (!chatContainer || !emojiBtn) {
        console.warn('Emoji picker: missing elements');
        return;
    }

    // Create picker once
    let picker = document.getElementById('emoji-picker');
    if (!picker) {
        picker = document.createElement('div');
        picker.id = 'emoji-picker';
        picker.className = 'emoji-picker';
        // Insert INSIDE chat-container, AFTER input area
        chatContainer.appendChild(picker);
    }

    emojiBtn.addEventListener('click', e => {
        e.stopPropagation();
        toggleEmojiPicker();
    });
}

function toggleEmojiPicker() {
    isEmojiPickerOpen ? closeEmojiPicker() : openEmojiPicker();
}

function openEmojiPicker() {
    if (isEmojiPickerOpen) return;

    // Remove keyboard focus
    if (inputDiv) inputDiv.blur();

    wasAtBottom = isAtBottom();
    isEmojiPickerOpen = true;

    const picker = document.getElementById('emoji-picker');
    picker.classList.add('open');

    // Let layout engine handle scroll (like keyboard)
    setTimeout(() => {
        if (wasAtBottom) scrollToBottom();
    }, 100);
}

function closeEmojiPicker() {
    if (!isEmojiPickerOpen) return;

    isEmojiPickerOpen = false;
    const picker = document.getElementById('emoji-picker');
    picker.classList.remove('open');

    setTimeout(() => {
        if (wasAtBottom) scrollToBottom();
    }, 300);
}

function isAtBottom() {
    const content = document.getElementById('chat-content');
    if (!content) return false;
    const threshold = 100;
    return content.scrollHeight - content.scrollTop - content.clientHeight < threshold;
}

function scrollToBottom() {
    const content = document.getElementById('chat-content');
    if (!content) return;
    content.scrollTo({
        top: content.scrollHeight,
        behavior: 'smooth'
    });
}

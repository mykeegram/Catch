// js/emoji.js

let wasAtBottom = false;
let isEmojiPickerOpen = false;
let chatContent = null;
let emojiBtn = null;
let inputDiv = null;

export function initializeEmojiPicker() {
    chatContent = document.getElementById('chat-content');
    emojiBtn    = document.getElementById('emoji-btn');
    inputDiv    = document.getElementById('chat-input-div');

    if (!chatContent || !emojiBtn) {
        console.warn('Emoji picker: missing elements');
        return;
    }

    // create container once
    let picker = document.getElementById('emoji-picker');
    if (!picker) {
        picker = document.createElement('div');
        picker.id = 'emoji-picker';
        picker.className = 'emoji-picker';
        document.body.appendChild(picker);
    }

    emojiBtn.addEventListener('click', e => {
        e.stopPropagation();
        toggleEmojiPicker();
    });
}

/* ------------------------------------------------- */
function toggleEmojiPicker() {
    isEmojiPickerOpen ? closeEmojiPicker() : openEmojiPicker();
}

/* ------------------------------------------------- */
function openEmojiPicker() {
    if (isEmojiPickerOpen) return;

    // 1. REMOVE KEYBOARD FOCUS
    if (inputDiv) inputDiv.blur();

    wasAtBottom = isScrolledToBottom();
    isEmojiPickerOpen = true;

    const picker = document.getElementById('emoji-picker');
    picker.classList.add('open');
    document.body.classList.add('emoji-picker-active');

    // 2. SCROLL LIKE NATIVE KEYBOARD
    if (wasAtBottom) {
        setTimeout(scrollToBottom, 50);
        setTimeout(scrollToBottom, 200);
        setTimeout(scrollToBottom, 350);
    }
}

/* ------------------------------------------------- */
function closeEmojiPicker() {
    if (!isEmojiPickerOpen) return;

    isEmojiPickerOpen = false;
    const picker = document.getElementById('emoji-picker');
    picker.classList.remove('open');
    document.body.classList.remove('emoji-picker-active');

    setTimeout(() => { if (wasAtBottom) scrollToBottom(); }, 300);
}

/* ------------------------------------------------- */
function isScrolledToBottom() {
    if (!chatContent) return false;
    const threshold = 80;
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

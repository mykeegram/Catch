// js/emoji.js

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

function toggleEmojiPicker() {
    isEmojiPickerOpen ? closeEmojiPicker() : openEmojiPicker();
}

function openEmojiPicker() {
    if (isEmojiPickerOpen) return;

    // Dismiss the on-screen keyboard
    if (inputDiv) inputDiv.blur();

    isEmojiPickerOpen = true;

    const picker = document.getElementById('emoji-picker');
    picker.classList.add('open');
    document.body.classList.add('emoji-picker-active');
}

function closeEmojiPicker() {
    if (!isEmojiPickerOpen) return;

    isEmojiPickerOpen = false;

    const picker = document.getElementById('emoji-picker');
    picker.classList.remove('open');
    document.body.classList.remove('emoji-picker-active');
}

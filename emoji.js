// js/emoji.js

let wasAtBottom = false;
let isEmojiPickerOpen = false;
let chatContent = null;
let emojiBtn = null;

export function initializeEmojiPicker() {
    chatContent = document.getElementById('chat-content');
    emojiBtn = document.getElementById('emoji-btn');

    if (!chatContent || !emojiBtn) {
        console.warn('Emoji picker: missing #chat-content or #emoji-btn');
        return;
    }

    // Create panel if not exists
    let picker = document.getElementById('emoji-picker');
    if (!picker) {
        picker = document.createElement('div');
        picker.id = 'emoji-picker';
        picker.className = 'emoji-picker';
        document.body.appendChild(picker);
    }

    // Toggle only on button
    emojiBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleEmojiPicker();
    });

    console.log('Emoji picker ready');
}

function toggleEmojiPicker() {
    isEmojiPickerOpen ? closeEmojiPicker() : openEmojiPicker();
}

function openEmojiPicker() {
    if (isEmojiPickerOpen) return;
    wasAtBottom = isScrolledToBottom();
    isEmojiPickerOpen = true;

    const picker = document.getElementById('emoji-picker');
    picker.classList.add('open');
    document.body.classList.add('emoji-picker-active');

    if (wasAtBottom) {
        setTimeout(scrollToBottom, 50);
        setTimeout(scrollToBottom, 200);
    }

    const input = document.getElementById('chat-input-div');
    if (input) input.focus();
}

function closeEmojiPicker() {
    if (!isEmojiPickerOpen) return;
    isEmojiPickerOpen = false;

    const picker = document.getElementById('emoji-picker');
    picker.classList.remove('open');
    document.body.classList.remove('emoji-picker-active');
}

function isScrolledToBottom() {
    if (!chatContent) return false;
    const threshold = 80;
    return chatContent.scrollHeight - chatContent.scrollTop - chatContent.clientHeight < threshold;
}

function scrollToBottom() {
    if (!chatContent) return;
    chatContent.scrollTo({ top: chatContent.scrollHeight, behavior: 'smooth' });
}

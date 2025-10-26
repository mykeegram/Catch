// message.js

/**
 * Creates and returns the HTML string for the floating message input bar.
 * @returns {string} The HTML string for the chat input and microphone button.
 */
export function createMessageInput() {
    // NOTE: The main wrapper needs to be a separate container to float at the bottom
    return `
        <div class="emoji-picker-container" id="emoji-picker-container">
            <div class="emoji-picker-header">
                <span class="emoji-picker-title">Emoji</span>
                <button class="emoji-picker-close" id="emoji-picker-close">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M19.6 4.4L12 12l-7.6-7.6L3 5.8 10.6 13.4 3 21l1.4 1.4L12 14.8l7.6 7.6L21 21l-7.6-7.6L21 5.8z"/>
                    </svg>
                </button>
            </div>
            <div class="emoji-picker-content">
                <p style="text-align: center; color: #666; padding: 40px 20px;">Emoji picker placeholder</p>
            </div>
        </div>
        <div class="chat-input-area"> 
            <div class="input-wrapper">
                <div class="message-bubble input-bubble"> <div class="icon" id="emoji-btn"><i class="fa-regular fa-face-smile"></i></div>
                    <div class="message-input" contenteditable="true" data-placeholder="Message" id="chat-input-div"></div>
                    <button class="attach-btn">
                        <i class="fa-solid fa-paperclip"></i>
                    </button>
                </div>
                <div class="recording-overlay" id="recording-overlay"></div>
                <button class="mic-btn" id="mic-btn">
                    <svg id="micSVG" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path d="M7.25 7C7.25 4.37665 9.37665 2.25 12 2.25C14.6234 2.25 16.75 4.37665 16.75 7V11C16.75 13.6234 14.6234 15.75 12 15.75C9.37665 15.75 7.25 13.6234 7.25 11V7Z" fill="#ffffff"></path>
                            <path d="M5.75 10C5.75 9.58579 5.41421 9.25 5 9.25C4.58579 9.25 4.25 9.58579 4.25 10V11C4.25 15.0272 7.3217 18.3369 11.25 18.7142V21C11.25 21.4142 11.5858 21.75 12 21.75C12.4142 21.75 12.75 21.4142 12.75 21V18.7142C16.6783 18.3369 19.75 15.0272 19.75 11V10C19.75 9.58579 19.4142 9.25 19 9.25C18.5858 9.25 18.25 9.58579 18.25 10V11C18.25 14.4518 15.4518 17.25 12 17.25C8.54822 17.25 5.75 14.4518 5.75 11V10Z" fill="#ffffff"></path>
                        </g>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

/**
 * Initializes emoji picker functionality
 */
export function initializeEmojiPicker() {
    const emojiBtn = document.getElementById('emoji-btn');
    const emojiPicker = document.getElementById('emoji-picker-container');
    const emojiClose = document.getElementById('emoji-picker-close');
    const chatContent = document.getElementById('chat-content');
    
    if (!emojiBtn || !emojiPicker || !chatContent) {
        console.log('Emoji picker: Missing elements');
        return;
    }

    let wasAtBottom = false;

    // Check if user is at the bottom of the chat
    function isScrolledToBottom() {
        const threshold = 50;
        return chatContent.scrollHeight - chatContent.scrollTop - chatContent.clientHeight < threshold;
    }

    // Scroll to bottom smoothly
    function scrollToBottom() {
        chatContent.scrollTo({
            top: chatContent.scrollHeight,
            behavior: 'smooth'
        });
    }

    // Open emoji picker
    emojiBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        wasAtBottom = isScrolledToBottom();
        console.log('Opening emoji picker, was at bottom:', wasAtBottom);
        
        emojiPicker.classList.add('open');
        
        // If user was at bottom, scroll up to accommodate emoji picker
        if (wasAtBottom) {
            setTimeout(scrollToBottom, 100);
            setTimeout(scrollToBottom, 300);
        }
    });

    // Close emoji picker
    emojiClose.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Closing emoji picker');
        emojiPicker.classList.remove('open');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (emojiPicker.classList.contains('open') && 
            !emojiPicker.contains(e.target) && 
            !emojiBtn.contains(e.target)) {
            emojiPicker.classList.remove('open');
        }
    });

    console.log('Emoji picker initialized');
}

/**
 * Initializes keyboard handling for the message input.
 * Scrolls to bottom only if user is already at the bottom when keyboard appears.
 */
export function initializeKeyboardHandling() {
    const input = document.getElementById('chat-input-div');
    const chatContent = document.getElementById('chat-content');
    
    if (!input || !chatContent) {
        console.log('Keyboard handling: Missing elements');
        return;
    }

    let wasAtBottom = false;
    let isKeyboardVisible = false;

    // Check if user is at the bottom of the chat
    function isScrolledToBottom() {
        const threshold = 50; // pixels from bottom
        const isBottom = chatContent.scrollHeight - chatContent.scrollTop - chatContent.clientHeight < threshold;
        return isBottom;
    }

    // Scroll to bottom smoothly
    function scrollToBottom() {
        chatContent.scrollTo({
            top: chatContent.scrollHeight,
            behavior: 'smooth'
        });
    }

    // When input is focused (keyboard about to appear)
    input.addEventListener('focus', () => {
        wasAtBottom = isScrolledToBottom();
        console.log('Input focused, was at bottom:', wasAtBottom);
        
        // If user was at bottom, prepare to scroll when keyboard appears
        if (wasAtBottom) {
            // Try multiple times to ensure scroll happens after keyboard
            setTimeout(scrollToBottom, 100);
            setTimeout(scrollToBottom, 300);
            setTimeout(scrollToBottom, 500);
        }
    });

    // When input is clicked/touched
    input.addEventListener('touchstart', () => {
        wasAtBottom = isScrolledToBottom();
        console.log('Input touched, was at bottom:', wasAtBottom);
    });

    input.addEventListener('click', () => {
        wasAtBottom = isScrolledToBottom();
        console.log('Input clicked, was at bottom:', wasAtBottom);
    });

    // Handle viewport resize (when keyboard appears/disappears)
    let lastHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    
    function handleViewportResize() {
        const currentHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        const heightDiff = lastHeight - currentHeight;
        
        console.log('Viewport resize:', { lastHeight, currentHeight, heightDiff, wasAtBottom });
        
        // Keyboard appeared (viewport got smaller by more than 100px)
        if (heightDiff > 100 && wasAtBottom) {
            isKeyboardVisible = true;
            console.log('Keyboard appeared, scrolling to bottom');
            scrollToBottom();
            // Retry scroll to handle keyboard animation
            setTimeout(scrollToBottom, 200);
            setTimeout(scrollToBottom, 400);
        }
        // Keyboard disappeared (viewport got bigger)
        else if (heightDiff < -100 && isKeyboardVisible) {
            isKeyboardVisible = false;
            console.log('Keyboard disappeared');
        }
        
        lastHeight = currentHeight;
    }

    // Use visualViewport API if available (better for mobile)
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', handleViewportResize);
        console.log('Using visualViewport API');
    } else {
        window.addEventListener('resize', handleViewportResize);
        console.log('Using window resize API');
    }

    // Track scroll position changes
    chatContent.addEventListener('scroll', () => {
        // Update wasAtBottom if user manually scrolls
        const atBottom = isScrolledToBottom();
        if (atBottom !== wasAtBottom && !isKeyboardVisible) {
            wasAtBottom = atBottom;
        }
    });

    console.log('Keyboard handling initialized');
}

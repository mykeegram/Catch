// message.js

/**
 * Creates and returns the HTML string for the floating message input bar.
 * @returns {string} The HTML string for the chat input and microphone button.
 */
export function createMessageInput() {
    // NOTE: The main wrapper needs to be a separate container to float at the bottom
    return `
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
 * Initializes keyboard handling for the message input.
 * Scrolls to bottom only if user is already at the bottom when keyboard appears.
 */
export function initializeKeyboardHandling() {
    const input = document.getElementById('chat-input-div');
    const chatContent = document.getElementById('chat-content');
    
    if (!input || !chatContent) return;

    let wasAtBottom = false;

    // Check if user is at the bottom of the chat
    function isScrolledToBottom() {
        const threshold = 100; // pixels from bottom
        return chatContent.scrollHeight - chatContent.scrollTop - chatContent.clientHeight < threshold;
    }

    // When input is focused (keyboard about to appear)
    input.addEventListener('focus', () => {
        wasAtBottom = isScrolledToBottom();
        
        // If user was at bottom, scroll to bottom after keyboard appears
        if (wasAtBottom) {
            setTimeout(() => {
                chatContent.scrollTop = chatContent.scrollHeight;
            }, 300); // Delay to account for keyboard animation
        }
    });

    // Handle viewport resize (when keyboard appears/disappears)
    let lastHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    
    function handleViewportResize() {
        const currentHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        
        // Keyboard appeared (viewport got smaller)
        if (currentHeight < lastHeight && wasAtBottom) {
            chatContent.scrollTop = chatContent.scrollHeight;
        }
        
        lastHeight = currentHeight;
    }

    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', handleViewportResize);
    } else {
        window.addEventListener('resize', handleViewportResize);
    }
}

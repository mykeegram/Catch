// js/message.js

/**
 * Creates and returns the HTML string for the floating message input bar.
 */
export function createMessageInput() {
    return `
        <div class="chat-input-area"> 
            <div class="input-wrapper">
                <div class="message-bubble input-bubble"> 
                    <div class="icon" id="emoji-btn">
                        <i class="fa-regular fa-face-smile"></i>
                    </div>
                    <div class="message-input" 
                         contenteditable="true" 
                         data-placeholder="Message" 
                         id="chat-input-div"></div>
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
 * Initializes keyboard handling for mobile viewport resize.
 * 
 * RULES:
 *  • Tapping 3-dot menu → Keyboard stays open
 *  • Tapping back button → Keyboard closes
 *  • Tapping outside chat → Keyboard stays open
 *  • Smooth scroll when keyboard opens
 */
export function initializeKeyboardHandling() {
    const input = document.getElementById('chat-input-div');
    const chatContent = document.getElementById('chat-content');
    const chatContainer = document.getElementById('chat-container');

    if (!input || !chatContent || !chatContainer) {
        console.log('Keyboard handling: Missing elements');
        return;
    }

    let wasAtBottom = false;
    let isKeyboardVisible = false;

    function isScrolledToBottom() {
        const threshold = 50;
        return chatContent.scrollHeight - chatContent.scrollTop - chatContent.clientHeight < threshold;
    }

    function scrollToBottom() {
        chatContent.scrollTo({
            top: chatContent.scrollHeight,
            behavior: 'smooth'
        });
    }

    // === 1. KEEP KEYBOARD OPEN ON 3-DOT MENU ===
    // This is handled in header.js — we just ensure no blur here

    // === 2. PREVENT KEYBOARD CLOSE WHEN TAPPING OUTSIDE CHAT ===
    const blockOutsideBlur = (e) => {
        if (document.activeElement === input) {
            const target = e.target;
            const isInChat = chatContainer.contains(target);
            const is3DotMenu = target.closest?.('.dropdown-wrapper');
            const isBackButton = target.closest?.('.back-button');

            // Allow back button to close keyboard
            if (isBackButton) return;

            // Allow 3-dot menu to stay open
            if (is3DotMenu) {
                e.stopPropagation();
                e.preventDefault();
                return;
            }

            // Block everything else outside chat
            if (!isInChat) {
                e.stopPropagation();
                e.preventDefault();
                // Re-focus to keep keyboard
                setTimeout(() => input.focus(), 0);
            }
        }
    };

    document.addEventListener('click', blockOutsideBlur, true);
    document.addEventListener('touchstart', blockOutsideBlur, true);

    // === 3. SCROLL TO BOTTOM ON FOCUS ===
    input.addEventListener('focus', () => {
        wasAtBottom = isScrolledToBottom();
        if (wasAtBottom) {
            setTimeout(scrollToBottom, 100);
            setTimeout(scrollToBottom, 300);
            setTimeout(scrollToBottom, 500);
        }
    });

    input.addEventListener('touchstart', () => {
        wasAtBottom = isScrolledToBottom();
    });

    input.addEventListener('click', () => {
        wasAtBottom = isScrolledToBottom();
    });

    // === 4. DETECT KEYBOARD OPEN/CLOSE VIA VIEWPORT ===
    let lastHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;

    function handleViewportResize() {
        const currentHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        const heightDiff = lastHeight - currentHeight;

        if (heightDiff > 100 && wasAtBottom) {
            isKeyboardVisible = true;
            scrollToBottom();
            setTimeout(scrollToBottom, 200);
            setTimeout(scrollToBottom, 400);
        } else if (heightDiff < -100 && isKeyboardVisible) {
            isKeyboardVisible = false;
        }

        lastHeight = currentHeight;
    }

    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', handleViewportResize);
    } else {
        window.addEventListener('resize', handleViewportResize);
    }

    // === 5. TRACK SCROLL POSITION ===
    chatContent.addEventListener('scroll', () => {
        const atBottom = isScrolledToBottom();
        if (atBottom !== wasAtBottom && !isKeyboardVisible) {
            wasAtBottom = atBottom;
        }
    });

    console.log('Keyboard handling initialized: 3-dot keeps open, outside taps ignored');
}

/**
 * Switches between Mic and Send Arrow based on input content.
 */
export function initializeSendMicSwitch() {
    const input = document.getElementById('chat-input-div');
    const micBtn = document.getElementById('mic-btn');
    const micSVG = document.getElementById('micSVG');

    if (!input || !micBtn || !micSVG) {
        console.warn('Send/Mic switch: missing elements');
        return;
    }

    const arrowSVG = `
        <svg id="arrowSVG" xmlns="http://www.w3.org/2000/svg" viewBox="-15 0 150 122.88" width="21" height="21">
            <g transform="rotate(40, 61.28, 61.44) translate(-5, 0)">
                <path style="fill: white; fill-rule: evenodd;" 
                      d="M2.33,44.58,117.33.37a3.63,3.63,0,0,1,5,4.56l-44,115.61h0a3.63,3.63,0,0,1-6.67.28L53.93,84.14,89.12,33.77,38.85,68.86,2.06,51.24a3.63,3.63,0,0,1,.27-6.66Z">
                </path>
            </g>
        </svg>
    `;

    function updateIcon() {
        const hasText = input.textContent.trim().length > 0;
        const arrow = document.getElementById('arrowSVG');

        if (hasText) {
            micSVG.style.display = 'none';
            micBtn.classList.add('sending');
            if (!arrow) {
                micBtn.insertAdjacentHTML('beforeend', arrowSVG);
            }
        } else {
            micBtn.classList.remove('sending');
            if (arrow) arrow.remove();
            micSVG.style.display = 'block';
        }
    }

    input.addEventListener('input', updateIcon);
    input.addEventListener('paste', () => setTimeout(updateIcon, 0));
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
            setTimeout(updateIcon, 0);
        }
    });

    updateIcon();

    console.log('Send/Mic icon switch initialized');
}

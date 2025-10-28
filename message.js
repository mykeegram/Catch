// js/message.js
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

/* ==============================================================
   KEYBOARD LOCK – WhatsApp-exact
   • 3-dot, outside chat, **any tap/long-press in #chat-content** → keep open
   • back / avatar → close
   • smooth scroll
   ============================================================== */
export function initializeKeyboardHandling() {
    const input         = document.getElementById('chat-input-div');
    const chatContent   = document.getElementById('chat-content');
    const chatContainer = document.getElementById('chat-container');

    if (!input || !chatContent || !chatContainer) return;

    let wasAtBottom = false;
    let isKeyboardVisible = false;

    const scrollToBottom = () => chatContent.scrollTo({ top: chatContent.scrollHeight, behavior: 'smooth' });
    const isScrolledToBottom = () => chatContent.scrollHeight - chatContent.scrollTop - chatContent.clientHeight < 50;

    input.addEventListener('focus', () => {
        wasAtBottom = isScrolledToBottom();
        if (wasAtBottom) {
            setTimeout(scrollToBottom, 100);
            setTimeout(scrollToBottom, 300);
        }
    });

    /* -----------------------------------------------------------
       GLOBAL HANDLER – prevents blur on EVERY interaction inside chat
       ----------------------------------------------------------- */
    const keepKeyboard = (e) => {
        if (document.activeElement !== input) return;

        const backBtn    = e.target.closest('.back-button');
        const avatarName = e.target.closest('.meta, .avatar-wrap');

        // Only close on explicit actions
        if (backBtn || avatarName) {
            input.blur();
            return;
        }

        // **ANY** interaction in chat content (tap, long-press, hold)
        if (chatContainer.contains(e.target)) {
            e.preventDefault();                 // block blur
            requestAnimationFrame(() => input.focus()); // lock focus
        }
    };

    // Capture **all** possible events
    ['click', 'touchstart', 'touchend', 'mousedown', 'pointerdown'].forEach(ev => {
        document.addEventListener(ev, keepKeyboard, { capture: true, passive: false });
    });

    // Long-press detection (extra safety)
    let longPressTimer;
    document.addEventListener('touchstart', (e) => {
        if (document.activeElement !== input) return;
        if (chatContainer.contains(e.target)) {
            longPressTimer = setTimeout(() => {
                e.preventDefault();
                requestAnimationFrame(() => input.focus());
            }, 300);
        }
    }, { passive: false });
    document.addEventListener('touchend', () => clearTimeout(longPressTimer));

    // Viewport resize (keyboard show/hide)
    let lastHeight = window.visualViewport?.height || window.innerHeight;
    const onResize = () => {
        const cur = window.visualViewport?.height || window.innerHeight;
        const diff = lastHeight - cur;
        if (diff > 100 && wasAtBottom) {
            isKeyboardVisible = true;
            scrollToBottom();
        } else if (diff < -100) isKeyboardVisible = false;
        lastHeight = cur;
    };
    (window.visualViewport || window).addEventListener('resize', onResize);

    // Scroll tracking
    chatContent.addEventListener('scroll', () => {
        if (!isKeyboardVisible) wasAtBottom = isScrolledToBottom();
    });

    console.log('Keyboard lock: message interactions keep it open');
}

/* Mic to Send switch */
export function initializeSendMicSwitch() {
    const input  = document.getElementById('chat-input-div');
    const micBtn = document.getElementById('mic-btn');
    const micSVG = document.getElementById('micSVG');
    if (!input || !micBtn || !micSVG) return;

    const arrowSVG = `<svg id="arrowSVG" xmlns="http://www.w3.org/2000/svg" viewBox="-15 0 150 122.88" width="21" height="21">
        <g transform="rotate(40, 61.28, 61.44) translate(-5, 0)">
            <path style="fill: white; fill-rule: evenodd;" 
                  d="M2.33,44.58,117.33.37a3.63,3.63,0,0,1,5,4.56l-44,115.61h0a3.63,3.63,0,0,1-6.67.28L53.93,84.14,89.12,33.77,38.85,68.86,2.06,51.24a3.63,3.63,0,0,1,.27-6.66Z">
            </path>
        </g>
    </svg>`;

    const update = () => {
        const hasText = input.textContent.trim().length > 0;
        const arrow = document.getElementById('arrowSVG');
        if (hasText && !arrow) {
            micSVG.style.display = 'none';
            micBtn.classList.add('sending');
            micBtn.insertAdjacentHTML('beforeend', arrowSVG);
        } else if (!hasText && arrow) {
            micBtn.classList.remove('sending');
            arrow.remove();
            micSVG.style.display = 'block';
        }
    };

    input.addEventListener('input', update);
    input.addEventListener('paste', () => setTimeout(update, 0));
    input.addEventListener('keydown', e => (e.key === 'Backspace' || e.key === 'Delete') && setTimeout(update, 0));
    update();
}

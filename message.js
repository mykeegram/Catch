// message.js
export function initMessaging(chatContainer) {
    // ------------------------------------------------------------------
    // 1. Build the input bar (once)
    // ------------------------------------------------------------------
    const inputHTML = `
        <div class="message-input-area">
            <div class="input-wrapper">
                <div class="message-bubble">
                    <div class="icon" id="emoji-btn"><i class="fa-regular fa-face-smile"></i></div>
                    <div class="message-input" contenteditable="true" data-placeholder="Message" id="chat-input-div"></div>
                    <button class="attach-btn" aria-label="Attach">
                        <i class="fa-solid fa-paperclip"></i>
                    </button>
                </div>
                <div class="recording-overlay" id="recording-overlay"></div>
                <button class="mic-btn" id="mic-btn" aria-label="Send">
                    <svg id="micSVG" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path d="M7.25 7C7.25 4.37665 9.37665 2.25 12 2.25C14.6234 2.25 16.75 4.37665 16.75 7V11C16.75 13.6234 14.6234 15.75 12 15.75C9.37665 15.75 7.25 13.6234 7.25 11V7Z" fill="#ffffff"></path>
                            <path d="M5.75 10C5.75 9.58579 5.41421 9.25 5 9.25C4.58579 9.25 4.25 9.58579 4.25 10V11C4.25 15.0272 7.3217 18.3369 11.25 18.7142V21C11.25 21.4142 11.5858 21.75 12 21.75C12.4142 21.75 12.75 21.4142 12.75 21V18.7142C16.6783 18.3369 19.75 15.0272 19.75 11V10C19.75 9.58579 19.4142 9.25 19 9.25C18.5858 9.25 18.25 9.58579 18.25 10V11C18.25 14.4518 15.4518 17.25 12 17.25C8.54822 17.25 5.75 14.4518 5.75 11V10Z" fill="#ffffff"></path>
                        </g>
                    </svg>
                    <div class="send-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 4L3 11L10 14L13 21L20 4Z" fill="#fff"/>
                        </svg>
                    </div>
                </button>
            </div>
        </div>
    `;

    // Append after the chat-content
    const chatContent = chatContainer.querySelector("#chat-content");
    if (!chatContent) return;
    const wrapper = document.createElement("div");
    wrapper.innerHTML = inputHTML;
    chatContainer.appendChild(wrapper.firstChild);

    // ------------------------------------------------------------------
    // 2. Grab elements
    // ------------------------------------------------------------------
    const inputDiv   = chatContainer.querySelector("#chat-input-div");
    const micBtn     = chatContainer.querySelector("#mic-btn");
    const micSVG     = micBtn.querySelector("#micSVG");
    const sendIcon   = micBtn.querySelector(".send-icon");
    const overlay    = chatContainer.querySelector("#recording-overlay");

    // ------------------------------------------------------------------
    // 3. Helper: toggle mic ↔ send
    // ------------------------------------------------------------------
    function toggleSendButton(showSend) {
        if (showSend) {
            micSVG.style.display = "none";
            sendIcon.style.display = "block";
            micBtn.style.background = "#2f8ef7";
        } else {
            micSVG.style.display = "block";
            sendIcon.style.display = "none";
            micBtn.style.background = "#749cbf";
        }
    }

    // ------------------------------------------------------------------
    // 4. Send message
    // ------------------------------------------------------------------
    function sendMessage() {
        const text = inputDiv.textContent.trim();
        if (!text) return;

        // ---- Build sent message (reuse your existing render logic) ----
        const chatContent = chatContainer.querySelector("#chat-content");

        const msgDiv = document.createElement("div");
        msgDiv.className = "chat-message sent";

        const bubble = document.createElement("div");
        bubble.className = "message-bubble";
        bubble.innerHTML = `
            <div class="message-text">${text}</div>
            <div class="message-time">${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
            <span class="check-marks">
                <svg viewBox="0 0 16 15" width="16" height="15">
                    <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"/>
                </svg>
            </span>
        `;

        msgDiv.appendChild(bubble);
        chatContent.appendChild(msgDiv);
        chatContent.scrollTop = chatContent.scrollHeight;

        // ---- Clear input ----
        inputDiv.textContent = "";
        toggleSendButton(false);
    }

    // ------------------------------------------------------------------
    // 5. Listeners
    // ------------------------------------------------------------------
    inputDiv.addEventListener("input", () => {
        toggleSendButton(inputDiv.textContent.trim().length > 0);
    });

    // Enter → send (Shift+Enter → newline)
    inputDiv.addEventListener("keydown", e => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    micBtn.addEventListener("click", () => {
        const hasText = inputDiv.textContent.trim().length > 0;
        if (hasText) sendMessage();
        // else: could start voice recording – not implemented here
    });

    // Optional: emoji picker (stub)
    chatContainer.querySelector("#emoji-btn")?.addEventListener("click", () => {
        alert("Emoji picker not implemented");
    });

    // Optional: attach button
    chatContainer.querySelector(".attach-btn")?.addEventListener("click", () => {
        alert("Attach file not implemented");
    });

    // Focus input when chat opens
    setTimeout(() => inputDiv.focus(), 100);
}

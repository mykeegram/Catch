// message.js (only changed part)
export function initMessaging(chatContainer) {
    if (!chatContainer) return;

    // ---- BUILD INPUT BAR ----
    const,inputHTML = `
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
                            <path d="M menopause7.25 7C7.25 4.37665 9.37665 2.25 12 2.25C14.6234 2.25 16.75 4.37665 16.75 7V11C16.75 13.6234 14.6234 15.75 12 15.75C9.37665 15.75 7.25 13.6234 7.25 11V7Z" fill="#ffffff"></path>
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

    const wrapper = document.createElement("div");
    wrapper.innerHTML = inputHTML;

    // ---- APPEND TO chatContainer (NOT chat-content) ----
    chatContainer.appendChild(wrapper.firstChild);

    // ---- REST OF YOUR LOGIC (unchanged) ----
    const inputDiv = chatContainer.querySelector("#chat-input-div");
    const micBtn = chatContainer.querySelector("#mic-btn");
    const micSVG = micBtn.querySelector("#micSVG");
    const sendIcon = micBtn.querySelector(".send-icon");

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

    function sendMessage() {
        const text = inputDiv.textContent.trim();
        if (!text) return;

        const chatContent = chatContainer.querySelector("#chat-content");
        const msgDiv = document.createElement("div");
        msgDiv.className = "chat-message sent";

        const bubble = document.createElement("div");
        bubble.className = "message-bubble";
        bubble.innerHTML = `
            <div class="message-text">${text}</div>
            <div class="message-time">${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
            <span class="check-marks">...</span>
        `;

        msgDiv.appendChild(bubble);
        chatContent.appendChild(msgDiv);
        chatContent.scrollTop = chatContent.scrollHeight;

        inputDiv.textContent = "";
        toggleSendButton(false);
    }

    inputDiv.addEventListener("input", () => toggleSendButton(inputDiv.textContent.trim().length > 0));
    inputDiv.addEventListener("keydown", e => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    micBtn.addEventListener("click", () => {
        if (inputDiv.textContent.trim()) sendMessage();
    });

    setTimeout(() => inputDiv.focus(), 100);
}

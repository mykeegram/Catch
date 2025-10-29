// image.js
export function createImageSection(src, alt = "Chat image") {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.className = "message-image";
    img.style.cursor = "pointer";
    img.onerror = () => console.error(`Image load error: ${src}`);

    // === CLICK TO OPEN FULL VIEWER ===
    img.addEventListener("click", (e) => {
        e.stopPropagation();

        const chatContent = document.getElementById("chat-content");
        if (!chatContent) {
            showErrorToast("Chat content not found");
            return;
        }

        const allImgEls = Array.from(chatContent.querySelectorAll(".message-image"));
        if (allImgEls.length === 0) {
            showErrorToast("No images in chat");
            return;
        }

        const images = allImgEls.map(el => {
            const msgDiv = el.closest(".chat-message");
            const timeEl = msgDiv?.querySelector(".message-time");
            const replyEl = msgDiv?.querySelector(".reply-section");
            return {
                url: el.src,
                alt: el.alt,
                time: timeEl?.textContent.trim() || "",
                caption: replyEl?.textContent.trim() || ""
            };
        });

        const startIdx = images.findIndex(i => i.url === src);
        if (startIdx === -1) {
            showErrorToast("Image not found in list");
            return;
        }

        const convName = document.querySelector(".app-chat-header .conversation-name")?.textContent || "User";
        const senderName = img.closest(".chat-message")?.classList.contains("sent")
            ? "Catch-up Messenger"
            : convName;

        // === DYNAMIC IMPORT WITH ERROR HANDLING ===
        import('./s-image.js')
            .then(mod => {
                try {
                    mod.openImageViewer({
                        images,
                        startIndex: startIdx,
                        senderName
                    });
                } catch (err) {
                    console.error("Viewer failed to open:", err);
                    showErrorToast("Failed to open image viewer");
                }
            })
            .catch(err => {
                console.error("Failed to load s-image.js:", err);
                showErrorToast("Image viewer module not loaded");
            });
    });

    return img;
}

// === ERROR TOAST (Visual Feedback) ===
function showErrorToast(message) {
    // Remove any existing toast
    const existing = document.querySelector(".error-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "error-toast";
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: #ef4444;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: toastFade 3s forwards;
    `;

    document.body.appendChild(toast);

    // Auto-remove after animation
    toast.addEventListener("animationend", () => toast.remove());
}

// Add toast animation
const style = document.createElement("style");
style.textContent = `
    @keyframes toastFade {
        0%, 100% { opacity: 0; transform: translateX(-50%) translateY(10px); }
        10%, 90% { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
`;
document.head.appendChild(style);

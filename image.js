// image.js
export function createImageSection(src, alt = "Chat image") {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.className = "message-image";
    img.style.cursor = "pointer";
    img.draggable = false; // Prevent drag
    img.onerror = () => console.error(`Image load error: ${src}`);

    // === DISABLE CONTEXT MENU (right-click / long-press) ===
    img.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        return false;
    });

    // === CLICK / TAP → OPEN VIEWER ONLY ===
    img.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Prevent double-tap zoom on mobile
        if (e.detail > 1) return;

        const chatContent = document.getElementById("chat-content");
        if (!chatContent) {
            showErrorToast("Chat not loaded");
            return;
        }

        const allImgEls = Array.from(chatContent.querySelectorAll(".message-image"));
        if (allImgEls.length === 0) {
            showErrorToast("No images found");
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
            showErrorToast("Image not in list");
            return;
        }

        const convName = document.querySelector(".app-chat-header .conversation-name")?.textContent || "User";
        const senderName = img.closest(".chat-message")?.classList.contains("sent")
            ? "Catch-up Messenger"
            : convName;

        import('./s-image.js')
            .then(mod => {
                try {
                    mod.openImageViewer({
                        images,
                        startIndex: startIdx,
                        senderName
                    });
                } catch (err) {
                    console.error("Viewer error:", err);
                    showErrorToast("Viewer failed");
                }
            })
            .catch(err => {
                console.error("Module load failed:", err);
                showErrorToast("Viewer not available");
            });
    });

    return img;
}

// === TOAST FOR ERRORS ===
function showErrorToast(message) {
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
    toast.addEventListener("animationend", () => toast.remove());
}

// Inject animation
const style = document.createElement("style");
style.textContent = `
    @keyframes toastFade {
        0%, 100% { opacity: 0; transform: translateX(-50%) translateY(10px); }
        10%, 90% { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
`;
document.head.appendChild(style);

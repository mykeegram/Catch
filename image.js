// image.js
export function createImageSection(src, alt = "Chat image") {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.className = "message-image";
    img.style.cursor = "pointer";
    img.onerror = () => console.error(`Image load error: ${src}`);

    // ---- CLICK → OPEN S-IMAGE VIEWER ----
    img.addEventListener("click", (e) => {
        e.stopPropagation();

        const chatContent = document.querySelector("#chat-content");
        if (!chatContent) return;

        // 1. Collect **ALL** images in the current chat
        const allImageEls = Array.from(chatContent.querySelectorAll(".message-image"));
        const allImages = allImageEls.map(el => {
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

        const startIndex = allImages.findIndex(i => i.url === src);
        if (startIndex === -1) return;

        // 2. Determine **sender name** based on message direction
        const messageDiv = img.closest(".chat-message");
        const isSent = messageDiv?.classList.contains("sent");
        const senderName = isSent ? "Catch-up Messenger" : "Chizaram";

        // 3. Open viewer (lazy import)
        import('./s-image.js')
            .then(mod => {
                mod.openImageViewer({
                    images: allImages,
                    startIndex,
                    senderName
                });
            })
            .catch(err => console.error("Failed to load s-image.js:", err));
    });

    return img;
}

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
        if (!chatContent) return;

        const allImgEls = Array.from(chatContent.querySelectorAll(".message-image"));
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
        if (startIdx === -1) return;

        const convName = document.querySelector(".app-chat-header .conversation-name")?.textContent || "User";
        const senderName = img.closest(".chat-message")?.classList.contains("sent")
            ? "Catch-up Messenger"
            : convName;

        import('./s-image.js')
            .then(mod => {
                mod.openImageViewer({
                    images,
                    startIndex: startIdx,
                    senderName
                });
            })
            .catch(err => console.error("Failed to load viewer:", err));
    });

    return img;
}

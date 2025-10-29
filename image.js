// image.js
export function createImageSection(src, alt = "Chat image") {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.className = "message-image";
    img.style.cursor = "pointer";
    img.onerror = () => console.error(`Image load error: ${src}`);

    // Click → Open full-screen viewer with accurate index
    img.addEventListener("click", (e) => {
        e.stopPropagation();

        const chatContent = document.querySelector("#chat-content");
        if (!chatContent) return;

        // Collect all images in the current chat
        const allImageElements = Array.from(chatContent.querySelectorAll(".message-image"));
        const allImages = allImageElements.map((el) => {
            const messageDiv = el.closest(".chat-message");
            const timeEl = messageDiv?.querySelector(".message-time");
            const replyEl = messageDiv?.querySelector(".reply-section");

            return {
                url: el.src,
                alt: el.alt,
                time: timeEl?.textContent.trim() || "",
                caption: replyEl?.textContent.trim() || ""
            };
        });

        // Find the index of the clicked image
        const startIndex = allImages.findIndex(img => img.url === src);
        if (startIndex === -1) return;

        // Get sender name from chat header
        const senderName = document.querySelector(".app-chat-header .conversation-name")?.textContent || "User";

        // Dynamically import the viewer (lazy load)
        import('./s-image.js').then(mod => {
            mod.openImageViewer({
                images: allImages,
                startIndex,
                senderName
            });
        }).catch(err => console.error("Failed to load image viewer:", err));
    });

    return img;
}

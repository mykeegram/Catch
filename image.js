// image.js
export function createImageSection(src, alt = "Chat image", sender = "Unknown", time = "") {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.className = "message-image";
    img.dataset.sender = sender;
    img.dataset.time = time;
    img.loading = "lazy";
    img.onerror = () => console.error(`Image load error: ${src}`);
    return img;
}

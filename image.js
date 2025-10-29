export function createImageSection(src, alt = "Chat image") {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.className = "message-image";
    img.onerror = () => console.error(`Image load error: ${src}`);
    return img;
}

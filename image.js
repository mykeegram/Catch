// image.js
export function createImageSection(src, alt = "Chat image") {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.className = "message-image";
    img.style.cursor = "pointer";
    img.onerror = () => console.error(`Image load error: ${src}`);

    // FIX: Prevents the native context menu (like "Save image as...")
    img.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    
    return img;
}

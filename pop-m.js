// pop-m.js

/**
 * Creates the initial pop-up structure and adds it to the DOM.
 */
export function initializeImagePopup() {
    const existingPopup = document.getElementById('full-screen-image-popup');
    if (existingPopup) return;

    const popup = document.createElement('div');
    popup.id = 'full-screen-image-popup';
    popup.className = 'image-popup-overlay';
    popup.innerHTML = `
        <img id="popup-image-content" src="" alt="Full screen chat image" class="popup-image">
    `;
    document.body.appendChild(popup);

    // Close on click anywhere on the overlay
    popup.addEventListener('click', closeImagePopup);
}

/**
 * Opens the image pop-up with the given image source.
 * @param {string} src - The source URL of the image to display.
 */
function openImagePopup(src) {
    const popup = document.getElementById('full-screen-image-popup');
    const imageContent = document.getElementById('popup-image-content');

    if (popup && imageContent) {
        imageContent.src = src;
        popup.classList.add('open');
        // Prevent background scrolling
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Closes the image pop-up.
 */
function closeImagePopup() {
    const popup = document.getElementById('full-screen-image-popup');
    if (popup) {
        popup.classList.remove('open');
        // Restore background scrolling
        document.body.style.overflow = '';
    }
}

/**
 * Attaches click listeners to all chat images to trigger the pop-up.
 * This should be called *after* chat messages have been rendered.
 */
export function initializeImageClickListeners() {
    // 1. Ensure the popup element exists
    initializeImagePopup();

    // 2. Attach listeners to all currently visible chat images
    const images = document.querySelectorAll('.message-image');

    images.forEach(img => {
        // Remove previous listener to prevent duplication if the function is called multiple times
        img.removeEventListener('click', img.popupListener);

        // Define the listener function
        const listener = (event) => {
            // Stop the click from bubbling up to the message bubble or other parents
            event.stopPropagation();
            openImagePopup(img.src);
        };

        // Attach the listener and store a reference to it on the element
        img.popupListener = listener;
        img.addEventListener('click', listener);
    });
}

// Add a global listener for the ESC key to close the popup
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeImagePopup();
    }
});


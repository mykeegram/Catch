// header.js

// Function to render the chat/discussion header
export function renderHeader(container, config) {
    try {
        console.log("Rendering header with config:", config); // Debug log
        if (!container) throw new Error("Header container not found");

        const { title, avatar, badge = 0, subtext = "Active now" } = config;

        container.innerHTML = `
            <div class="left">
                <!-- Back button with custom arrow SVG -->
                <button class="icon-btn back-button" aria-label="Back">
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <!-- Horizontal line -->
                        <line x1="4" y1="12" x2="20" y2="12" stroke="var(--icon-color)" stroke-width="2.2" stroke-linecap="round"/>
                        <!-- Arrowhead -->
                        <polyline points="10,6 4,12 10,18" fill="none" stroke="var(--icon-color)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>

                <!-- Avatar with optional badge -->
                <div class="avatar-wrap">
                    <div class="avatar">${avatar}</div>
                    ${badge > 0 ? `<div class="badge" title="${badge} new message(s)">${badge}</div>` : ''}
                </div>
            </div>

            <!-- Name + subtext -->
            <div class="meta" role="group" aria-label="Contact info">
                <div class="name">${title}</div>
                <div class="sub">${subtext}</div>
            </div>

            <!-- More options button -->
            <button class="icon-btn more-options" aria-label="More options">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <circle cx="12" cy="6" r="1.6" fill="var(--icon-color)"/>
                    <circle cx="12" cy="12" r="1.6" fill="var(--icon-color)"/>
                    <circle cx="12" cy="18" r="1.6" fill="var(--icon-color)"/>
                </svg>
            </button>
        `;

        // Add event listener for back button
        const backButton = container.querySelector(".back-button");
        if (backButton) {
            backButton.addEventListener("click", config.onBack || (() => console.log("Back clicked")));
        }

        // Optional: Add event listener for more options
        const moreButton = container.querySelector(".more-options");
        if (moreButton) {
            moreButton.addEventListener("click", config.onMore || (() => console.log("More options clicked")));
        }

        console.log("Header rendered successfully"); // Debug log
    } catch (error) {
        console.error("Error rendering header:", error);
    }
}

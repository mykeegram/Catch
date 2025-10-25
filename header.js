// header.js
export function renderHeader(container, config) {
    try {
        if (!container) throw new Error("Header container not found");

        const {
            title,
            avatar,
            badge = 0,
            subtext = "Active now",
            onBack,
            onMore
        } = config;

        // ---- SCOPED CLASS ----
        container.className = "app-chat-header";

        // ---- HTML ----
        container.innerHTML = `
            <div class="left">
                <button class="icon-btn back-button" aria-label="Back">
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <line x1="4" y1="12" x2="20" y2="12"
                              stroke="var(--header-icon-color)" stroke-width="2.2"
                              stroke-linecap="round"/>
                        <polyline points="10,6 4,12 10,18" fill="none"
                                  stroke="var(--header-icon-color)" stroke-width="2.2"
                                  stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>

                <div class="avatar-wrap">
                    <div class="avatar">${avatar}</div>
                    ${badge > 0 ? `<div class="badge" title="${badge} new message(s)">${badge}</div>` : ''}
                </div>
            </div>

            <div class="meta" role="group" aria-label="Contact info">
                <div class="name">${title}</div>
                <div class="sub">${subtext}</div>
            </div>

            <button class="icon-btn more-options" aria-label="More options">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <circle cx="12" cy="6"   r="1.6" fill="var(--header-icon-color)"/>
                    <circle cx="12" cy="12"  r="1.6" fill="var(--header-icon-color)"/>
                    <circle cx="12" cy="18"  r="1.6" fill="var(--header-icon-color)"/>
                </svg>
            </button>
        `;

        // ---- EVENT LISTENERS ----
        const backBtn = container.querySelector(".back-button");
        backBtn?.addEventListener("click", onBack || (() => {}));

        const moreBtn = container.querySelector(".more-options");
        moreBtn?.addEventListener("click", onMore || (() => {}));

    } catch (error) {
        console.error("Error rendering header:", error);
    }
}

// header.js

// Make sure to import the createDropdown function from your drop.js file
import { createDropdown } from './drop.js';

export function renderHeader(container, config) {
    try {
        if (!container) throw new Error("Header container not found");

        const {
            title,
            avatar,
            badge = 0,
            subtext = "Active now",
            onBack,
            // Changed from 'onMore' to 'moreMenuItems' to pass the menu configuration
            moreMenuItems = [] 
        } = config;

        // ---- SCOPED CLASS ----
        container.className = "app-chat-header";
        
        // --- 1. Create the 'More options' trigger button (3-dot SVG) ---
        // This button will be passed to createDropdown
        const moreBtn = document.createElement('button');
        moreBtn.className = 'icon-btn more-options';
        moreBtn.setAttribute('aria-label', 'More options');
        moreBtn.setAttribute('aria-haspopup', 'true');
        moreBtn.setAttribute('aria-expanded', 'false'); // Initial state

        moreBtn.innerHTML = `
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="12" cy="6"   r="1.6" fill="var(--header-icon-color)"/>
                <circle cx="12" cy="12"  r="1.6" fill="var(--header-icon-color)"/>
                <circle cx="12" cy="18"  r="1.6" fill="var(--header-icon-color)"/>
            </svg>
        `;
        
        // --- 2. Create the complete dropdown element ---
        const dropdownElement = createDropdown(moreBtn, moreMenuItems);


        // ---- HTML ----
        // Note: The static 'More options' button HTML has been replaced by a placeholder div
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

            <div class="dropdown-container-placeholder"></div>
        `;
        
        // ---- INSERT DROPDOWN ----
        // Find the placeholder and replace it with the complete dropdown element
        const placeholder = container.querySelector(".dropdown-container-placeholder");
        placeholder.replaceWith(dropdownElement);


        // ---- EVENT LISTENERS ----
        const backBtn = container.querySelector(".back-button");
        backBtn?.addEventListener("click", onBack || (() => {}));

        // NOTE: The click logic for the 'More' button is now handled by the createDropdown function in drop.js.

    } catch (error) {
        console.error("Error rendering header:", error);
    }
}


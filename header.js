// header.js
export function renderHeader(container, config) {
    try {
        if (!container) throw new Error("Header container not found");

        const {
            title = "Chat",
            avatar = "U",
            badge = 0,
            subtext = "Active now",
            onBack,
            onMore
        } = config;

        // Clear previous content and cleanup
        if (container._headerCleanup) {
            container._headerCleanup();
            container._headerCleanup = null;
        }
        container.className = "app-chat-header";
        container.innerHTML = "";

        // ---- HTML TEMPLATE ----
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

            <div class="dropdown-wrapper">
                <button class="icon-btn more-options" aria-label="More options" aria-haspopup="true" aria-expanded="false">
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <circle cx="12" cy="6"   r="1.6" fill="var(--header-icon-color)"/>
                        <circle cx="12" cy="12"  r="1.6" fill="var(--header-icon-color)"/>
                        <circle cx="12" cy="18"  r="1.6" fill="var(--header-icon-color)"/>
                    </svg>
                </button>

                <!-- Dropdown Menu -->
                <div class="dropdown-menu taka" role="menu" aria-hidden="true">
                    <button class="dropdown-item" role="menuitem">View Profile</button>
                    <button class="dropdown-item" role="menuitem">Mute Notifications</button>
                    <button class="dropdown-item" role="menuitem">Block User</button>
                    <hr class="dropdown-divider">
                    <button class="dropdown-item text-danger" role="menuitem">Delete Chat</button>
                </div>
            </div>
        `;

        // ---- DOM REFERENCES ----
        const backBtn = container.querySelector(".back-button");
        const moreBtn = container.querySelector(".more-options");
        const dropdown = container.querySelector(".dropdown-menu");
        const wrapper = container.querySelector(".dropdown-wrapper");

        // ---- DROPDOWN TOGGLE LOGIC ----
        const toggleDropdown = (e) => {
            e.stopPropagation();
            const isOpen = dropdown.getAttribute("aria-hidden") === "false";
            dropdown.setAttribute("aria-hidden", String(!isOpen));
            moreBtn.setAttribute("aria-expanded", String(!isOpen));
            dropdown.classList.toggle("show");
        };

        moreBtn.addEventListener("click", toggleDropdown);

        // Close on outside click
        const closeOnClickOutside = (e) => {
            if (!wrapper.contains(e.target)) {
                dropdown.setAttribute("aria-hidden", "true");
                moreBtn.setAttribute("aria-expanded", "false");
                dropdown.classList.remove("show");
            }
        };
        document.addEventListener("click", closeOnClickOutside);

        // Close on Escape key
        const closeOnEsc = (e) => {
            if (e.key === "Escape") {
                dropdown.setAttribute("aria-hidden", "true");
                moreBtn.setAttribute("aria-expanded", "false");
                dropdown.classList.remove("show");
            }
        };
        document.addEventListener("keydown", closeOnEsc);

        // ---- MENU ITEM CLICKS ----
        dropdown.querySelectorAll(".dropdown-item").forEach(item => {
            item.addEventListener("click", () => {
                const action = item.textContent.trim();
                toggleDropdown({ stopPropagation: () => {} });
                if (onMore) onMore(action);
            });
        });

        // ---- BACK BUTTON ----
        backBtn?.addEventListener("click", onBack || (() => {}));

        // ---- CLEANUP FUNCTION (for re-renders) ----
        container._headerCleanup = () => {
            document.removeEventListener("click", closeOnClickOutside);
            document.removeEventListener("keydown", closeOnEsc);
            moreBtn?.removeEventListener("click", toggleDropdown);
        };

    } catch (error) {
        console.error("Error rendering header:", error);
    }
}

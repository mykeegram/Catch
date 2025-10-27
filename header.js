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
            onMore,
            type = "one-to-one" // "one-to-one" or "group"
        } = config;

        // Cleanup previous
        if (container._headerCleanup) {
            container._headerCleanup();
            container._headerCleanup = null;
        }
        container.className = "app-chat-header";
        container.innerHTML = "";

        // ==== MENU ITEMS BASED ON TYPE ====
        const isGroup = type === "group";
        const menuItems = isGroup
            ? [
                  { label: "Group Info", danger: false },
                  { label: "View as Message", danger: false },
                  { divider: true },
                  { label: "Leave Group", danger: true }
              ]
            : [
                  { label: "View Profile", danger: false },
                  { label: "Mute Notifications", danger: false },
                  { label: "Block User", danger: false },
                  { divider: true },
                  { label: "Delete Chat", danger: true }
              ];

        // Build dropdown HTML
        let dropdownHTML = '';
        menuItems.forEach(item => {
            if (item.divider) {
                dropdownHTML += `<hr class="dropdown-divider">`;
            } else {
                const dangerClass = item.danger ? 'text-danger' : '';
                dropdownHTML += `<button class="dropdown-item ${dangerClass}" role="menuitem">${item.label}</button>`;
            }
        });

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

            <div class="meta" role="group" aria-label="${isGroup ? 'Group' : 'Contact'} info">
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

                <div class="dropdown-menu" role="menu" aria-hidden="true">
                    ${dropdownHTML}
                </div>
            </div>
        `;

        // ---- DOM REFERENCES ----
        const backBtn = container.querySelector(".back-button");
        const moreBtn = container.querySelector(".more-options");
        const dropdown = container.querySelector(".dropdown-menu");
        const wrapper = container.querySelector(".dropdown-wrapper");

        // ---- TOGGLE DROPDOWN ----
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

        // Close on Escape
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
                if (onMore) onMore({ action, type });
            });
        });

        // ---- BACK BUTTON ----
        backBtn?.addEventListener("click", onBack || (() => {}));

        // ---- CLEANUP ----
        container._headerCleanup = () => {
            document.removeEventListener("click", closeOnClickOutside);
            document.removeEventListener("keydown", closeOnEsc);
            moreBtn?.removeEventListener("click", toggleDropdown);
        };

    } catch (error) {
        console.error("Error rendering header:", error);
    }
}

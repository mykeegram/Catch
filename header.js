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
            type = "one-to-one"
        } = config;

        // Cleanup previous render
        if (container._headerCleanup) {
            container._headerCleanup();
            container._headerCleanup = null;
        }
        container.className = "app-chat-header";
        container.innerHTML = "";

        const isGroup = type === "group";
        const menu = isGroup
            ? [
                  { label: "Group Info",      danger: false },
                  { label: "View as Message", danger: false },
                  { divider: true },
                  { label: "Leave Group",     danger: true }
              ]
            : [
                  { label: "View Profile",       danger: false },
                  { label: "Mute Notifications", danger: false },
                  { label: "Block User",         danger: false },
                  { divider: true },
                  { label: "Delete Chat",        danger: true }
              ];

        let dropdownHTML = "";
        menu.forEach(item => {
            if (item.divider) {
                dropdownHTML += `<hr class="dropdown-divider">`;
            } else {
                const danger = item.danger ? " text-danger" : "";
                dropdownHTML += `<button class="dropdown-item${danger}" role="menuitem">${item.label}</button>`;
            }
        });

        container.innerHTML = `
            <div class="left">
                <button class="icon-btn back-button" aria-label="Back">
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <line x1="4" y1="12" x2="20" y2="12" stroke="var(--header-icon-color)" stroke-width="2.2" stroke-linecap="round"/>
                        <polyline points="10,6 4,12 10,18" fill="none" stroke="var(--header-icon-color)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>

                <div class="avatar-wrap">
                    <div class="avatar">${avatar}</div>
                    ${badge > 0 ? `<div class="badge" title="${badge} new message(s)">${badge}</div>` : ""}
                </div>
            </div>

            <div class="meta" role="group" aria-label="${isGroup ? "Group" : "Contact"} info">
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

        const backBtn   = container.querySelector(".back-button");
        const moreBtn   = container.querySelector(".more-options");
        const dropdown  = container.querySelector(".dropdown-menu");
        const wrapper   = container.querySelector(".dropdown-wrapper");
        const input     = document.getElementById('chat-input-div');

        // TOGGLE (NO FLICKER, CLICKS WORK)
        const toggle = (e) => {
            e.stopPropagation();
            e.preventDefault(); // Prevent blur
            const open = dropdown.getAttribute("aria-hidden") === "false";
            dropdown.setAttribute("aria-hidden", String(!open));
            moreBtn.setAttribute("aria-expanded", String(!open));
            dropdown.classList.toggle("show");

            // Keep input focused
            if (input && document.activeElement === input) {
                input.focus();
            }
        };
        moreBtn.addEventListener("click", toggle);
        moreBtn.addEventListener("touchstart", toggle, { passive: false });

        // CLOSE OUTSIDE
        const closeOutside = (e) => {
            if (!wrapper.contains(e.target)) {
                dropdown.setAttribute("aria-hidden", "true");
                moreBtn.setAttribute("aria-expanded", "false");
                dropdown.classList.remove("show");
            }
        };
        document.addEventListener("click", closeOutside);

        // ESC
        const closeEsc = (e) => {
            if (e.key === "Escape") {
                dropdown.setAttribute("aria-hidden", "true");
                moreBtn.setAttribute("aria-expanded", "false");
                dropdown.classList.remove("show");
            }
        };
        document.addEventListener("keydown", closeEsc);

        // MENU ITEMS
        dropdown.querySelectorAll(".dropdown-item").forEach(item => {
            item.addEventListener("click", (e) => {
                e.stopPropagation();
                const action = item.textContent.trim();
                toggle({ stopPropagation: () => {}, preventDefault: () => {} });
                onMore?.({ action, type });
            });
        });

        // BACK BUTTON
        backBtn?.addEventListener("click", () => {
            if (input && document.activeElement === input) {
                input.blur();
            }
            onBack?.();
        });

        // INJECT CSS
        if (!document.getElementById('header-svg-pointer-fix')) {
            const style = document.createElement('style');
            style.id = 'header-svg-pointer-fix';
            style.textContent = `
                .app-chat-header svg { pointer-events: none !important; }
            `;
            document.head.appendChild(style);
        }

        // CLEANUP
        container._headerCleanup = () => {
            document.removeEventListener("click", closeOutside);
            document.removeEventListener("keydown", closeEsc);
            moreBtn?.removeEventListener("click", toggle);
            moreBtn?.removeEventListener("touchstart", toggle);
        };

    } catch (err) {
        console.error("renderHeader error:", err);
    }
}

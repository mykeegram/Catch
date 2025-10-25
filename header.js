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
            onMore,
            menuItems = [
                { label: 'Search', icon: '' },
                { label: 'Mute', icon: '' },
                { label: 'Call', icon: '' },
                { label: 'Video Call', icon: '' },
                { label: 'Select Messages', icon: '' },
                { label: 'Send a Gift', icon: '' },
                { label: 'Block user', icon: '' },
                { label: 'Delete Chat', icon: '', danger: true }
            ],
            onMenuItemClick
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

            <div class="dropdown-wrapper"></div>
        `;

        // ---- EVENT LISTENERS ----
        const backBtn = container.querySelector(".back-button");
        backBtn?.addEventListener("click", onBack || (() => {}));

        const moreBtn = container.querySelector(".more-options");
        const dropdownWrapper = container.querySelector(".dropdown-wrapper");

        // ---- CREATE DROPDOWN MENU ----
        const menu = document.createElement('div');
        menu.className = 'dropdown-menu';
        menu.setAttribute('role', 'menu');
        menu.style.display = 'none';

        // Build menu items
        menuItems.forEach((item, index) => {
            const menuItem = document.createElement('button');
            menuItem.className = `dropdown-item ${item.danger ? 'danger' : ''}`;
            menuItem.setAttribute('role', 'menuitem');
            menuItem.innerHTML = `
                <span class="dropdown-icon">${item.icon || ''}</span>
                <span class="dropdown-label">${item.label}</span>
            `;
            
            menuItem.addEventListener('click', (e) => {
                e.stopPropagation();
                if (onMenuItemClick) onMenuItemClick(item, index);
                if (onMore) onMore(item, index);
                closeDropdown();
            });

            menu.appendChild(menuItem);
        });

        dropdownWrapper.appendChild(menu);

        // Toggle dropdown
        function toggleDropdown(e) {
            e.stopPropagation();
            const isVisible = menu.style.display === 'block';
            
            if (isVisible) {
                closeDropdown();
            } else {
                openDropdown();
            }
        }

        function openDropdown() {
            // Close any other open dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(m => {
                if (m !== menu) m.style.display = 'none';
            });
            
            menu.style.display = 'block';
            positionMenu();
        }

        function closeDropdown() {
            menu.style.display = 'none';
        }

        function positionMenu() {
            const rect = moreBtn.getBoundingClientRect();
            const menuRect = menu.getBoundingClientRect();
            
            // Position below trigger, aligned to right
            menu.style.top = `${rect.bottom + 8}px`;
            menu.style.right = `${window.innerWidth - rect.right}px`;
            
            // Adjust if menu goes off screen
            if (rect.bottom + menuRect.height + 8 > window.innerHeight) {
                menu.style.top = `${rect.top - menuRect.height - 8}px`;
            }
        }

        // Attach to trigger button
        moreBtn?.addEventListener('click', toggleDropdown);

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!dropdownWrapper.contains(e.target) && !moreBtn.contains(e.target)) {
                closeDropdown();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeDropdown();
        });

    } catch (error) {
        console.error("Error rendering header:", error);
    }
}

// dropdown.js
export function renderDropdown(container, config) {
    try {
        if (!container) throw new Error("Dropdown container not found");

        const {
            items = [],
            onItemClick,
            triggerButton
        } = config;

        // Create dropdown wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'dropdown-wrapper';

        // Create dropdown menu
        const menu = document.createElement('div');
        menu.className = 'dropdown-menu';
        menu.setAttribute('role', 'menu');
        menu.style.display = 'none';

        // Build menu items
        items.forEach((item, index) => {
            const menuItem = document.createElement('button');
            menuItem.className = `dropdown-item ${item.danger ? 'danger' : ''}`;
            menuItem.setAttribute('role', 'menuitem');
            menuItem.innerHTML = `
                <span class="dropdown-icon">${item.icon || ''}</span>
                <span class="dropdown-label">${item.label}</span>
            `;
            
            menuItem.addEventListener('click', (e) => {
                e.stopPropagation();
                if (onItemClick) onItemClick(item, index);
                closeDropdown();
            });

            menu.appendChild(menuItem);
        });

        wrapper.appendChild(menu);
        container.appendChild(wrapper);

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
            const rect = triggerButton.getBoundingClientRect();
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
        if (triggerButton) {
            triggerButton.addEventListener('click', toggleDropdown);
        }

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target) && !triggerButton.contains(e.target)) {
                closeDropdown();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeDropdown();
        });

        return { close: closeDropdown, open: openDropdown };

    } catch (error) {
        console.error("Error rendering dropdown:", error);
    }
}

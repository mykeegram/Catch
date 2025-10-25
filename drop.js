// drop.js

/**
 * Creates and manages a dropdown menu.
 * @param {HTMLElement} triggerElement - The button or element that opens the dropdown.
 * @param {Array<Object>} items - An array of menu item objects: [{label: 'Text', onClick: function}, ...].
 * @returns {HTMLElement} The complete dropdown container element.
 */
export function createDropdown(triggerElement, items = []) {
    // 1. Create the main container (wrapper)
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'app-dropdown';

    // 2. Create the menu panel (the list of items)
    const menuElement = document.createElement('ul');
    menuElement.className = 'app-dropdown-menu';
    menuElement.setAttribute('role', 'menu');

    // 3. Populate the menu with items
    items.forEach(itemConfig => {
        const listItem = document.createElement('li');
        listItem.className = 'app-dropdown-item';
        listItem.textContent = itemConfig.label;
        listItem.setAttribute('role', 'menuitem');

        listItem.addEventListener('click', (e) => {
            // Execute the item's click handler
            itemConfig.onClick?.(e);
            // Close the dropdown after an item is clicked
            toggleDropdown(false);
        });

        menuElement.appendChild(listItem);
    });

    // 4. Append trigger and menu to the container
    dropdownContainer.appendChild(triggerElement);
    dropdownContainer.appendChild(menuElement);
    
    // --- Dropdown Management Logic ---
    
    // Function to open/close the dropdown
    const toggleDropdown = (forceState) => {
        const isOpen = dropdownContainer.classList.contains('open');
        const nextState = forceState !== undefined ? forceState : !isOpen;

        dropdownContainer.classList.toggle('open', nextState);
        triggerElement.setAttribute('aria-expanded', nextState);
    };

    // Event listener for the trigger element (the 3-dot button)
    triggerElement.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the click from immediately propagating to the document listener
        toggleDropdown();
    });

    // Global listener to close the dropdown when clicking outside
    document.addEventListener('click', (e) => {
        // If the click is outside the dropdown container, close the menu
        if (!dropdownContainer.contains(e.target)) {
            toggleDropdown(false);
        }
    });

    return dropdownContainer;
}


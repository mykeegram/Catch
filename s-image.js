// s-image.js
let viewer = null;

export function openImageViewer({ images, startIndex, senderName }) {
    if (viewer) return; // prevent double-open

    const viewerHTML = `
        <div class="s-image-viewer" id="sImageViewer">
            <div class="s-top-bar">
                <button class="s-btn s-close-btn" id="sCloseBtn">
                    <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <div class="s-header-info">
                    <h1>${escapeHTML(senderName)}</h1>
                    <p id="sTimestamp"></p>
                </div>
                <div class="s-menu-container">
                    <button class="s-btn s-menu-btn" id="sMenuBtn">
                        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                    </button>
                    <div class="s-dropdown-menu" id="sDropdownMenu">
                        <button class="s-menu-item" id="sDownloadBtn"><svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg><span>Download</span></button>
                        <button class="s-menu-item" id="sShareBtn"><svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg><span>Share</span></button>
                        <button class="s-menu-item s-danger" id="sDeleteBtn"><svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg><span>Delete</span></button>
                    </div>
                </div>
            </div>

            <div class="s-image-container">
                <button class="s-nav-btn s-prev" id="sPrevBtn"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
                <div class="s-image-wrapper" id="sImageWrapper">
                    <div class="s-images-slider" id="sImagesSlider"></div>
                </div>
                <button class="s-nav-btn s-next" id="sNextBtn"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
            </div>

            <div class="s-bottom-bar">
                <div class="s-caption" id="sCaption"></div>
                <div class="s-bottom-info"><span id="sPhotoCounter"></span></div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', viewerHTML);
    viewer = document.getElementById('sImageViewer');

    // === State ===
    let currentIndex = startIndex;
    let scale = 1, posX = 0, posY = 0;
    let isDragging = false, isPinching = false, isZooming = false;
    let touchStartX = 0, initialDistance = 0;
    let controlsVisible = true;
    let hideTimeout;

    const slider = document.getElementById('sImagesSlider');
    const wrapper = document.getElementById('sImageWrapper');
    const captionEl = document.getElementById('sCaption');
    const counterEl = document.getElementById('sPhotoCounter');
    const timestampEl = document.getElementById('sTimestamp');

    // === Build Slides ===
    images.forEach(img => {
        const slide = document.createElement('div');
        slide.className = 's-image-slide';
        const image = document.createElement('img');
        image.src = img.url;
        image.alt = img.alt || 'Chat image';
        image.className = 's-main-image';
        slide.appendChild(image);
        slider.appendChild(slide);
    });

    // === Core Functions ===
    function updateDisplay() {
        const img = images[currentIndex];
        captionEl.textContent = img.caption || '';
        timestampEl.textContent = img.time || '';
        counterEl.textContent = `${currentIndex + 1} of ${images.length}`;

        const slideWidth = wrapper.offsetWidth;
        slider.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
        resetZoom();
        showControls();
    }

    function resetZoom() {
        scale = 1; posX = 0; posY = 0;
        const img = getCurrentImage();
        if (img) img.style.transform = `translate(0px, 0px) scale(1)`;
    }

    function getCurrentImage() {
        return slider.querySelectorAll('.s-main-image')[currentIndex];
    }

    function showControls() {
        controlsVisible = true;
        viewer.querySelectorAll('.s-top-bar, .s-bottom-bar, .s-nav-btn').forEach(el => el.style.opacity = '1');
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            if (scale <= 1.01) {
                controlsVisible = false;
                viewer.querySelectorAll('.s-top-bar, .s-bottom-bar').forEach(el => el.style.opacity = '0');
                viewer.querySelectorAll('.s-nav-btn').forEach(el => el.classList.remove('visible'));
            }
        }, 3000);
    }

    function toggleControls() {
        if (scale > 1.01) return;
        if (controlsVisible) {
            clearTimeout(hideTimeout);
            controlsVisible = false;
            viewer.querySelectorAll('.s-top-bar, .s-bottom-bar').forEach(el => el.style.opacity = '0');
        } else {
            showControls();
        }
    }

    // === Navigation ===
    document.getElementById('sPrevBtn').onclick = (e) => { e.stopPropagation(); if (currentIndex > 0) { currentIndex--; updateDisplay(); } };
    document.getElementById('sNextBtn').onclick = (e) => { e.stopPropagation(); if (currentIndex < images.length - 1) { currentIndex++; updateDisplay(); } };

    // === Menu ===
    const menuBtn = document.getElementById('sMenuBtn');
    const menu = document.getElementById('sDropdownMenu');
    menuBtn.onclick = (e) => { e.stopPropagation(); menu.classList.toggle('active'); };
    document.getElementById('sDownloadBtn').onclick = () => { downloadImage(images[currentIndex].url); menu.classList.remove('active'); };
    document.getElementById('sShareBtn').onclick = () => { shareImage(images[currentIndex].url); menu.classList.remove('active'); };
    document.getElementById('sDeleteBtn').onclick = () => { if (confirm('Delete this image?')) { alert('Deleted'); closeViewer(); } };

    // === Close ===
    document.getElementById('sCloseBtn').onclick = closeViewer;
    viewer.addEventListener('click', (e) => {
        if (e.target === viewer && scale <= 1.01) closeViewer();
    });

    function closeViewer() {
        if (!viewer) return;
        viewer.remove();
        viewer = null;
        document.removeEventListener('keydown', handleKey);
    }

    // === Keyboard ===
    function handleKey(e) {
        if (e.key === 'Escape') closeViewer();
        if (e.key === 'ArrowLeft') { if (currentIndex > 0) { currentIndex--; updateDisplay(); } }
        if (e.key === 'ArrowRight') { if (currentIndex < images.length - 1) { currentIndex++; updateDisplay(); } }
    }
    document.addEventListener('keydown', handleKey);

    // === Touch & Zoom (same logic as your sample) ===
    let startX = 0, prevTranslate = 0, currentTranslate = 0;
    let lastScale = 1, lastPosX = 0, lastPosY = 0;

    wrapper.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            isPinching = true;
            initialDistance = getDistance(e.touches);
            lastScale = scale;
            e.preventDefault();
        } else if (e.touches.length === 1) {
            startX = e.touches[0].clientX;
            if (scale === 1) {
                isDragging = true;
                prevTranslate = currentTranslate;
            } else {
                isZooming = true;
                lastPosX = posX;
                lastPosY = posY;
            }
        }
    }, { passive: false });

    wrapper.addEventListener('touchmove', (e) => {
        if (isPinching && e.touches.length === 2) {
            const dist = getDistance(e.touches);
            scale = Math.max(1, Math.min(4, lastScale * (dist / initialDistance)));
            applyTransform();
            e.preventDefault();
        } else if (isZooming && e.touches.length === 1) {
            const dx = e.touches[0].clientX - startX;
            const dy = e.touches[0].clientY - touchStartY;
            posX = lastPosX + dx;
            posY = lastPosY + dy;
            applyTransform();
            e.preventDefault();
        } else if (isDragging) {
            currentTranslate = prevTranslate + (e.touches[0].clientX - startX);
        }
    }, { passive: false });

    wrapper.addEventListener('touchend', () => {
        if (isPinching) { isPinching = false; lastScale = scale; }
        if (isZooming) { isZooming = false; lastPosX = posX; lastPosY = posY; }
        if (isDragging) {
            isDragging = false;
            const moved = currentTranslate - prevTranslate;
            if (Math.abs(moved) > 50) {
                if (moved < 0 && currentIndex < images.length - 1) currentIndex++;
                else if (moved > 0 && currentIndex > 0) currentIndex--;
                updateDisplay();
            } else {
                updateDisplay();
            }
        }
        if (scale <= 1.01) showControls();
    });

    function applyTransform() {
        const img = getCurrentImage();
        if (img) img.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
        if (scale > 1.01) {
            viewer.querySelectorAll('.s-top-bar, .s-bottom-bar').forEach(el => el.style.opacity = '0');
        }
    }

    function getDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.hypot(dx, dy);
    }

    // === Double-tap zoom ===
    let lastTap = 0;
    wrapper.addEventListener('click', (e) => {
        const now = Date.now();
        if (now - lastTap < 300) {
            if (scale === 1) {
                scale = 2.5;
                const rect = wrapper.getBoundingClientRect();
                posX = (rect.width / 2 - (e.clientX - rect.left)) * 1.5;
                posY = (rect.height / 2 - (e.clientY - rect.top)) * 1.5;
            } else {
                resetZoom();
                return;
            }
            lastScale = scale;
            lastPosX = posX;
            lastPosY = posY;
            applyTransform();
        }
        lastTap = now;
        if (scale <= 1.01) toggleControls();
    });

    // === Helper Functions ===
    function downloadImage(url) {
        const a = document.createElement('a');
        a.href = url;
        a.download = url.split('/').pop().split('?')[0];
        a.click();
    }

    function shareImage(url) {
        if (navigator.share) {
            navigator.share({ url });
        } else {
            alert('Share not supported');
        }
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // === Init ===
    updateDisplay();
    showControls();
}

// wave-play.js
function initializeWavePlay() {
    document.querySelectorAll('.audio-message').forEach(audioMessage => {
        const button = audioMessage.querySelector('.play-button');
        const durationElement = audioMessage.querySelector('.audio-duration');
        const waveform = audioMessage.querySelector('.waveform');
        const waveBars = waveform.querySelectorAll('.wave-bar');

        // --- NEW INITIALIZATION LOGIC ---
        // Ensure initial duration is stored and full playback state is set to START.
        if (!durationElement.dataset.initialDuration) {
            const initialDuration = durationElement.textContent;
            durationElement.dataset.initialDuration = initialDuration;
            const totalSeconds = parseDuration(initialDuration);

            // Set the full duration as the starting point (i.e., 0 bars filled)
            if (!button.dataset.currentTime) {
                button.dataset.currentTime = totalSeconds.toString();
            }
            if (!button.dataset.currentBarIndex) {
                button.dataset.currentBarIndex = '0';
            }
        }
        // --- END NEW INITIALIZATION LOGIC ---

        // Play/Pause button click handler
        button.addEventListener('click', function () {
            const isPlaying = this.classList.contains('playing');
            if (isPlaying) {
                pauseAudio(this, durationElement, waveBars);
            } else {
                playAudio(this, durationElement, waveBars);
            }
        });

        // Waveform seeking functionality
        waveform.addEventListener('mousedown', startSeeking);
        waveform.addEventListener('touchstart', startSeeking);

        function startSeeking(event) {
            event.preventDefault(); // Prevent default touch/click behavior
            
            // **FIX 1:** Seeking only updates the UI position. Playback state 
            // is controlled by the explicit play/pause button click.
            
            // Calculate and update seek position
            seekToPosition(event, waveform, button, durationElement, waveBars);

            // Add move and end listeners for dragging
            document.addEventListener('mousemove', handleDragging);
            document.addEventListener('touchmove', handleDragging);
            document.addEventListener('mouseup', stopSeeking);
            document.addEventListener('touchend', stopSeeking);

            function handleDragging(event) {
                seekToPosition(event, waveform, button, durationElement, waveBars);
            }

            function stopSeeking() {
                // Remove move and end listeners
                document.removeEventListener('mousemove', handleDragging);
                document.removeEventListener('touchmove', handleDragging);
                document.removeEventListener('mouseup', stopSeeking);
                document.removeEventListener('touchend', stopSeeking);

                // **FIX 1:** Do NOT resume playback after seeking.
            }
        }
    });
}

function seekToPosition(event, waveform, button, durationElement, waveBars) {
    const rect = waveform.getBoundingClientRect();
    const clientX = event.type.includes('touch') ? event.touches[0].clientX : event.clientX;
    const offsetX = clientX - rect.left; // X position relative to waveform
    const waveformWidth = rect.width;
    const seekPercentage = Math.max(0, Math.min(1, offsetX / waveformWidth)); // Clamp between 0 and 1

    // Calculate new time and bar index
    const initialDuration = durationElement.dataset.initialDuration || durationElement.textContent;
    const totalSeconds = parseDuration(initialDuration);
    
    // Reverse for countdown: newTime is REMAINING time
    const newTime = totalSeconds * (1 - seekPercentage); 
    
    // newBarIndex is the number of bars completed
    const barCount = waveBars.length;
    const newBarIndex = Math.floor(seekPercentage * barCount);

    // Update waveform bars
    waveBars.forEach((bar, index) => {
        bar.style.backgroundColor = index < newBarIndex ? '#006400' : '#8696a0';
    });

    // Update duration display and button state
    durationElement.textContent = formatDuration(newTime);
    button.dataset.currentTime = newTime.toString();
    button.dataset.currentBarIndex = newBarIndex.toString();
}

function playAudio(button, durationElement, waveBars) {
    // Clear any existing interval to prevent glitches
    if (button.dataset.intervalId) {
        clearInterval(button.dataset.intervalId);
    }

    // Set playing state
    button.classList.add('playing');
    button.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
        </svg>
    `;

    // Store initial duration if not already stored
    if (!durationElement.dataset.initialDuration) {
        durationElement.dataset.initialDuration = durationElement.textContent;
    }

    // Parse initial duration
    const initialDuration = durationElement.dataset.initialDuration;
    const totalSeconds = parseDuration(initialDuration);

    // Get or initialize current time and bar index. 
    // **FIX 2:** Removed the '|| totalSeconds' fallback here because we 
    // now initialize currentTime in `initializeWavePlay`. 
    let currentSeconds = parseFloat(button.dataset.currentTime);
    let currentBarIndex = parseInt(button.dataset.currentBarIndex, 10);
    
    // Fallback safety (should rarely hit with the new init logic)
    if (isNaN(currentSeconds) || currentSeconds <= 0) {
        currentSeconds = totalSeconds;
        currentBarIndex = 0;
    }
    
    // Ensure waveform reflects current state (important after seeking)
    waveBars.forEach((bar, index) => {
        bar.style.backgroundColor = index < currentBarIndex ? '#006400' : '#8696a0';
    });

    // Start countdown and bar animation
    const intervalId = setInterval(() => {
        currentSeconds -= 0.1; // Update every 100ms
        if (currentSeconds <= 0) {
            // Playback complete
            clearInterval(intervalId);
            button.classList.remove('playing');
            button.innerHTML = `
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M8 5v14l11-7z"/>
                </svg>
            `;
            durationElement.textContent = initialDuration;
            waveBars.forEach(bar => bar.style.backgroundColor = '#8696a0');
            // Reset state for next play
            button.dataset.currentTime = totalSeconds.toString(); 
            button.dataset.currentBarIndex = '0';
            button.dataset.intervalId = ''; 
            return;
        }

        // Update duration display
        durationElement.textContent = formatDuration(currentSeconds);

        // Update waveform bars
        const elapsedTime = totalSeconds - currentSeconds;
        const barIndexToFill = Math.floor(elapsedTime / totalSeconds * waveBars.length);
        
        // Only update if the progress has advanced to the next bar visually
        if (barIndexToFill > currentBarIndex) {
            for (let i = currentBarIndex; i < barIndexToFill && i < waveBars.length; i++) {
                waveBars[i].style.backgroundColor = '#006400';
            }
            currentBarIndex = barIndexToFill;
        }

        // Store current state
        button.dataset.currentTime = currentSeconds.toString();
        button.dataset.currentBarIndex = currentBarIndex.toString();
    }, 100);
    
    button.dataset.intervalId = intervalId.toString();
}

function pauseAudio(button, durationElement, waveBars) {
    // Clear interval and retain current state
    if (button.dataset.intervalId) {
        clearInterval(button.dataset.intervalId);
        button.dataset.intervalId = ''; // Clear the ID after stopping
    }
    button.classList.remove('playing');
    button.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M8 5v14l11-7z"/>
        </svg>
    `;
}

function parseDuration(durationStr) {
    // Convert "MM:SS" to seconds (e.g., "0:14" -> 14)
    const parts = durationStr.split(':').map(Number);
    return parts[0] * 60 + parts[1];
}

function formatDuration(seconds) {
    // Convert seconds to "M:SS" format
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Initialize when DOM is loaded or new messages are added
document.addEventListener('DOMContentLoaded', initializeWavePlay);

// Export for dynamic addition of messages
export { initializeWavePlay };



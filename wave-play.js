// wave-play.js
function initializeWavePlay() {
    document.querySelectorAll('.play-button').forEach(button => {
        button.addEventListener('click', function() {
            const audioMessage = this.closest('.audio-message');
            const durationElement = audioMessage.querySelector('.audio-duration');
            const waveform = audioMessage.querySelector('.waveform');
            const waveBars = waveform.querySelectorAll('.wave-bar');
            const isPlaying = this.classList.contains('playing');

            if (isPlaying) {
                // Pause the audio
                pauseAudio(this, durationElement, waveBars);
            } else {
                // Play the audio
                playAudio(this, durationElement, waveBars);
            }
        });
    });
}

function playAudio(button, durationElement, waveBars) {
    // Set playing state
    button.classList.add('playing');
    button.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
        </svg>
    `;

    // Parse initial duration (e.g., "0:14" -> 14 seconds)
    const initialDuration = durationElement.textContent;
    const totalSeconds = parseDuration(initialDuration);
    
    // Determine if fast animation is needed (for durations 0:01 to 0:09)
    const isFast = totalSeconds <= 9;
    const animationSpeed = isFast ? 0.5 : 1; // Fast: 0.5x normal speed, Normal: 1x speed

    // Calculate interval for updating each bar (total duration / number of bars)
    const barCount = waveBars.length; // 28 bars
    const intervalMs = (totalSeconds * 1000) / barCount * animationSpeed;

    // Get or initialize current time and bar index from data attributes
    let currentSeconds = parseFloat(button.dataset.currentTime || totalSeconds);
    let currentBarIndex = parseInt(button.dataset.currentBarIndex || 0, 10);

    // Clear any existing interval
    if (button.dataset.intervalId) {
        clearInterval(button.dataset.intervalId);
    }

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
            waveBars.forEach(bar => bar.style.backgroundColor = '#8696a0'); // Reset to default color
            button.dataset.currentTime = totalSeconds;
            button.dataset.currentBarIndex = 0;
            return;
        }

        // Update duration display
        durationElement.textContent = formatDuration(currentSeconds);

        // Update waveform bars
        const barIndexToFill = Math.floor((totalSeconds - currentSeconds) / totalSeconds * barCount);
        if (barIndexToFill > currentBarIndex) {
            for (let i = currentBarIndex; i < barIndexToFill && i < barCount; i++) {
                waveBars[i].style.backgroundColor = '#006400'; // Deep green
            }
            currentBarIndex = barIndexToFill;
        }

        // Store current state
        button.dataset.currentTime = currentSeconds;
        button.dataset.currentBarIndex = currentBarIndex;
        button.dataset.intervalId = intervalId;
    }, 100); // Update every 100ms
}

function pauseAudio(button, durationElement, waveBars) {
    // Clear interval and retain current state
    clearInterval(button.dataset.intervalId);
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
    // Convert seconds to "MM:SS" format
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Initialize when DOM is loaded or new messages are added
document.addEventListener('DOMContentLoaded', initializeWavePlay);

// Export for dynamic addition of messages
export { initializeWavePlay };

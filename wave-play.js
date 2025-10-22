// wave-play.js
function initializeWavePlay() {
    document.querySelectorAll('.audio-message').forEach(audioMessage => {
        const button = audioMessage.querySelector('.play-button');
        const durationElement = audioMessage.querySelector('.audio-duration');
        const waveform = audioMessage.querySelector('.waveform');
        const waveBars = waveform.querySelectorAll('.wave-bar');
        let isSeeking = false; // Lock to prevent overlapping events

        // Play/Pause button click handler
        button.addEventListener('click', function () {
            if (isSeeking) return; // Prevent clicks during seeking
            const isPlaying = this.classList.contains('playing');
            console.log(`Play button clicked: isPlaying=${isPlaying}, currentTime=${button.dataset.currentTime}`);
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
            event.preventDefault();
            isSeeking = true; // Set lock
            const wasPlaying = button.classList.contains('playing');
            console.log(`Seeking started: wasPlaying=${wasPlaying}, currentTime=${button.dataset.currentTime}`);

            // Pause audio during seeking
            if (wasPlaying) {
                pauseAudio(button, durationElement, waveBars);
            }

            // Update seek position
            seekToPosition(event, waveform, button, durationElement, waveBars);

            // Add move and end listeners
            document.addEventListener('mousemove', handleDragging);
            document.addEventListener('touchmove', handleDragging);
            document.addEventListener('mouseup', stopSeeking);
            document.addEventListener('touchend', stopSeeking);

            function handleDragging(event) {
                seekToPosition(event, waveform, button, durationElement, waveBars);
            }

            function stopSeeking() {
                console.log(`Seeking stopped: currentTime=${button.dataset.currentTime}`);
                // Remove listeners
                document.removeEventListener('mousemove', handleDragging);
                document.removeEventListener('touchmove', handleDragging);
                document.removeEventListener('mouseup', stopSeeking);
                document.removeEventListener('touchend', stopSeeking);

                // Resume playback if it was playing
                if (wasPlaying) {
                    playAudio(button, durationElement, waveBars);
                }
                isSeeking = false; // Release lock
            }
        }
    });
}

function seekToPosition(event, waveform, button, durationElement, waveBars) {
    const rect = waveform.getBoundingClientRect();
    const clientX = event.type.includes('touch') ? event.touches[0].clientX : event.clientX;
    const offsetX = clientX - rect.left;
    const waveformWidth = rect.width;
    const seekPercentage = Math.max(0, Math.min(1, offsetX / waveformWidth));

    // Get total duration
    const initialDuration = durationElement.dataset.initialDuration || durationElement.textContent;
    const totalSeconds = parseDuration(initialDuration);
    const newTime = totalSeconds * (1 - seekPercentage); // Reverse for countdown
    const barCount = waveBars.length;
    const newBarIndex = Math.floor(seekPercentage * barCount);

    // Update waveform bars
    waveBars.forEach((bar, index) => {
        bar.style.backgroundColor = index < newBarIndex ? '#006400' : '#8696a0';
    });

    // Update state
    durationElement.textContent = formatDuration(newTime);
    button.dataset.currentTime = newTime.toFixed(2); // Store with 2 decimal places
    button.dataset.currentBarIndex = newBarIndex.toString();
    console.log(`Seeked to: time=${newTime.toFixed(2)}, barIndex=${newBarIndex}`);
}

function playAudio(button, durationElement, waveBars) {
    // Clear any existing interval
    if (button.dataset.intervalId) {
        clearInterval(parseInt(button.dataset.intervalId));
        button.dataset.intervalId = '';
    }

    // Set playing state
    button.classList.add('playing');
    button.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
        </svg>
    `;

    // Store initial duration if not set
    if (!durationElement.dataset.initialDuration) {
        durationElement.dataset.initialDuration = durationElement.textContent;
    }

    // Parse durations
    const initialDuration = durationElement.dataset.initialDuration;
    const totalSeconds = parseDuration(initialDuration);
    let currentSeconds = parseFloat(button.dataset.currentTime) || totalSeconds;
    let currentBarIndex = parseInt(button.dataset.currentBarIndex, 10) || 0;

    // Validate currentSeconds
    if (isNaN(currentSeconds) || currentSeconds > totalSeconds) {
        currentSeconds = totalSeconds;
        currentBarIndex = 0;
        button.dataset.currentTime = totalSeconds.toFixed(2);
        button.dataset.currentBarIndex = '0';
    }

    // Initialize waveform
    waveBars.forEach((bar, index) => {
        bar.style.backgroundColor = index < currentBarIndex ? '#006400' : '#8696a0';
    });

    // Animation settings
    const isFast = totalSeconds <= 9;
    const animationSpeed = isFast ? 0.5 : 1;
    const barCount = waveBars.length;
    const intervalMs = (totalSeconds * 1000) / barCount * animationSpeed;

    console.log(`Play started: currentTime=${currentSeconds}, currentBarIndex=${currentBarIndex}`);

    // Start playback
    const intervalId = setInterval(() => {
        currentSeconds -= 0.1;
        if (currentSeconds <= 0) {
            // Playback complete
            clearInterval(intervalId);
            button.dataset.intervalId = '';
            button.classList.remove('playing');
            button.innerHTML = `
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M8 5v14l11-7z"/>
                </svg>
            `;
            durationElement.textContent = initialDuration;
            waveBars.forEach(bar => bar.style.backgroundColor = '#8696a0');
            button.dataset.currentTime = totalSeconds.toFixed(2);
            button.dataset.currentBarIndex = '0';
            console.log('Playback completed');
            return;
        }

        // Update duration and waveform
        durationElement.textContent = formatDuration(currentSeconds);
        const barIndexToFill = Math.floor((totalSeconds - currentSeconds) / totalSeconds * barCount);
        if (barIndexToFill > currentBarIndex) {
            for (let i = currentBarIndex; i < barIndexToFill && i < barCount; i++) {
                waveBars[i].style.backgroundColor = '#006400';
            }
            currentBarIndex = barIndexToFill;
        }

        // Update state
        button.dataset.currentTime = currentSeconds.toFixed(2);
        button.dataset.currentBarIndex = currentBarIndex.toString();
        button.dataset.intervalId = intervalId.toString();
    }, 100);
}

function pauseAudio(button, durationElement, waveBars) {
    if (button.dataset.intervalId) {
        clearInterval(parseInt(button.dataset.intervalId));
        button.dataset.intervalId = '';
    }
    button.classList.remove('playing');
    button.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M8 5v14l11-7z"/>
        </svg>
    `;
    console.log(`Paused: currentTime=${button.dataset.currentTime}`);
}

function parseDuration(durationStr) {
    const parts = durationStr.split(':').map(Number);
    return parts[0] * 60 + parts[1];
}

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeWavePlay);

// Export for dynamic addition
export { initializeWavePlay };

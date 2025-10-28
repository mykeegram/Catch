// wave-play.js
async function initializeWavePlay() {
    const audioMessages = document.querySelectorAll('.audio-message');
    for (const audioMessage of audioMessages) {
        const button = audioMessage.querySelector('.play-button');
        const durationElement = audioMessage.querySelector('.audio-duration');
        const waveform = audioMessage.querySelector('.waveform');
        const audioSrc = audioMessage.dataset.audioSrc; // Assume audio URL is stored in data-audio-src

        // Generate waveform if not already populated
        if (!waveform.querySelector('.wave-bar')) {
            await generateWaveform(waveform, audioSrc, durationElement);
        }

        const waveBars = waveform.querySelectorAll('.wave-bar');

        // Initialize duration and playback state
        if (!durationElement.dataset.initialDuration) {
            const initialDuration = durationElement.textContent;
            durationElement.dataset.initialDuration = initialDuration;
            const totalSeconds = parseDuration(initialDuration);
            if (!button.dataset.currentTime) {
                button.dataset.currentTime = totalSeconds.toString();
            }
            if (!button.dataset.currentBarIndex) {
                button.dataset.currentBarIndex = '0';
            }
        }

        // Play/Pause button click handler
        button.addEventListener('click', function () {
            const isPlaying = this.classList.contains('playing');
            if (isPlaying) {
                pauseAudio(this, durationElement, waveBars);
            } else {
                playAudio(this, durationElement, waveBars, audioSrc);
            }
        });

        // Waveform seeking functionality
        waveform.addEventListener('mousedown', startSeeking);
        waveform.addEventListener('touchstart', startSeeking);

        function startSeeking(event) {
            event.preventDefault();
            seekToPosition(event, waveform, button, durationElement, waveBars);

            document.addEventListener('mousemove', handleDragging);
            document.addEventListener('touchmove', handleDragging);
            document.addEventListener('mouseup', stopSeeking);
            document.addEventListener('touchend', stopSeeking);

            function handleDragging(event) {
                seekToPosition(event, waveform, button, durationElement, waveBars);
            }

            function stopSeeking() {
                document.removeEventListener('mousemove', handleDragging);
                document.removeEventListener('touchmove', handleDragging);
                document.removeEventListener('mouseup', stopSeeking);
                document.removeEventListener('touchend', stopSeeking);
            }
        }
    }
}

async function generateWaveform(waveformElement, audioSrc, durationElement) {
    try {
        // Fetch and decode audio
        const response = await fetch(audioSrc);
        const arrayBuffer = await response.arrayBuffer();
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // Get raw audio data
        const channelData = audioBuffer.getChannelData(0); // Use first channel
        const duration = audioBuffer.duration;
        const sampleRate = audioBuffer.sampleRate;
        const totalSamples = channelData.length;

        // Update duration if not set
        if (!durationElement.dataset.initialDuration) {
            durationElement.textContent = formatDuration(duration);
            durationElement.dataset.initialDuration = durationElement.textContent;
        }

        // Calculate number of bars (e.g., 50 bars for simplicity)
        const numBars = 50;
        const samplesPerBar = Math.floor(totalSamples / numBars);
        const barWidths = waveformElement.offsetWidth / numBars;

        // Analyze amplitude for each bar
        const amplitudes = [];
        for (let i = 0; i < numBars; i++) {
            const startSample = i * samplesPerBar;
            const endSample = Math.min(startSample + samplesPerBar, totalSamples);
            let sum = 0;
            for (let j = startSample; j < endSample; j++) {
                sum += Math.abs(channelData[j]); // Use absolute value for amplitude
            }
            const avgAmplitude = sum / (endSample - startSample);
            amplitudes.push(avgAmplitude);
        }

        // Normalize amplitudes to a max height (e.g., 50px)
        const maxAmplitude = Math.max(...amplitudes);
        const maxBarHeight = 50; // Maximum height in pixels
        const normalizedAmplitudes = amplitudes.map(amp => (amp / maxAmplitude) * maxBarHeight || 2); // Minimum height of 2px

        // Clear existing waveform
        waveformElement.innerHTML = '';

        // Create waveform bars
        normalizedAmplitudes.forEach(amplitude => {
            const bar = document.createElement('div');
            bar.className = 'wave-bar';
            bar.style.width = `${barWidths}px`;
            bar.style.height = `${amplitude}px`;
            bar.style.backgroundColor = '#8696a0'; // Default color
            bar.style.display = 'inline-block';
            bar.style.marginRight = '1px';
            waveformElement.appendChild(bar);
        });

        audioContext.close(); // Clean up
    } catch (error) {
        console.error('Error generating waveform:', error);
        // Fallback: Create uniform bars
        const numBars = 50;
        const barWidths = waveformElement.offsetWidth / numBars;
        for (let i = 0; i < numBars; i++) {
            const bar = document.createElement('div');
            bar.className = 'wave-bar';
            bar.style.width = `${barWidths}px`;
            bar.style.height = '20px'; // Default height
            bar.style.backgroundColor = '#8696a0';
            bar.style.display = 'inline-block';
            bar.style.marginRight = '1px';
            waveformElement.appendChild(bar);
        }
    }
}

function seekToPosition(event, waveform, button, durationElement, waveBars) {
    const rect = waveform.getBoundingClientRect();
    const clientX = event.type.includes('touch') ? event.touches[0].clientX : event.clientX;
    const offsetX = clientX - rect.left;
    const waveformWidth = rect.width;
    const seekPercentage = Math.max(0, Math.min(1, offsetX / waveformWidth));

    const initialDuration = durationElement.dataset.initialDuration || durationElement.textContent;
    const totalSeconds = parseDuration(initialDuration);
    const newTime = totalSeconds * (1 - seekPercentage);
    const barCount = waveBars.length;
    const newBarIndex = Math.floor(seekPercentage * barCount);

    waveBars.forEach((bar, index) => {
        bar.style.backgroundColor = index < newBarIndex ? '#006400' : '#8696a0';
    });

    durationElement.textContent = formatDuration(newTime);
    button.dataset.currentTime = newTime.toString();
    button.dataset.currentBarIndex = newBarIndex.toString();
}

function playAudio(button, durationElement, waveBars, audioSrc) {
    // Clear existing interval
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

    // Initialize audio element if not already present
    let audio = button.dataset.audioElement ? document.getElementById(button.dataset.audioElement) : null;
    if (!audio) {
        audio = new Audio(audioSrc);
        audio.id = `audio-${Math.random().toString(36).substr(2, 9)}`;
        button.dataset.audioElement = audio.id;
        document.body.appendChild(audio); // Append to DOM
    }

    // Store initial duration
    if (!durationElement.dataset.initialDuration) {
        durationElement.dataset.initialDuration = durationElement.textContent;
    }

    const initialDuration = durationElement.dataset.initialDuration;
    const totalSeconds = parseDuration(initialDuration);
    let currentSeconds = parseFloat(button.dataset.currentTime);
    let currentBarIndex = parseInt(button.dataset.currentBarIndex, 10);

    if (isNaN(currentSeconds) || currentSeconds <= 0) {
        currentSeconds = totalSeconds;
        currentBarIndex = 0;
    }

    // Set audio current time
    audio.currentTime = totalSeconds - currentSeconds;

    // Update waveform
    waveBars.forEach((bar, index) => {
        bar.style.backgroundColor = index < currentBarIndex ? '#006400' : '#8696a0';
    });

    // Play audio
    audio.play().catch(error => console.error('Audio playback error:', error));

    // Start countdown and bar animation
    const intervalId = setInterval(() => {
        currentSeconds -= 0.1;
        audio.currentTime = totalSeconds - currentSeconds;

        if (currentSeconds <= 0) {
            clearInterval(intervalId);
            audio.pause();
            button.classList.remove('playing');
            button.innerHTML = `
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M8 5v14l11-7z"/>
                </svg>
            `;
            durationElement.textContent = initialDuration;
            waveBars.forEach(bar => bar.style.backgroundColor = '#8696a0');
            button.dataset.currentTime = totalSeconds.toString();
            button.dataset.currentBarIndex = '0';
            button.dataset.intervalId = '';
            return;
        }

        durationElement.textContent = formatDuration(currentSeconds);
        const elapsedTime = totalSeconds - currentSeconds;
        const barIndexToFill = Math.floor(elapsedTime / totalSeconds * waveBars.length);

        if (barIndexToFill > currentBarIndex) {
            for (let i = currentBarIndex; i < barIndexToFill && i < waveBars.length; i++) {
                waveBars[i].style.backgroundColor = '#006400';
            }
            currentBarIndex = barIndexToFill;
        }

        button.dataset.currentTime = currentSeconds.toString();
        button.dataset.currentBarIndex = currentBarIndex.toString();
    }, 100);

    button.dataset.intervalId = intervalId.toString();

    // Handle audio end
    audio.onended = () => {
        clearInterval(intervalId);
        button.classList.remove('playing');
        button.innerHTML = `
            <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M8 5v14l11-7z"/>
            </svg>
        `;
        durationElement.textContent = initialDuration;
        waveBars.forEach(bar => bar.style.backgroundColor = '#8696a0');
        button.dataset.currentTime = totalSeconds.toString();
        button.dataset.currentBarIndex = '0';
        button.dataset.intervalId = '';
    };
}

function pauseAudio(button, durationElement, waveBars) {
    if (button.dataset.intervalId) {
        clearInterval(button.dataset.intervalId);
        button.dataset.intervalId = '';
    }
    const audio = button.dataset.audioElement ? document.getElementById(button.dataset.audioElement) : null;
    if (audio) {
        audio.pause();
    }
    button.classList.remove('playing');
    button.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M8 5v14l11-7z"/>
        </svg>
    `;
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

// Initialize when DOM is loaded or new messages are added
document.addEventListener('DOMContentLoaded', initializeWavePlay);

// Export for dynamic addition of messages
export { initializeWavePlay };

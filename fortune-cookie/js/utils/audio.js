// 사운드 효과 및 Web Audio API 합성기 유틸리티 모듈

let audioMuted = false;

export function toggleAudioMute(buttonElement) {
    audioMuted = !audioMuted;
    if (buttonElement) {
        if (audioMuted) {
            buttonElement.classList.add('muted');
            buttonElement.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        } else {
            buttonElement.classList.remove('muted');
            buttonElement.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        }
    }
    return audioMuted;
}

export function isMuted() {
    return audioMuted;
}

export function playCrackSound() {
    if (audioMuted) return;

    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        
        const audioCtx = new AudioContext();
        
        // 1. Crisp Crack / Snapping (High frequency white noise burst)
        const bufferSize = audioCtx.sampleRate * 0.15; // 0.15초 duration
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const noiseFilter = audioCtx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
        noiseFilter.Q.setValueAtTime(4, audioCtx.currentTime);

        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);

        whiteNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);

        // 2. Deep Break Pop (Low frequency oscillator drop)
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);

        oscGain.gain.setValueAtTime(0.6, audioCtx.currentTime);
        oscGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

        osc.connect(oscGain);
        oscGain.connect(audioCtx.destination);

        // 재생 시작
        whiteNoise.start();
        osc.start();

        // 자동 종료 & cleanup
        whiteNoise.stop(audioCtx.currentTime + 0.2);
        osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) {
        console.warn('Audio Context 재생 실패:', e);
    }
}

// js/sound.js
let voiceEnabled = true;
let currentPhase = 0;
let selectedVoice = null;
let isInitialized = false;

function isHomePage() {
    const path = window.location.pathname;
    return path === '/' || path === '' || path.includes('index.html') || path.endsWith('/');
}

const phaseVoiceTexts = {
    0: "Phase 1. Origins. 3000 BCE. Circular ditch and bank. Wooden posts. No stones yet.",
    1: "Phase 2. First Stones. 2500 BCE. Small bluestones arrive from Wales. First stone circle.",
    2: "Phase 3. Great Monument. 2200 BCE. Massive sarsen stones with trilithons. Iconic Stonehenge.",
    3: "Phase 4. Modifications. 1500 BCE. Reorganization of stones and Avenue construction.",
    4: "Phase 5. Present Day. UNESCO World Heritage site. Millions of visitors annually."
};

function getBestVoice() {
    return new Promise((resolve) => {
        const voices = window.speechSynthesis.getVoices();
        const preferred = ['Google UK English Female', 'Google US English Female', 'Samantha'];
        for (const p of preferred) {
            const voice = voices.find(v => v.name === p);
            if (voice) {
                resolve(voice);
                return;
            }
        }
        resolve(voices.find(v => v.lang.startsWith('en')) || voices[0]);
    });
}

export function initVoiceover() {
    if (isHomePage()) {
        console.log('Homepage - voiceover disabled');
        return;
    }
    
    if (isInitialized) return;
    isInitialized = true;
    
    console.log('Phase page - initializing voiceover');
    
    window.speechSynthesis.getVoices();
    if (window.speechSynthesis.onvoiceschanged) {
        window.speechSynthesis.onvoiceschanged = () => getBestVoice().then(v => selectedVoice = v);
    } else {
        getBestVoice().then(v => selectedVoice = v);
    }
    
    // Remove existing button
    const existingBtn = document.getElementById('speakerBtn');
    if (existingBtn) existingBtn.remove();
    
    // Create container
    let container = document.querySelector('.voice-button-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'voice-button-container';
        container.style.position = 'absolute';
        container.style.top = '20px';
        container.style.right = '100px';
        container.style.zIndex = '100';
        document.body.appendChild(container);
    }
    
    const btn = document.createElement('button');
    btn.id = 'speakerBtn';
    btn.innerHTML = '🔊 Voice';
    btn.style.padding = '6px 12px';
    btn.style.fontSize = '11px';
    btn.style.fontWeight = 'bold';
    btn.style.cursor = 'pointer';
    btn.style.background = '#4a6a3a';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '20px';
    btn.style.height = '28px';
    container.appendChild(btn);
    
    btn.onclick = (e) => {
        e.stopPropagation();
        voiceEnabled = !voiceEnabled;
        if (voiceEnabled) {
            btn.innerHTML = '🔊 Voice';
            btn.style.background = '#4a6a3a';
            if (currentPhase !== undefined) speakPhase(currentPhase);
        } else {
            btn.innerHTML = '🔇 Mute';
            btn.style.background = '#aa3333';
            window.speechSynthesis.cancel();
        }
    };
}

export function speakPhase(phaseIndex) {
    if (isHomePage()) return;
    if (!voiceEnabled) return;
    
    currentPhase = phaseIndex;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(phaseVoiceTexts[phaseIndex]);
    utterance.rate = 0.9;
    
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    } else {
        getBestVoice().then(voice => {
            utterance.voice = voice;
            window.speechSynthesis.speak(utterance);
        });
        return;
    }
    window.speechSynthesis.speak(utterance);
}

export function updateCurrentPhase(phaseIndex) {
    if (isHomePage()) return;
    currentPhase = phaseIndex;
    speakPhase(phaseIndex);
}

export function killVoice() {
    window.speechSynthesis.cancel();
    voiceEnabled = false;
}

export function reviveVoice() {
    voiceEnabled = true;
}

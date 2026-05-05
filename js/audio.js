// ===== AUDIO FILES =====
const audioFiles = {
    0: './audio/phase1.mp3', 
    1: './audio/phase2.mp3',
    2: './audio/phase3.mp3',
    3: './audio/phase4.mp3',
    4: './audio/phase5.mp3'
};

export function initAudio(phaseIndex) {
    const audioUrl = audioFiles[phaseIndex];
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    
    // Create a sleek floating play button
    const btn = document.createElement('button');
    btn.innerHTML = '🔊 Play Narration';
    btn.style.position = 'absolute';
    btn.style.top = '50px'; 
    btn.style.left = '10px';
    btn.style.padding = '10px 5px';
    btn.style.background = 'rgba(26, 26, 26, 0.6)'; 
    btn.style.color = '#ffffff';
    btn.style.border = '1px solid #d4af37'; // Royal Gold border
    btn.style.borderRadius = '30px';
    btn.style.fontFamily = 'sans-serif';
    btn.style.fontWeight = 'bold';
    btn.style.cursor = 'pointer';
    btn.style.zIndex = '999'; 
    btn.style.backdropFilter = 'blur(8px)'; // Modern glass effect

    document.body.appendChild(btn);

    let isPlaying = false;
    
    btn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            btn.innerHTML = '🔊 Play Narration';
        } else {
            audio.play();
            btn.innerHTML = '⏸️ Pause Narration';
        }
        isPlaying = !isPlaying;
    });

    // Reset the button when the audio naturally finishes
    audio.addEventListener('ended', () => {
        isPlaying = false;
        btn.innerHTML = '🔊 Play Narration';
    });
}

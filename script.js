/**
 * Shivaay's 1st Birthday — Bespoke Digital Invitation
 * Performance-optimized, mobile-first, zero-dependency script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Public URL Setup (Production-safe, uses deployed origin + pathname)
  function getCleanPublicUrl() {
    try {
      if (window.location.origin && window.location.origin !== 'null' && !window.location.origin.startsWith('file:')) {
        return window.location.origin + window.location.pathname;
      }
    } catch (e) {
      // fallback
    }
    return window.location.href.split('#')[0].split('?')[0];
  }

  const currentUrl = getCleanPublicUrl();
  const ogUrlTag = document.querySelector('meta[property="og:url"]');
  const canonicalTag = document.querySelector('link[rel="canonical"]');
  if (ogUrlTag) ogUrlTag.setAttribute('content', currentUrl);
  if (canonicalTag) canonicalTag.setAttribute('href', currentUrl);

  // 2. Countdown Timer
  // Event Date: 26 September 2026, 7:00 PM IST (UTC+5:30)
  const eventDate = new Date('2026-09-26T19:00:00+05:30').getTime();

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');
  const cdGrid = document.getElementById('countdown-grid');
  const cdCompleted = document.getElementById('countdown-completed');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance <= 0) {
      if (cdGrid) cdGrid.style.display = 'none';
      if (cdCompleted) cdCompleted.classList.add('active');
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 3. Audio Synth & Chime System (Gentle Magical Music Box)
  let audioCtx = null;
  let isPlayingMusic = false;
  let musicTimer = null;
  const audioBtn = document.getElementById('audio-toggle');

  // Lullaby melody note frequencies (Gentle soothing chime sequence)
  const melodyNotes = [
    { freq: 523.25, dur: 0.6 }, // C5
    { freq: 523.25, dur: 0.6 }, // C5
    { freq: 783.99, dur: 0.6 }, // G5
    { freq: 783.99, dur: 0.6 }, // G5
    { freq: 880.00, dur: 0.6 }, // A5
    { freq: 880.00, dur: 0.6 }, // A5
    { freq: 783.99, dur: 1.2 }, // G5
    { freq: 698.46, dur: 0.6 }, // F5
    { freq: 698.46, dur: 0.6 }, // F5
    { freq: 659.25, dur: 0.6 }, // E5
    { freq: 659.25, dur: 0.6 }, // E5
    { freq: 587.33, dur: 0.6 }, // D5
    { freq: 587.33, dur: 0.6 }, // D5
    { freq: 523.25, dur: 1.4 }, // C5
  ];

  let currentNoteIdx = 0;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playChime(frequency, duration = 0.8, gainVal = 0.08) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      const now = audioCtx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);

      gainNode.gain.setValueAtTime(gainVal, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.warn('Audio note play error:', e);
    }
  }

  function playRoyalFanfare() {
    initAudio();
    if (!audioCtx) return;
    const fanfare = [523.25, 659.25, 783.99, 1046.50];
    fanfare.forEach((f, idx) => {
      setTimeout(() => {
        playChime(f, 1.2, 0.09);
      }, idx * 120);
    });
  }

  function stepMelody() {
    if (!isPlayingMusic || !audioCtx) return;
    const note = melodyNotes[currentNoteIdx];
    playChime(note.freq, note.dur * 1.5, 0.05);

    // Warm soft sub-harmonic accompaniment
    if (currentNoteIdx % 2 === 0) {
      playChime(note.freq / 2, note.dur * 1.8, 0.025);
    }

    currentNoteIdx = (currentNoteIdx + 1) % melodyNotes.length;
    const nextInterval = note.dur * 1000;
    musicTimer = setTimeout(stepMelody, nextInterval);
  }

  function toggleMusic() {
    initAudio();
    if (isPlayingMusic) {
      isPlayingMusic = false;
      clearTimeout(musicTimer);
      if (audioBtn) {
        audioBtn.classList.remove('playing');
        audioBtn.setAttribute('title', 'Play Background Music');
        audioBtn.setAttribute('aria-label', 'Play Background Music');
      }
    } else {
      isPlayingMusic = true;
      if (audioBtn) {
        audioBtn.classList.add('playing');
        audioBtn.setAttribute('title', 'Pause Background Music');
        audioBtn.setAttribute('aria-label', 'Pause Background Music');
      }
      stepMelody();
    }
  }

  if (audioBtn) {
    audioBtn.addEventListener('click', toggleMusic);
  }

  // 4. Opening Screen Reveal Interaction & Luxury Balloon Animation
  const openBtn = document.getElementById('open-invitation-btn');
  const openingOverlay = document.getElementById('opening-overlay');
  const mainInvitation = document.getElementById('main-invitation');

  function createLuxuryBalloonSvg(themeKey, uid) {
    const themes = {
      warmBrown: {
        gradStart: '#DFB89A',
        gradMid1: '#B38059',
        gradMid2: '#8D5B3A',
        gradEnd: '#5C3A21',
        knot: '#4A2E18',
        string: 'rgba(92, 58, 33, 0.45)'
      },
      chocolateBrown: {
        gradStart: '#B58D73',
        gradMid1: '#845434',
        gradMid2: '#573319',
        gradEnd: '#381F0E',
        knot: '#2E170A',
        string: 'rgba(56, 31, 14, 0.45)'
      },
      champagneGold: {
        gradStart: '#FFF6DC',
        gradMid1: '#E8CC7C',
        gradMid2: '#D4AF37',
        gradEnd: '#9E7416',
        knot: '#8C6A15',
        string: 'rgba(158, 116, 22, 0.45)'
      },
      cream: {
        gradStart: '#FFFFFF',
        gradMid1: '#FAF7F2',
        gradMid2: '#EFE5D8',
        gradEnd: '#D5C3AF',
        knot: '#B5A08C',
        string: 'rgba(141, 91, 58, 0.35)'
      },
      softPeach: {
        gradStart: '#FFE9DC',
        gradMid1: '#FFC8AE',
        gradMid2: '#F4A27E',
        gradEnd: '#D6724A',
        knot: '#B8552E',
        string: 'rgba(214, 114, 74, 0.45)'
      },
      subtleBeige: {
        gradStart: '#FAF4ED',
        gradMid1: '#EADBCC',
        gradMid2: '#D0BAA4',
        gradEnd: '#AC947D',
        knot: '#917963',
        string: 'rgba(141, 91, 58, 0.35)'
      }
    };

    const t = themes[themeKey] || themes.warmBrown;
    const gradId = `balloonGrad_${uid}`;

    return `
      <svg class="balloon-svg-wrap" viewBox="0 0 64 160" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="${gradId}" cx="36%" cy="30%" r="62%">
            <stop offset="0%" stop-color="${t.gradStart}" stop-opacity="0.95" />
            <stop offset="28%" stop-color="${t.gradMid1}" />
            <stop offset="72%" stop-color="${t.gradMid2}" />
            <stop offset="100%" stop-color="${t.gradEnd}" />
          </radialGradient>
        </defs>
        <!-- Balloon Body with tapered bottom -->
        <path d="M 32 4 C 50 4, 62 20, 62 45 C 62 68, 45 84, 34 88 L 34 90 L 30 90 L 30 88 C 19 84, 2 68, 2 45 C 2 20, 14 4, 32 4 Z" 
              fill="url(#${gradId})" />
        
        <!-- Primary Glossy Highlight Reflection -->
        <ellipse cx="20" cy="25" rx="7.5" ry="14" transform="rotate(-26 20 25)" fill="#FFFFFF" opacity="0.4" />
        <circle cx="28" cy="15" r="3" fill="#FFFFFF" opacity="0.45" />

        <!-- Soft Rim Highlight along Curve -->
        <path d="M 52 28 C 58 40, 56 60, 46 74" fill="none" stroke="#FFFFFF" stroke-width="1.2" opacity="0.22" stroke-linecap="round"/>

        <!-- Balloon Knot -->
        <polygon points="28,89 36,89 39,96 25,96" fill="${t.knot}" />

        <!-- Thin Elegant Ribbon / String -->
        <path d="M 32,96 Q 22,118 36,138 T 26,160" fill="none" stroke="${t.string}" stroke-width="1.1" stroke-linecap="round"/>
      </svg>
    `;
  }

  function triggerBalloonReveal() {
    const balloonContainer = document.getElementById('balloon-layer');
    if (!balloonContainer) return;

    // Respect reduced motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    balloonContainer.innerHTML = '';

    const balloonList = [
      { left: 5,  size: 66, delay: 0.0,  duration: 2.65, sway: 'balloon-sway-1', theme: 'softPeach' },
      { left: 14, size: 82, delay: 0.12, duration: 2.9,  sway: 'balloon-sway-2', theme: 'champagneGold' },
      { left: 24, size: 70, delay: 0.05, duration: 2.5,  sway: 'balloon-sway-3', theme: 'warmBrown' },
      { left: 34, size: 86, delay: 0.18, duration: 2.95, sway: 'balloon-sway-1', theme: 'chocolateBrown' },
      { left: 45, size: 68, delay: 0.08, duration: 2.6,  sway: 'balloon-sway-2', theme: 'cream' },
      { left: 55, size: 80, delay: 0.22, duration: 2.85, sway: 'balloon-sway-3', theme: 'champagneGold' },
      { left: 64, size: 64, delay: 0.04, duration: 2.55, sway: 'balloon-sway-1', theme: 'subtleBeige' },
      { left: 74, size: 84, delay: 0.15, duration: 2.8,  sway: 'balloon-sway-2', theme: 'warmBrown' },
      { left: 83, size: 72, delay: 0.10, duration: 2.6,  sway: 'balloon-sway-3', theme: 'softPeach' },
      { left: 92, size: 76, delay: 0.20, duration: 2.9,  sway: 'balloon-sway-1', theme: 'cream' }
    ];

    balloonList.forEach((b, idx) => {
      const item = document.createElement('div');
      item.className = `luxury-balloon-item ${b.sway}`;
      item.style.left = `${b.left}%`;
      item.style.width = `${b.size}px`;
      item.style.animationDelay = `${b.delay}s`;
      item.style.animationDuration = `${b.duration}s`;
      item.innerHTML = createLuxuryBalloonSvg(b.theme, idx);
      balloonContainer.appendChild(item);
    });

    // Remove DOM elements after animation finishes
    setTimeout(() => {
      if (balloonContainer) {
        balloonContainer.innerHTML = '';
      }
    }, 3400);
  }

  if (openBtn && openingOverlay && mainInvitation) {
    openBtn.addEventListener('click', () => {
      playRoyalFanfare();
      triggerConfettiBurst();
      triggerBalloonReveal();

      openingOverlay.classList.add('revealed');
      mainInvitation.classList.add('visible');

      // Start gentle music after a brief moment
      setTimeout(() => {
        if (!isPlayingMusic) {
          toggleMusic();
        }
      }, 700);

      // Scroll smoothly to top of main card
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 400);
    });
  }

  // 5. Ambient Celestial Canvas (Golden Stars & Warm Amber Sparkles)
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(35, Math.floor(window.innerWidth / 12));
    const warmColors = ['#D4AF37', '#B88B68', '#F4A27E', '#8D5B3A', '#E5C368'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: -Math.random() * 0.45 - 0.15,
        opacity: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.008,
        twinklePhase: Math.random() * Math.PI * 2,
        color: warmColors[Math.floor(Math.random() * warmColors.length)]
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.twinklePhase += p.twinkleSpeed;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.twinklePhase));

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.05, currentOpacity);
        ctx.shadowBlur = 4;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(renderParticles);
    }

    requestAnimationFrame(renderParticles);
  }

  // 6. Confetti / Sparkle Burst Effect (Brown, Gold & Peach Palette)
  function triggerConfettiBurst() {
    const confettiContainer = document.getElementById('confetti-container');
    if (!confettiContainer) return;

    const colors = ['#D4AF37', '#F5E5BE', '#8D5B3A', '#F4A27E', '#5C3A21', '#FFD2B8'];
    const totalPieces = 32;

    for (let i = 0; i < totalPieces; i++) {
      const piece = document.createElement('div');
      piece.style.position = 'absolute';
      piece.style.width = Math.random() * 8 + 6 + 'px';
      piece.style.height = Math.random() * 8 + 6 + 'px';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      piece.style.left = '50%';
      piece.style.top = '50%';
      piece.style.opacity = '1';
      piece.style.pointerEvents = 'none';
      piece.style.transform = 'translate(-50%, -50%)';
      piece.style.transition = 'all 1.2s cubic-bezier(0.12, 0.8, 0.32, 1)';
      confettiContainer.appendChild(piece);

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 180 + 80;
      const destX = Math.cos(angle) * velocity;
      const destY = Math.sin(angle) * velocity - 40;
      const rotation = Math.random() * 720 - 360;

      requestAnimationFrame(() => {
        piece.style.transform = `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) rotate(${rotation}deg) scale(0.6)`;
        piece.style.opacity = '0';
      });

      setTimeout(() => {
        if (piece.parentNode) piece.parentNode.removeChild(piece);
      }, 1300);
    }
  }
});

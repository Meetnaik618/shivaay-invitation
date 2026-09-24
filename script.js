/**
 * Shivaay's 1st Birthday — Bespoke Digital Invitation
 * Performance-optimized, mobile-first, zero-dependency script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Public URL Setup
  const currentUrl = window.location.href.split('#')[0];
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

  // 4. Opening Screen Reveal Interaction
  const openBtn = document.getElementById('open-invitation-btn');
  const openingOverlay = document.getElementById('opening-overlay');
  const mainInvitation = document.getElementById('main-invitation');

  if (openBtn && openingOverlay && mainInvitation) {
    openBtn.addEventListener('click', () => {
      playRoyalFanfare();
      triggerConfettiBurst();

      openingOverlay.classList.add('revealed');
      mainInvitation.classList.add('visible');

      // Start gentle music after a brief moment if desired
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

  // 5. Ambient Celestial Canvas (Golden Stars & Sparkles)
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
        color: Math.random() > 0.4 ? '#D4AF37' : '#90B4D2'
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

  // 6. Confetti / Sparkle Burst Effect
  function triggerConfettiBurst() {
    const confettiContainer = document.getElementById('confetti-container');
    if (!confettiContainer) return;

    const colors = ['#D4AF37', '#F5E5BE', '#7BA3C8', '#EDF4FA', '#FFDF73'];
    const totalPieces = 30;

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

  // 7. WhatsApp Sharing with Dynamic URL
  const shareBtn = document.getElementById('share-whatsapp-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentUrl = window.location.href;
      const shareText = `🎂✨ You're invited!\n\nJoin us to celebrate Shivaay's 1st Birthday!\n\n📅 26 September 2026\n⏰ 7:00 PM\n📍 Champa, Bolinj Sopara Road, Virar West\n\nView the invitation here:\n${currentUrl}`;
      const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(shareUrl, '_blank');
    });
  }

  // 8. RSVP via WhatsApp
  const rsvpBtn = document.getElementById('rsvp-whatsapp-btn');
  if (rsvpBtn) {
    rsvpBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerConfettiBurst();
      const rsvpText = `Hello Sneha & Saurabh! We would love to attend Shivaay's 1st Birthday. ❤️`;
      const rsvpUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(rsvpText)}`;
      window.open(rsvpUrl, '_blank');
    });
  }

  // 9. Copy Invitation Link with Elegant Toast
  const copyBtn = document.getElementById('copy-link-btn');
  const toast = document.getElementById('toast-notice');

  function showToast(msg = 'Invitation link copied!') {
    if (!toast) return;
    const toastText = toast.querySelector('.toast-text');
    if (toastText) toastText.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const currentUrl = window.location.href;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(currentUrl);
        } else {
          // Fallback for older webviews
          const textArea = document.createElement('textarea');
          textArea.value = currentUrl;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
        showToast('✨ Invitation link copied!');
      } catch (err) {
        showToast('Link copied!');
      }
    });
  }

  // 10. Apple Calendar / iCal / Outlook (.ics Download)
  const icalBtn = document.getElementById('cal-ical-btn');
  if (icalBtn) {
    icalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Shivaay 1st Birthday//Invitation//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'SUMMARY:Shivaay\'s 1st Birthday',
        'DESCRIPTION:Join us as we celebrate Shivaay\'s very first birthday! Hosted by Sneha Naik & Saurabh Naik.',
        'LOCATION:Champa, Bolinj Sopara Road, Virar West, Near Peepal Tree',
        'DTSTART:20260926T133000Z',
        'DTEND:20260926T170000Z',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'shivaay-1st-birthday.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('📅 Calendar event downloaded!');
    });
  }
});

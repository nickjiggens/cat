/**
 * ANIMAL CROSSING PERSONAL WEBSITE - INTERACTIVE ENGINE
 * Features:
 * - Web Audio API Synthesizer (Animal Crossing style typewriter, chimes, pop sound, K.K. jukebox)
 * - Live Island Clock & Dynamic Weather Particle System
 * - Interactive Nook Miles+ Stamp Card with Live Counter Upgrades
 * - Floating Slingshot Balloon Present Easter Egg
 * - Dialogue Box Typewriter with Villager Sayings
 * - Full NookPhone App Modal System
 * - Customizable Resident Passport
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. WEB AUDIO API SOUND SYSTEM
     Generates authentic, warm Animal Crossing chimes, boops, and music procedurally.
     ========================================================================== */
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Play a soft cute marimba/bell note
  function playChime(freq = 523.25, type = 'sine', duration = 0.25, volume = 0.15) {
    try {
      initAudio();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(volume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio not initialized yet:', e);
    }
  }

  // Animalese speech boop
  function playAnimaleseBoop() {
    const pitch = 450 + Math.random() * 350;
    playChime(pitch, 'triangle', 0.08, 0.06);
  }

  // Button click chime
  function playButtonSound() {
    playChime(659.25, 'sine', 0.15, 0.12); // E5
    setTimeout(() => playChime(880.00, 'sine', 0.2, 0.1), 80); // A5
  }

  // Stamp punch sound
  function playStampSound() {
    playChime(523.25, 'triangle', 0.1, 0.2); // C5
    setTimeout(() => playChime(659.25, 'sine', 0.15, 0.2), 90); // E5
    setTimeout(() => playChime(783.99, 'sine', 0.18, 0.2), 180); // G5
    setTimeout(() => playChime(1046.50, 'sine', 0.35, 0.25), 270); // C6 fanfare
  }

  // Balloon pop sound
  function playPopSound() {
    playChime(300, 'sine', 0.06, 0.3);
    setTimeout(() => playChime(950, 'triangle', 0.3, 0.2), 50);
    setTimeout(() => playChime(1200, 'sine', 0.4, 0.15), 120);
  }

  // K.K. Slider Jukebox Melodies
  const MELODIES = [
    {
      title: "Bubblegum K.K. (Lullaby Chime)",
      notes: [
        { f: 523.25, d: 240 }, { f: 587.33, d: 240 }, { f: 659.25, d: 350 },
        { f: 783.99, d: 350 }, { f: 880.00, d: 300 }, { f: 783.99, d: 240 },
        { f: 659.25, d: 450 }, { f: 523.25, d: 500 }
      ]
    },
    {
      title: "Animal Crossing 5 PM (Cozy Breeze)",
      notes: [
        { f: 440.00, d: 300 }, { f: 493.88, d: 300 }, { f: 554.37, d: 350 },
        { f: 659.25, d: 450 }, { f: 554.37, d: 300 }, { f: 493.88, d: 300 },
        { f: 440.00, d: 600 }
      ]
    },
    {
      title: "Stale Cupcakes (Warm Cafe Lullaby)",
      notes: [
        { f: 392.00, d: 350 }, { f: 493.88, d: 350 }, { f: 587.33, d: 450 },
        { f: 783.99, d: 550 }, { f: 659.25, d: 400 }, { f: 587.33, d: 600 }
      ]
    }
  ];

  let currentMelodyIndex = 0;
  let isPlayingMusic = false;
  let musicTimer = null;

  function playJukeboxMelody() {
    initAudio();
    stopJukeboxMelody();
    isPlayingMusic = true;

    const melody = MELODIES[currentMelodyIndex];
    document.getElementById('trackTitle').textContent = melody.title;
    const discSpin = document.getElementById('discSpin');
    if (discSpin) discSpin.style.animationPlayState = 'running';

    let noteIdx = 0;
    function nextNote() {
      if (!isPlayingMusic) return;
      const note = melody.notes[noteIdx];
      playChime(note.f, 'sine', note.d / 1000, 0.12);

      noteIdx = (noteIdx + 1) % melody.notes.length;
      musicTimer = setTimeout(nextNote, note.d + 120);
    }
    nextNote();
  }

  function stopJukeboxMelody() {
    isPlayingMusic = false;
    clearTimeout(musicTimer);
    const discSpin = document.getElementById('discSpin');
    if (discSpin) discSpin.style.animationPlayState = 'paused';
  }

  // Island BGM Toggle Button (Header)
  const bgmToggleBtn = document.getElementById('bgmToggleBtn');
  const bgmLabel = document.getElementById('bgmLabel');
  const bgmIcon = document.getElementById('bgmIcon');

  bgmToggleBtn.addEventListener('click', () => {
    initAudio();
    if (!isPlayingMusic) {
      playJukeboxMelody();
      bgmToggleBtn.classList.add('playing');
      bgmLabel.textContent = 'Playing 🎵';
    } else {
      stopJukeboxMelody();
      bgmToggleBtn.classList.remove('playing');
      bgmLabel.textContent = 'Island BGM';
    }
  });

  // Jukebox Controls inside Cafe Modal
  document.getElementById('playTrackBtn')?.addEventListener('click', () => {
    playJukeboxMelody();
    bgmToggleBtn.classList.add('playing');
    bgmLabel.textContent = 'Playing 🎵';
  });

  document.getElementById('stopTrackBtn')?.addEventListener('click', () => {
    stopJukeboxMelody();
    bgmToggleBtn.classList.remove('playing');
    bgmLabel.textContent = 'Island BGM';
  });

  document.getElementById('nextTrackBtn')?.addEventListener('click', () => {
    playButtonSound();
    currentMelodyIndex = (currentMelodyIndex + 1) % MELODIES.length;
    playJukeboxMelody();
  });


  /* ==========================================================================
     2. REAL-TIME ISLAND CLOCK & CALENDAR
     ========================================================================== */
  const clockTimeEl = document.getElementById('islandClockTime');
  const clockDateEl = document.getElementById('islandClockDate');

  function updateIslandClock() {
    const now = new Date();
    
    // Time format: 12-hour AM/PM
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 hour should be 12
    clockTimeEl.textContent = `${hours}:${minutes} ${ampm}`;

    // Date format: Mon, Sep 28
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    clockDateEl.textContent = now.toLocaleDateString('en-US', options);
  }

  updateIslandClock();
  setInterval(updateIslandClock, 1000);


  /* ==========================================================================
     3. WEATHER SYSTEM & PARTICLES
     ========================================================================== */
  const weatherBtns = document.querySelectorAll('.weather-btn');
  const skyParticles = document.getElementById('skyParticles');
  let particleInterval = null;

  function clearParticles() {
    clearInterval(particleInterval);
    skyParticles.innerHTML = '';
  }

  function setWeather(weather) {
    document.body.className = `weather-${weather}`;
    weatherBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.weather === weather);
    });
    clearParticles();

    if (weather === 'blossom') {
      startCherryBlossoms();
    } else if (weather === 'rain') {
      startRain();
    } else if (weather === 'night') {
      startNightStars();
    }
  }

  function startCherryBlossoms() {
    const petals = ['🌸', '💮', '🌸', '🍃'];
    particleInterval = setInterval(() => {
      const petal = document.createElement('div');
      petal.className = 'particle petal';
      petal.textContent = petals[Math.floor(Math.random() * petals.length)];
      petal.style.left = `${Math.random() * 100}vw`;
      petal.style.animationDuration = `${4 + Math.random() * 4}s`;
      petal.style.fontSize = `${1 + Math.random() * 0.8}rem`;
      skyParticles.appendChild(petal);

      setTimeout(() => petal.remove(), 8000);
    }, 400);
  }

  function startRain() {
    particleInterval = setInterval(() => {
      for (let i = 0; i < 3; i++) {
        const drop = document.createElement('div');
        drop.className = 'particle raindrop';
        drop.style.left = `${Math.random() * 100}vw`;
        drop.style.animationDuration = `${0.8 + Math.random() * 0.5}s`;
        skyParticles.appendChild(drop);

        setTimeout(() => drop.remove(), 1500);
      }
    }, 80);
  }

  function startNightStars() {
    // Generate static twinkling stars
    for (let i = 0; i < 40; i++) {
      const star = document.createElement('div');
      star.className = 'particle star';
      star.textContent = Math.random() > 0.3 ? '✦' : '★';
      star.style.left = `${Math.random() * 100}vw`;
      star.style.top = `${Math.random() * 50}vh`;
      star.style.animationDuration = `${1.5 + Math.random() * 2}s`;
      star.style.animationDelay = `${Math.random() * 2}s`;
      skyParticles.appendChild(star);
    }
  }

  weatherBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playButtonSound();
      setWeather(btn.dataset.weather);
    });
  });


  /* ==========================================================================
     4. ANIMAL CROSSING DIALOGUE BOX (Typewriter & Sweet Sayings)
     ========================================================================== */
  const DIALOGUES = [
    "Welcome to my cozy personal island! Whether you're here to listen to some acoustic tunes, read my letters, or just relax under the peach trees... I hope your day is filled with 5-star island happiness! 🌸",
    "Did you know? You get a 100% bonus on your smile rating every time you visit this website! Nick told me so, and he never lies about that! 🥰",
    "Today's Island Ordinance: Mandatory cozy blankets, warm drinks, and taking plenty of breaks. You deserve all the good things today! ☕🍃",
    "Brewster just brewed a fresh pot of coffee at The Roost! He said: 'Coo... Honey is the sweetest resident representative ever.' 🕊️✨",
    "I checked the island rating today, and Isabelle gave us 5 Stars! Her comment was: 'This island has the most wonderful girlfriend in the entire world!' ⭐⭐⭐⭐⭐",
    "If you ever feel tired, remember this island will always be here waiting with warm sunshine, singing birds, and unlimited hugs from Nick! 💖"
  ];

  let currentDialogueIndex = 0;
  const dialogueTextEl = document.getElementById('dialogueText');
  const talkBtn = document.getElementById('talkBtn');
  let typeTimer = null;

  function typeWriter(text) {
    clearInterval(typeTimer);
    dialogueTextEl.textContent = '';
    let i = 0;

    typeTimer = setInterval(() => {
      if (i < text.length) {
        dialogueTextEl.textContent += text[i];
        if (text[i] !== ' ' && i % 2 === 0) {
          playAnimaleseBoop();
        }
        i++;
      } else {
        clearInterval(typeTimer);
      }
    }, 28);
  }

  talkBtn.addEventListener('click', () => {
    playButtonSound();
    currentDialogueIndex = (currentDialogueIndex + 1) % DIALOGUES.length;
    typeWriter(DIALOGUES[currentDialogueIndex]);
  });

  // Love Button (Sends hearts & increments bells)
  const sendLoveBtn = document.getElementById('sendLoveBtn');
  const bellsCountEl = document.getElementById('bellsCount');
  let bells = 99999;

  sendLoveBtn.addEventListener('click', (e) => {
    playStampSound();
    bells += 1000;
    bellsCountEl.textContent = bells.toLocaleString();
    triggerLoveHearts(e.clientX, e.clientY);
  });

  function triggerLoveHearts(x, y) {
    const container = document.getElementById('confettiContainer');
    const hearts = ['❤️', '💖', '💕', '🌸', '✨', '🥰'];

    for (let i = 0; i < 12; i++) {
      const heart = document.createElement('div');
      heart.className = 'confetti-heart';
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.left = `${x || window.innerWidth / 2}px`;
      heart.style.top = `${y || window.innerHeight / 2}px`;

      const angle = (Math.PI * 2 * i) / 12;
      const dist = 60 + Math.random() * 80;
      heart.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      heart.style.setProperty('--dy', `${Math.sin(angle) * dist - 50}px`);
      heart.style.fontSize = `${1.2 + Math.random() * 0.8}rem`;

      container.appendChild(heart);
      setTimeout(() => heart.remove(), 1800);
    }
  }


  /* ==========================================================================
     5. INTERACTIVE NOOK MILES+ STAMP CARDS
     ========================================================================== */
  const stampSlots = document.querySelectorAll('.stamp-slot');
  const milesCountEl = document.getElementById('milesCount');
  let miles = 25800;

  stampSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      if (slot.classList.contains('stamped')) {
        playButtonSound();
        return;
      }

      playStampSound();
      slot.classList.add('stamped');
      
      const circle = slot.querySelector('.slot-circle');
      circle.innerHTML = '<span class="stamp-mark">🌸</span>';

      // Increment miles
      miles += 250;
      milesCountEl.textContent = miles.toLocaleString();

      const rect = slot.getBoundingClientRect();
      triggerLoveHearts(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  });


  /* ==========================================================================
     6. FLOATING BALLOON PRESENT (SLINGSHOT POP)
     ========================================================================== */
  const balloon = document.getElementById('balloonPresent');
  const modalPresent = document.getElementById('modal-present');

  balloon.addEventListener('click', (e) => {
    playPopSound();
    triggerLoveHearts(e.clientX, e.clientY);
    
    // Hide balloon temporarily then reopen
    balloon.style.display = 'none';
    openModal(modalPresent);

    setTimeout(() => {
      balloon.style.display = 'flex';
    }, 20000);
  });


  /* ==========================================================================
     7. BULLETIN BOARD LITTLE BIRD & PIN NOTE
     ========================================================================== */
  const bulletinBird = document.getElementById('bulletinBird');
  bulletinBird.addEventListener('click', () => {
    playChime(1318.51, 'sine', 0.1, 0.2); // E6 chirp
    setTimeout(() => playChime(1567.98, 'sine', 0.15, 0.2), 90); // G6
    setTimeout(() => playChime(1760.00, 'sine', 0.25, 0.2), 180); // A6
    const speech = bulletinBird.querySelector('.bird-speech');
    speech.textContent = 'Tweet! Nick loves you! 💖';
    setTimeout(() => {
      speech.textContent = 'Chirp! 🎵';
    }, 3000);
  });

  document.getElementById('addNoteBtn')?.addEventListener('click', () => {
    playButtonSound();
    const message = prompt("Pin a sweet message on the island corkboard:", "Honey had the cutest laugh today! 🥰");
    if (message) {
      playStampSound();
      const corkboard = document.querySelector('.bulletin-notes-corkboard');
      const note = document.createElement('article');
      note.className = 'cork-note note-yellow ac-border-note';
      note.innerHTML = `
        <div class="thumbtack thumbtack-red"></div>
        <div class="note-date">Freshly Pinned 📌</div>
        <h4 class="note-heading">Love Note:</h4>
        <p class="note-body">"${escapeHTML(message)}"</p>
        <div class="note-signature">- Added with Love 💕</div>
      `;
      corkboard.prepend(note);
    }
  });


  /* ==========================================================================
     8. MODAL SYSTEM (NookPhone Apps & Features)
     ========================================================================== */
  function openModal(modal) {
    if (!modal) return;
    initAudio();
    playButtonSound();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal(modal) {
    if (!modal) return;
    playButtonSound();
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  // App buttons opening modals
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      openModal(modal);
    });
  });

  // Close buttons
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.ac-modal-backdrop');
      closeModal(modal);
    });
  });

  // Close by clicking backdrop
  document.querySelectorAll('.ac-modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop);
      }
    });
  });

  // DIY Craft Button
  document.getElementById('craftRecipeBtn')?.addEventListener('click', () => {
    playStampSound();
    alert("🎉 Clang! Clang! Clang! ✨ You crafted: The Ultimate Cozy Date Night! Valid immediately!");
  });


  /* ==========================================================================
     9. PASSPORT EDITOR (Local Storage Persistence)
     ========================================================================== */
  const editPassportBtn = document.getElementById('editPassportBtn');
  const modalEditPassport = document.getElementById('modal-edit-passport');
  const passportEditForm = document.getElementById('passportEditForm');

  const passportName = document.getElementById('passportName');
  const passportIsland = document.getElementById('passportIsland');
  const islandHeaderTitle = document.getElementById('islandHeaderTitle');
  const speakerName = document.getElementById('speakerName');
  const passportTitle = document.getElementById('passportTitle');
  const passportFruit = document.getElementById('passportFruit');
  const passportComment = document.getElementById('passportComment');

  const editNameInput = document.getElementById('editNameInput');
  const editIslandInput = document.getElementById('editIslandInput');
  const editTitleInput = document.getElementById('editTitleInput');
  const editFruitInput = document.getElementById('editFruitInput');
  const editCommentInput = document.getElementById('editCommentInput');

  // Load saved passport from localStorage
  const savedPassport = localStorage.getItem('ac_passport_data');
  if (savedPassport) {
    try {
      const data = JSON.parse(savedPassport);
      passportName.textContent = data.name;
      speakerName.textContent = `${data.name} (Resident Rep)`;
      passportIsland.textContent = data.island;
      islandHeaderTitle.textContent = `${data.island} Island`;
      passportTitle.textContent = data.title;
      passportFruit.textContent = data.fruit;
      passportComment.textContent = `"${data.comment}"`;

      editNameInput.value = data.name;
      editIslandInput.value = data.island;
      editTitleInput.value = data.title;
      editFruitInput.value = data.fruit;
      editCommentInput.value = data.comment;
    } catch (e) {
      console.error(e);
    }
  }

  editPassportBtn.addEventListener('click', () => {
    openModal(modalEditPassport);
  });

  passportEditForm.addEventListener('submit', (e) => {
    e.preventDefault();
    playStampSound();

    const updatedData = {
      name: editNameInput.value.trim() || 'Honey',
      island: editIslandInput.value.trim() || 'Cozy Haven',
      title: editTitleInput.value.trim() || 'Full-Time Cutie & Procrastinator',
      fruit: editFruitInput.value,
      comment: editCommentInput.value.trim() || 'Sweet smiles every day!'
    };

    passportName.textContent = updatedData.name;
    speakerName.textContent = `${updatedData.name} (Resident Rep)`;
    passportIsland.textContent = updatedData.island;
    islandHeaderTitle.textContent = `${updatedData.island} Island`;
    passportTitle.textContent = updatedData.title;
    passportFruit.textContent = updatedData.fruit;
    passportComment.textContent = `"${updatedData.comment}"`;

    localStorage.setItem('ac_passport_data', JSON.stringify(updatedData));
    closeModal(modalEditPassport);
    triggerLoveHearts();
  });

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

});

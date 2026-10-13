/**
 * URDEVA STUDIO — RADICAL SPATIAL & KINETIC ENGINE
 * Avant-Garde Computational Design & Interactive Physics Framework
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. WEB AUDIO SYNTHESIZER ENGINE (Procedural Soundscapes & Haptic Clicks)
  // =========================================================================
  let audioCtx = null;
  let isSynthActive = false;
  let droneOsc1 = null;
  let droneOsc2 = null;
  let droneGain = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playHapticSound(type = 'click') {
    if (!isSynthActive || !audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'hover') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(660, now + 0.03);

        gain.gain.setValueAtTime(0.025, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.start(now);
        osc.stop(now + 0.03);
      } else if (type === 'throw') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'chime') {
        // High harmonic chord
        const chord = [523.25, 659.25, 783.99, 1046.50]; // C Major 7th
        chord.forEach((freq, idx) => {
          const o = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, now + idx * 0.04);
          g.gain.setValueAtTime(0.04, now + idx * 0.04);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
          o.connect(g);
          g.connect(audioCtx.destination);
          o.start(now + idx * 0.04);
          o.stop(now + 0.45);
        });
      }
    } catch (err) {
      console.warn('Synth trigger error:', err);
    }
  }

  function startAmbientDrone() {
    if (!audioCtx) return;
    try {
      droneOsc1 = audioCtx.createOscillator();
      droneOsc2 = audioCtx.createOscillator();
      droneGain = audioCtx.createGain();

      droneOsc1.type = 'sine';
      droneOsc1.frequency.setValueAtTime(55, audioCtx.currentTime); // Low A

      droneOsc2.type = 'sine';
      droneOsc2.frequency.setValueAtTime(82.4, audioCtx.currentTime); // E

      droneGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      droneGain.gain.linearRampToValueAtTime(0.02, audioCtx.currentTime + 1.5);

      droneOsc1.connect(droneGain);
      droneOsc2.connect(droneGain);
      droneGain.connect(audioCtx.destination);

      droneOsc1.start();
      droneOsc2.start();
    } catch (e) {
      console.warn('Drone error:', e);
    }
  }

  function stopAmbientDrone() {
    if (droneGain && audioCtx) {
      droneGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
      setTimeout(() => {
        if (droneOsc1) { droneOsc1.stop(); droneOsc1.disconnect(); droneOsc1 = null; }
        if (droneOsc2) { droneOsc2.stop(); droneOsc2.disconnect(); droneOsc2 = null; }
      }, 500);
    }
  }

  const synthToggle = document.getElementById('synthToggle');
  const synthStatusText = document.getElementById('synthStatusText');

  if (synthToggle) {
    synthToggle.addEventListener('click', () => {
      initAudioContext();
      isSynthActive = !isSynthActive;

      if (isSynthActive) {
        synthToggle.classList.add('playing');
        if (synthStatusText) synthStatusText.textContent = 'SYNTH: ACTIVE';
        startAmbientDrone();
        playHapticSound('chime');
        showToast('Sintesis Audio & Haptic Aktif [440Hz / Drone]', 'info');
      } else {
        synthToggle.classList.remove('playing');
        if (synthStatusText) synthStatusText.textContent = 'SYNTH: OFF';
        stopAmbientDrone();
        showToast('Sintesis Audio Dinonaktifkan', 'info');
      }
    });
  }

  // =========================================================================
  // 2. MONOCHROMATIC CONTRAST CYCLER (Warm Ivory vs Pitch Obsidian)
  // =========================================================================
  const contrastCycler = document.getElementById('contrastCycler');
  const contrastLabel = document.getElementById('contrastLabel');

  if (contrastCycler) {
    contrastCycler.addEventListener('click', () => {
      const isObsidian = document.body.classList.toggle('theme-obsidian');
      if (contrastLabel) {
        contrastLabel.textContent = isObsidian ? 'OBSIDIAN' : 'IVORY';
      }
      playHapticSound('click');
      showToast(isObsidian ? 'Polaritas: Pitch Obsidian Mode' : 'Polaritas: Warm Ivory Paper', 'info');
    });
  }

  // =========================================================================
  // 3. TOAST STREAM NOTIFICATION SYSTEM
  // =========================================================================
  const toastStream = document.getElementById('toastStream');

  function showToast(message, type = 'info') {
    if (!toastStream) return;
    const toast = document.createElement('div');
    toast.className = `radical-toast toast-${type}`;
    toast.innerHTML = `<span>&bull;</span> <span>${message}</span>`;
    toastStream.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // =========================================================================
  // 4. RADICAL MOUSE CURSOR & TELEMETRY COORDINATES
  // =========================================================================
  const radicalCursor = document.getElementById('radicalCursor');
  const cursorCoords = document.getElementById('cursorCoords');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    document.body.classList.add('cursor-active');

    if (radicalCursor) {
      radicalCursor.style.left = `${mouseX}px`;
      radicalCursor.style.top = `${mouseY}px`;
    }

    if (cursorCoords) {
      const padX = String(mouseX).padStart(4, '0');
      const padY = String(mouseY).padStart(4, '0');
      cursorCoords.textContent = `X:${padX} Y:${padY}`;
    }
  });

  // Hover states on interactables
  const hoverTargets = document.querySelectorAll('button, a, input, textarea, .draggable-artifact, .radical-list-row, .bento-matrix-card');
  hoverTargets.forEach((target) => {
    target.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hovering');
      playHapticSound('hover');
    });
    target.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hovering');
    });
  });

  // =========================================================================
  // 5. FULLSCREEN GENERATIVE SPATIAL VECTOR CANVAS
  // =========================================================================
  const spatialCanvas = document.getElementById('spatialCanvas');
  if (spatialCanvas) {
    const ctx = spatialCanvas.getContext('2d');
    let width = (spatialCanvas.width = window.innerWidth);
    let height = (spatialCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = spatialCanvas.width = window.innerWidth;
      height = spatialCanvas.height = window.innerHeight;
    });

    let waveTime = 0;

    function renderSpatialWave() {
      waveTime += 0.008;
      ctx.clearRect(0, 0, width, height);

      const isObsidian = document.body.classList.contains('theme-obsidian');
      const strokeColor = isObsidian ? 'rgba(255, 255, 255, 0.05)' : 'rgba(8, 8, 12, 0.045)';

      const numLines = 14;
      const step = height / numLines;

      ctx.lineWidth = 1;
      ctx.strokeStyle = strokeColor;

      for (let i = 0; i < numLines; i++) {
        const yBase = i * step + step / 2;
        ctx.beginPath();
        for (let x = 0; x <= width; x += 25) {
          // Interactive gravitational pull towards cursor
          const distMouse = Math.hypot(x - mouseX, yBase - mouseY);
          const mouseDeflect = Math.max(0, 1 - distMouse / 350) * 45;

          const wave =
            Math.sin(x * 0.003 + waveTime + i * 0.4) * 22 +
            Math.cos(x * 0.006 - waveTime * 0.8) * 12;

          const finalY = yBase + wave - mouseDeflect * (mouseY > yBase ? 1 : -1);
          if (x === 0) ctx.moveTo(x, finalY);
          else ctx.lineTo(x, finalY);
        }
        ctx.stroke();
      }

      requestAnimationFrame(renderSpatialWave);
    }
    requestAnimationFrame(renderSpatialWave);
  }

  // =========================================================================
  // 6. INTERACTIVE DRAGGABLE & THROWABLE ARTIFACT PHYSICS SANDBOX
  // =========================================================================
  const physicsSandbox = document.getElementById('physicsSandbox');
  const artifacts = document.querySelectorAll('.draggable-artifact');
  const scatterArtifactsBtn = document.getElementById('scatterArtifactsBtn');

  const physicsObjects = [];

  artifacts.forEach((el, index) => {
    // Initial coordinate from style or random
    const rect = el.getBoundingClientRect();
    const sandboxRect = physicsSandbox ? physicsSandbox.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };

    const initialLeft = parseFloat(el.style.left) || (index * 220 + 80);
    const initialTop = parseFloat(el.style.top) || (index * 80 + 120);

    const obj = {
      el: el,
      x: (initialLeft > 100) ? initialLeft : (window.innerWidth * (initialLeft / 100)),
      y: (initialTop > 100) ? initialTop : (window.innerHeight * (initialTop / 100)),
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      rot: (Math.random() - 0.5) * 8,
      vrot: 0,
      width: el.offsetWidth || 250,
      height: el.offsetHeight || 300,
      isDragging: false,
      lastMouseX: 0,
      lastMouseY: 0,
    };

    physicsObjects.push(obj);

    function onPointerDown(e) {
      if (e.target.closest('.art-inspect-btn')) {
        return; // Allow button click to pass to modal
      }

      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      obj.isDragging = true;
      obj.lastMouseX = clientX;
      obj.lastMouseY = clientY;
      obj.vx = 0;
      obj.vy = 0;
      obj.vrot = 0;

      el.classList.add('dragging');
      // Bring to front
      physicsObjects.forEach(o => o.el.style.zIndex = '30');
      el.style.zIndex = '80';

      playHapticSound('click');
    }

    el.addEventListener('mousedown', onPointerDown);
    el.addEventListener('touchstart', onPointerDown, { passive: true });
  });

  window.addEventListener('mousemove', (e) => {
    physicsObjects.forEach((obj) => {
      if (!obj.isDragging) return;

      const dx = e.clientX - obj.lastMouseX;
      const dy = e.clientY - obj.lastMouseY;

      obj.x += dx;
      obj.y += dy;

      // Track throw velocity with momentum dampening
      obj.vx = dx * 0.45;
      obj.vy = dy * 0.45;
      obj.vrot = dx * 0.15;

      obj.lastMouseX = e.clientX;
      obj.lastMouseY = e.clientY;
    });
  });

  window.addEventListener('mouseup', () => {
    physicsObjects.forEach((obj) => {
      if (obj.isDragging) {
        obj.isDragging = false;
        obj.el.classList.remove('dragging');
        if (Math.hypot(obj.vx, obj.vy) > 3) {
          playHapticSound('throw');
        }
      }
    });
  });

  // Touch handlers
  window.addEventListener('touchmove', (e) => {
    if (!e.touches || !e.touches[0]) return;
    const t = e.touches[0];
    physicsObjects.forEach((obj) => {
      if (!obj.isDragging) return;
      const dx = t.clientX - obj.lastMouseX;
      const dy = t.clientY - obj.lastMouseY;
      obj.x += dx;
      obj.y += dy;
      obj.vx = dx * 0.4;
      obj.vy = dy * 0.4;
      obj.lastMouseX = t.clientX;
      obj.lastMouseY = t.clientY;
    });
  }, { passive: true });

  window.addEventListener('touchend', () => {
    physicsObjects.forEach((obj) => {
      if (obj.isDragging) {
        obj.isDragging = false;
        obj.el.classList.remove('dragging');
      }
    });
  });

  // Physics animation tick loop
  function updatePhysics() {
    const hudHeight = 75;
    const maxX = window.innerWidth;
    const maxY = window.innerHeight;

    physicsObjects.forEach((obj) => {
      if (!obj.isDragging) {
        // Friction decay
        obj.vx *= 0.94;
        obj.vy *= 0.94;
        obj.vrot *= 0.92;

        obj.x += obj.vx;
        obj.y += obj.vy;
        obj.rot += obj.vrot;

        // Boundary collision with elastic bounce
        const cardWidth = obj.width;
        const cardHeight = obj.height;

        if (obj.x < 16) {
          obj.x = 16;
          obj.vx = -obj.vx * 0.65;
        } else if (obj.x + cardWidth > maxX - 16) {
          obj.x = maxX - cardWidth - 16;
          obj.vx = -obj.vx * 0.65;
        }

        if (obj.y < hudHeight + 16) {
          obj.y = hudHeight + 16;
          obj.vy = -obj.vy * 0.65;
        } else if (obj.y + cardHeight > maxY - 16) {
          obj.y = maxY - cardHeight - 16;
          obj.vy = -obj.vy * 0.65;
        }
      }

      // Apply transform
      obj.el.style.left = `${obj.x}px`;
      obj.el.style.top = `${obj.y}px`;
      obj.el.style.transform = `rotate(${obj.rot}deg)`;
    });

    requestAnimationFrame(updatePhysics);
  }
  requestAnimationFrame(updatePhysics);

  // Scatter Action Button
  if (scatterArtifactsBtn) {
    scatterArtifactsBtn.addEventListener('click', () => {
      physicsObjects.forEach((obj) => {
        obj.vx = (Math.random() - 0.5) * 32;
        obj.vy = (Math.random() - 0.5) * 32;
        obj.vrot = (Math.random() - 0.5) * 18;
      });
      playHapticSound('throw');
      showToast('Posisi Artefak Dihamburkan secara Acak [Gravitasi Impuls]', 'info');
    });
  }

  // =========================================================================
  // 7. SPATIAL HUD DIMENSION SWITCHING
  // =========================================================================
  const modeNavBtns = document.querySelectorAll('.mode-nav-btn');
  const sections = {
    spatial: document.getElementById('spatialSection'),
    archive: document.getElementById('archiveSection'),
    composer: document.getElementById('composerSection'),
    terminal: document.getElementById('terminalSection'),
  };

  modeNavBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      const targetSec = sections[view];

      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth' });
        modeNavBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        playHapticSound('click');
      }
    });
  });

  // IntersectionObserver to update HUD button on scroll
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        let viewName = 'spatial';
        if (id === 'archiveSection') viewName = 'archive';
        else if (id === 'composerSection') viewName = 'composer';
        else if (id === 'terminalSection') viewName = 'terminal';

        modeNavBtns.forEach((btn) => {
          btn.classList.toggle('active', btn.dataset.view === viewName);
        });
      }
    });
  }, observerOptions);

  Object.values(sections).forEach((sec) => {
    if (sec) sectionObserver.observe(sec);
  });

  // =========================================================================
  // 8. ARCHIVE MATRIX: DUAL VIEW (BENTO vs KINETIC LIST) & FILTERING
  // =========================================================================
  const btnViewCards = document.getElementById('btnViewCards');
  const btnViewKinetic = document.getElementById('btnViewKinetic');
  const archiveBentoGrid = document.getElementById('archiveBentoGrid');
  const archiveKineticList = document.getElementById('archiveKineticList');
  const afChips = document.querySelectorAll('.af-chip');

  if (btnViewCards && btnViewKinetic && archiveBentoGrid && archiveKineticList) {
    btnViewCards.addEventListener('click', () => {
      btnViewCards.classList.add('active');
      btnViewKinetic.classList.remove('active');
      archiveBentoGrid.classList.add('active');
      archiveKineticList.classList.remove('active');
      playHapticSound('click');
    });

    btnViewKinetic.addEventListener('click', () => {
      btnViewKinetic.classList.add('active');
      btnViewCards.classList.remove('active');
      archiveKineticList.classList.add('active');
      archiveBentoGrid.classList.remove('active');
      playHapticSound('click');
    });
  }

  // Filtering
  afChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      afChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.dataset.filter;

      // Filter Bento cards
      const bentoCards = document.querySelectorAll('.bento-matrix-card');
      bentoCards.forEach((card) => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });

      playHapticSound('click');
    });
  });

  // Floating Capsule on Kinetic List Hover
  const artifactCapsule = document.getElementById('artifactCapsule');
  const capsuleImg = document.getElementById('capsuleImg');
  const capsuleTitle = document.getElementById('capsuleTitle');
  const radicalListRows = document.querySelectorAll('.radical-list-row');

  radicalListRows.forEach((row) => {
    row.addEventListener('mouseenter', () => {
      if (!artifactCapsule) return;
      const imgSrc = row.dataset.img;
      const title = row.dataset.title;

      if (capsuleImg && imgSrc) capsuleImg.src = imgSrc;
      if (capsuleTitle && title) capsuleTitle.textContent = title;

      artifactCapsule.classList.add('visible');
    });

    row.addEventListener('mouseleave', () => {
      if (artifactCapsule) artifactCapsule.classList.remove('visible');
    });

    row.addEventListener('mousemove', (e) => {
      if (!artifactCapsule) return;
      artifactCapsule.style.left = `${e.clientX + 30}px`;
      artifactCapsule.style.top = `${e.clientY + 20}px`;
    });
  });

  // =========================================================================
  // 9. CASE STUDY DATABASE & LIGHTBOX INSPECTOR
  // =========================================================================
  const caseStudies = {
    aurelia: {
      title: 'Aurélia Paris — Haute Parfumerie & Identitas Tactile',
      category: 'HAUTE BRANDING & MONOGRAM',
      year: '2026',
      client: 'Aurélia Paris SAS (Rue Saint-Honoré)',
      img: 'assets/images/project-aurelia.jpg',
      stat1: '+180% Penjualan Q1',
      stat2: '14 Negara Ekspor',
      stat3: 'Red Dot Winner 2026',
      desc: 'Menciptakan rekayasa identitas visual monokromatik untuk rumah wewangian independen di Paris. Kami mendesain tipografi kustom bergaya neo-humanist, sistem kemasan botol kaca hitam bertekstur matte dengan hot-foil perak, serta pedoman tata letak editorial cetak berskala Swiss grid murni.',
      challenge: 'Brand membutuhkan pembeda radikal dari lautan parfum komersial yang warna-warni dan berisik, membidik segmen kolektor wewangian seni tinggi.',
      deliverables: ['Custom Monogram Typography', 'Frosted Glass Flacon CAD', 'Luxury Monograph Brandbook', 'High-Contrast E-Commerce Experience'],
    },
    cryptoflow: {
      title: 'CryptoFlow Global — Spatial Multi-Asset Trading Platform',
      category: 'SPATIAL FINTECH & DESIGN SYSTEM',
      year: '2026',
      client: 'CryptoFlow Technologies Inc.',
      img: 'assets/images/project-cryptoflow.jpg',
      stat1: '64% Retensi User',
      stat2: '$1.4B Volume Harian',
      stat3: '<12ms Latensi Visual',
      desc: 'Platform trading multi-chain terdesentralisasi generasi baru. Kami merancang arsitektur visual berdensitas data tinggi namun tetap bernafas lega, dilengkapi grafik candlestick adaptif, visualisasi likuiditas spasial, dan design system tokenized 800+ komponen untuk fungsionalitas lintas device.',
      challenge: 'Menyederhanakan kompleksitas order book institusional tanpa mengorbankan kecepatan eksekusi trader profesional.',
      deliverables: ['Tokenized Design System Figma', 'Real-time Charting UI', 'Dark & Light Polar Engine', 'Mobile Trading Application'],
    },
    kinetic: {
      title: 'Kinetic Chroma — Tipografi Fluida Generatif',
      category: '3D COMPUTATIONAL ART & MOTION',
      year: '2025',
      client: 'Chroma Visual Lab (Tokyo Exhibition)',
      img: 'assets/images/project-kinetic.jpg',
      stat1: '1.2M Penonton Media',
      stat2: '4K 60FPS Pipeline',
      stat3: 'Excellence in Motion',
      desc: 'Eksplorasi batas antara tipografi statis dan dinamika fluida generatif. Diprogram menggunakan simulasi partikel Houdini dan WebGL realtime shaders untuk instalasi seni interaktif di Roppongi, Tokyo.',
      challenge: 'Mempertahankan keterbacaan huruf alfabet sembari membiarkan struktur fon meleleh dan bereaksi terhadap sensor suara pengunjung galeri.',
      deliverables: ['WebGL Realtime Shaders', 'Houdini Particle Simulations', 'Sound-Reactive Motion Rig', 'Limited Edition Art Prints'],
    },
    spatial: {
      title: 'Monolith Spatial — Visualisasi Akustik 360° & CAD Mesh',
      category: '3D PRODUCT & SPATIAL AUDIO HARDWARE',
      year: '2025',
      client: 'Monolith Audio Labs (Berlin)',
      img: 'assets/images/project-spatial.jpg',
      stat1: '$2.4M Pre-Order',
      stat2: '100% Titanium Billet',
      stat3: 'Hi-Res Audio Certified',
      desc: 'Penerjemahan file CAD industri perangkat audio planar magnetik ke dalam format mesh 3D fotorealistis untuk presentasi global, animasi ledakan arsitektural (exploded view), dan landing page interaktif WebGL 360 derajat.',
      challenge: 'Menampilkan detail serat karbon mikro dan tekstur logam sandblasted tanpa membebani performa browser pengguna.',
      deliverables: ['CAD to Mesh 3D Pipeline', 'Exploded View Animations', 'Interactive 360° WebGL Viewer', 'Keynote Launch Visuals'],
    },
    architexture: {
      title: 'Architexture Mag — Swiss Editorial Publication',
      category: 'SWISS EDITORIAL & TYPOGRAPHY',
      year: '2025',
      client: 'Architexture Biannual Publishing',
      img: 'assets/images/project-editorial.jpg',
      stat1: 'Sold Out 14 Hari',
      stat2: '320 Halaman Monokrom',
      stat3: 'Best Swiss Print 2025',
      desc: 'Penerbitan jurnal arsitektur internasional dengan pendekatan brutalist minimalis. Dicetak di atas kertas gading Fedrigoni 160gsm dengan jilid terbuka Swiss binding, kurasi tipografi serif & monospaced yang sangat presisi.',
      challenge: 'Memadukan dokumentasi foto beton kasar dengan keanggunan tata letak kontemporer berskala millimeter.',
      deliverables: ['Modular Swiss Grid Layout', 'Custom Book Jacket & Slipcase', 'Typography Hierarchy System', 'Digital Archival Platform'],
    },
    studiospace: {
      title: 'Nexus Collective — Ekosistem Kreatif Arsitektural',
      category: 'ENVIRONMENTAL REBRAND & WAYFINDING',
      year: '2026',
      client: 'Nexus Collective',
      img: 'assets/images/studio-space.jpg',
      stat1: '95% Okupansi Studio',
      stat2: '4 Lantai Gedung',
      stat3: 'Komunitas 400+ Kreator',
      desc: 'Penyegaran total identitas lingkungan, signage laser-cut baja tahan karat, wayfinding monokromatik, dan platform digital booking untuk hub kreatif terbesar di Bandung.',
      challenge: 'Menyatukan karakter bangunan industrial beton dengan navigasi intuitif bagi ratusan anggota kreatif harian.',
      deliverables: ['Environmental Wayfinding System', 'Laser-Cut Steel Signage', 'Member Mobile Pass UI', 'Brand Architecture Manual'],
    },
  };

  const caseStudyModal = document.getElementById('caseStudyModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBody = document.getElementById('modalBody');

  function openCaseStudy(id) {
    const data = caseStudies[id] || caseStudies.aurelia;
    if (!modalBody || !caseStudyModal) return;

    modalBody.innerHTML = `
      <img src="${data.img}" alt="${data.title}" class="modal-hero-img">
      <div class="modal-content-wrap">
        <div class="modal-kicker">${data.category} &bull; ${data.year} &bull; ${data.client}</div>
        <h3 class="modal-title">${data.title}</h3>

        <div class="modal-grid-stats">
          <div class="m-stat-box">
            <span>METRIK 01</span>
            <strong>${data.stat1}</strong>
          </div>
          <div class="m-stat-box">
            <span>METRIK 02</span>
            <strong>${data.stat2}</strong>
          </div>
          <div class="m-stat-box">
            <span>PENGHARGAAN</span>
            <strong>${data.stat3}</strong>
          </div>
        </div>

        <div class="modal-text-body">
          <h4>Ringkasan Proyek</h4>
          <p>${data.desc}</p>
          <h4>Tantangan &amp; Solusi Arsitektural</h4>
          <p>${data.challenge}</p>
        </div>

        <div class="modal-deliverables-pills">
          ${data.deliverables.map(d => `<span class="m-pill">${d}</span>`).join('')}
        </div>

        <div class="modal-action-bar">
          <button type="button" class="modal-close-trigger" id="modalBottomCloseBtn">Tutup Inspeksi &bull; Kembali ke Matriks</button>
        </div>
      </div>
    `;

    caseStudyModal.classList.add('open');
    caseStudyModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    playHapticSound('chime');

    const bottomClose = document.getElementById('modalBottomCloseBtn');
    if (bottomClose) {
      bottomClose.addEventListener('click', closeCaseStudy);
    }
  }

  function closeCaseStudy() {
    if (!caseStudyModal) return;
    caseStudyModal.classList.remove('open');
    caseStudyModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    playHapticSound('click');
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCaseStudy);
  if (caseStudyModal) {
    caseStudyModal.addEventListener('click', (e) => {
      if (e.target === caseStudyModal) closeCaseStudy();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && caseStudyModal && caseStudyModal.classList.contains('open')) {
      closeCaseStudy();
    }
  });

  // Attach triggers
  document.addEventListener('click', (e) => {
    const inspectBtn = e.target.closest('.art-inspect-btn');
    if (inspectBtn) {
      const art = inspectBtn.closest('.draggable-artifact');
      if (art) openCaseStudy(art.dataset.id);
      return;
    }

    const bentoCard = e.target.closest('.bento-matrix-card');
    if (bentoCard && (e.target.closest('.read-case-btn') || e.target.closest('.bmc-media'))) {
      openCaseStudy(bentoCard.dataset.id);
      return;
    }

    const listRow = e.target.closest('.radical-list-row');
    if (listRow) {
      openCaseStudy(listRow.dataset.id);
      return;
    }
  });

  // =========================================================================
  // 10. GENERATIVE TOPOLOGY & WAVE LAB (INTERACTIVE INSTRUMENT)
  // =========================================================================
  const composerCanvas = document.getElementById('composerCanvas');
  if (composerCanvas) {
    const cctx = composerCanvas.getContext('2d');
    let cWidth = (composerCanvas.width = composerCanvas.offsetWidth || 850);
    let cHeight = (composerCanvas.height = composerCanvas.offsetHeight || 440);

    window.addEventListener('resize', () => {
      if (composerCanvas.offsetWidth) {
        cWidth = composerCanvas.width = composerCanvas.offsetWidth;
        cHeight = composerCanvas.height = composerCanvas.offsetHeight;
      }
    });

    let currentMode = 'topography';
    let freqVal = 1.6;
    let nodeCount = 180;
    let tensionVal = 68;
    let labTime = 0;

    let labMouseX = cWidth / 2;
    let labMouseY = cHeight / 2;
    let isLabInteracting = false;

    composerCanvas.addEventListener('mousemove', (e) => {
      const r = composerCanvas.getBoundingClientRect();
      labMouseX = e.clientX - r.left;
      labMouseY = e.clientY - r.top;
      isLabInteracting = true;
    });

    composerCanvas.addEventListener('mouseleave', () => {
      isLabInteracting = false;
    });

    // Preset Pills
    const deckPills = document.querySelectorAll('#deckPresets .deck-pill');
    deckPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        deckPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentMode = pill.dataset.mode;
        playHapticSound('click');
        showToast(`Instrumen Beralih ke Moda: ${pill.textContent}`, 'info');
      });
    });

    // Sliders
    const sliderFreq = document.getElementById('sliderFreq');
    const valFreq = document.getElementById('valFreq');
    if (sliderFreq) {
      sliderFreq.addEventListener('input', (e) => {
        freqVal = parseFloat(e.target.value);
        if (valFreq) valFreq.textContent = `${freqVal.toFixed(1)} Hz`;
      });
    }

    const sliderNodes = document.getElementById('sliderNodes');
    const valNodes = document.getElementById('valNodes');
    const activeNodeStat = document.getElementById('activeNodeStat');
    if (sliderNodes) {
      sliderNodes.addEventListener('input', (e) => {
        nodeCount = parseInt(e.target.value, 10);
        if (valNodes) valNodes.textContent = nodeCount;
        if (activeNodeStat) activeNodeStat.textContent = `NODES: ${nodeCount}`;
      });
    }

    const sliderTension = document.getElementById('sliderTension');
    const valTension = document.getElementById('valTension');
    if (sliderTension) {
      sliderTension.addEventListener('input', (e) => {
        tensionVal = parseInt(e.target.value, 10);
        if (valTension) valTension.textContent = `${tensionVal}%`;
      });
    }

    const btnResetComposer = document.getElementById('btnResetComposer');
    if (btnResetComposer) {
      btnResetComposer.addEventListener('click', () => {
        freqVal = 1.6;
        nodeCount = 180;
        tensionVal = 68;
        currentMode = 'topography';

        if (sliderFreq) sliderFreq.value = 1.6;
        if (valFreq) valFreq.textContent = '1.6 Hz';
        if (sliderNodes) sliderNodes.value = 180;
        if (valNodes) valNodes.textContent = '180';
        if (activeNodeStat) activeNodeStat.textContent = 'NODES: 180';
        if (sliderTension) sliderTension.value = 68;
        if (valTension) valTension.textContent = '68%';

        deckPills.forEach(p => p.classList.toggle('active', p.dataset.mode === 'topography'));
        playHapticSound('click');
        showToast('Parameter Instrumen Direset ke Kalibrasi Default', 'info');
      });
    }

    function renderComposerLoop() {
      labTime += 0.015 * freqVal;
      cctx.clearRect(0, 0, cWidth, cHeight);

      const isObsidian = document.body.classList.contains('theme-obsidian');
      const strokeClr = isObsidian ? 'rgba(255, 255, 255, 0.45)' : 'rgba(8, 8, 10, 0.7)';
      const nodeClr = isObsidian ? '#ffffff' : '#08080a';

      if (currentMode === 'topography') {
        // Multi-tier contour wave simulation
        const rows = 12;
        const colStep = cWidth / 60;
        cctx.lineWidth = 1.2;

        for (let r = 0; r < rows; r++) {
          const yBase = (r / rows) * cHeight + 25;
          cctx.beginPath();
          cctx.strokeStyle = strokeClr;

          for (let x = 0; x <= cWidth; x += colStep) {
            const dist = Math.hypot(x - labMouseX, yBase - labMouseY);
            const mouseFactor = isLabInteracting ? Math.max(0, 1 - dist / (220 * (tensionVal / 50))) * 60 : 0;

            const yWave =
              Math.sin(x * 0.015 + labTime + r * 0.6) * 18 +
              Math.cos(x * 0.008 - labTime) * 12;

            const finalY = yBase + yWave - mouseFactor;

            if (x === 0) cctx.moveTo(x, finalY);
            else cctx.lineTo(x, finalY);
          }
          cctx.stroke();
        }
      } else if (currentMode === 'gravitational') {
        // Vortex spiraling around center or cursor
        const cx = isLabInteracting ? labMouseX : cWidth / 2;
        const cy = isLabInteracting ? labMouseY : cHeight / 2;
        const rings = 16;

        cctx.lineWidth = 1.5;
        cctx.strokeStyle = strokeClr;

        for (let r = 1; r <= rings; r++) {
          const radius = r * 15 * (tensionVal / 50);
          cctx.beginPath();
          for (let a = 0; a <= Math.PI * 2; a += 0.1) {
            const angleOffset = labTime * (r % 2 === 0 ? 1 : -1) * 0.8;
            const wobble = Math.sin(a * 4 + labTime * 2) * (r * 2);
            const px = cx + Math.cos(a + angleOffset) * (radius + wobble);
            const py = cy + Math.sin(a + angleOffset) * (radius + wobble);
            if (a === 0) cctx.moveTo(px, py);
            else cctx.lineTo(px, py);
          }
          cctx.closePath();
          cctx.stroke();
        }
      } else if (currentMode === 'quantum') {
        // Kinetic node points interconnected with proximity lines
        cctx.fillStyle = nodeClr;
        const effectiveNodes = Math.min(nodeCount, 220);

        const points = [];
        for (let i = 0; i < effectiveNodes; i++) {
          const px = ((i * 37 + labTime * 40) % (cWidth - 40)) + 20;
          const py = ((i * 59 + Math.sin(labTime + i) * 60) % (cHeight - 40)) + 20;
          points.push({ x: px, y: py });
          cctx.fillRect(px - 1.5, py - 1.5, 3, 3);
        }

        cctx.lineWidth = 0.6;
        cctx.strokeStyle = isObsidian ? 'rgba(255, 255, 255, 0.18)' : 'rgba(8, 8, 10, 0.15)';
        for (let i = 0; i < points.length; i++) {
          for (let j = i + 1; j < points.length; j++) {
            const dist = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
            if (dist < 55) {
              cctx.beginPath();
              cctx.moveTo(points[i].x, points[i].y);
              cctx.lineTo(points[j].x, points[j].y);
              cctx.stroke();
            }
          }
        }
      } else if (currentMode === 'architect') {
        // Blueprint architectural vector grid
        cctx.lineWidth = 1;
        cctx.strokeStyle = strokeClr;

        const gridSize = 35;
        for (let x = 0; x < cWidth; x += gridSize) {
          cctx.beginPath();
          cctx.moveTo(x, 0);
          cctx.lineTo(x, cHeight);
          cctx.stroke();
        }
        for (let y = 0; y < cHeight; y += gridSize) {
          cctx.beginPath();
          cctx.moveTo(0, y);
          cctx.lineTo(cWidth, y);
          cctx.stroke();
        }

        // Crosshairs at cursor
        cctx.lineWidth = 1.8;
        cctx.strokeStyle = nodeClr;
        cctx.beginPath();
        cctx.moveTo(labMouseX - 25, labMouseY);
        cctx.lineTo(labMouseX + 25, labMouseY);
        cctx.moveTo(labMouseX, labMouseY - 25);
        cctx.lineTo(labMouseX, labMouseY + 25);
        cctx.stroke();
      }

      requestAnimationFrame(renderComposerLoop);
    }
    requestAnimationFrame(renderComposerLoop);
  }

  // =========================================================================
  // 11. SCOPE ESTIMATOR & INQUIRY PROTOCOL INTEGRATION
  // =========================================================================
  let currentBaseCost = 20000000;
  let currentBaseTime = '4-5 Minggu';
  let currentServiceName = 'Brand Identity & Visual Architecture';

  let currentScaleMul = 1.0;
  let currentScaleName = 'Emerging Brand / Startup';

  const serviceChips = document.querySelectorAll('#radicalServiceOptions .r-chip');
  const scaleChips = document.querySelectorAll('#radicalScaleOptions .r-chip');
  const addonBoxes = document.querySelectorAll('.r-addon');

  const calcPriceDisplay = document.getElementById('calcPriceDisplay');
  const calcTimeDisplay = document.getElementById('calcTimeDisplay');
  const calcSummaryList = document.getElementById('calcSummaryList');
  const btnApplyEstimate = document.getElementById('btnApplyEstimate');
  const projectBrief = document.getElementById('projectBrief');

  function updateCalculator() {
    let addonSum = 0;
    const selectedAddons = [];

    addonBoxes.forEach((chk) => {
      if (chk.checked) {
        addonSum += parseInt(chk.value, 10);
        selectedAddons.push(chk.dataset.name);
      }
    });

    const totalEstimate = Math.round(currentBaseCost * currentScaleMul + addonSum);

    // Format Rupiah
    const formatted = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(totalEstimate);

    if (calcPriceDisplay) calcPriceDisplay.textContent = formatted;
    if (calcTimeDisplay) calcTimeDisplay.textContent = `WAKTU: ${currentBaseTime.toUpperCase()}`;

    if (calcSummaryList) {
      calcSummaryList.innerHTML = `
        <div>&bull; ${currentServiceName}</div>
        <div>&bull; Skala: ${currentScaleName}</div>
        ${selectedAddons.map(a => `<div>&bull; ${a}</div>`).join('')}
      `;
    }

    return { totalEstimate, formatted, selectedAddons };
  }

  serviceChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      serviceChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentBaseCost = parseInt(chip.dataset.cost, 10);
      currentBaseTime = chip.dataset.time;
      currentServiceName = chip.dataset.name;
      updateCalculator();
      playHapticSound('click');
    });
  });

  scaleChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      scaleChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentScaleMul = parseFloat(chip.dataset.mul);
      currentScaleName = chip.dataset.name;
      updateCalculator();
      playHapticSound('click');
    });
  });

  addonBoxes.forEach((chk) => {
    chk.addEventListener('change', () => {
      updateCalculator();
      playHapticSound('click');
    });
  });

  // Transfer estimate to form brief
  if (btnApplyEstimate && projectBrief) {
    btnApplyEstimate.addEventListener('click', () => {
      const calcData = updateCalculator();
      const briefText = `[ESTIMASI TERPILIH DARI KALKULATOR URDEVA]
- Disiplin: ${currentServiceName}
- Skala Bisnis: ${currentScaleName}
- Estimasi Investasi: ${calcData.formatted} (${currentBaseTime})
- Kebutuhan Ekstra: ${calcData.selectedAddons.join(', ') || 'Standar'}

[CATATAN & DETAIL TAMBAHAN PROYEK]:
`;
      projectBrief.value = briefText;
      projectBrief.focus();
      projectBrief.scrollIntoView({ behavior: 'smooth' });
      playHapticSound('chime');
      showToast('Estimasi Berhasil Ditransfer ke Formulir Brief!', 'info');
    });
  }

  // =========================================================================
  // 12. BRIEF INQUIRY FORM DISPATCH & VALIDATION
  // =========================================================================
  const radicalInquiryForm = document.getElementById('radicalInquiryForm');
  const clientName = document.getElementById('clientName');
  const clientEmail = document.getElementById('clientEmail');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const briefError = document.getElementById('briefError');
  const submitBriefBtn = document.getElementById('submitBriefBtn');

  if (radicalInquiryForm) {
    radicalInquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      if (nameError) nameError.textContent = '';
      if (emailError) emailError.textContent = '';
      if (briefError) briefError.textContent = '';

      if (!clientName.value.trim()) {
        if (nameError) nameError.textContent = 'Harap isi nama Anda.';
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(clientEmail.value.trim())) {
        if (emailError) emailError.textContent = 'Alamat email tidak valid.';
        isValid = false;
      }

      if (!projectBrief.value.trim()) {
        if (briefError) briefError.textContent = 'Harap jelaskan brief atau tantangan proyek.';
        isValid = false;
      }

      if (!isValid) {
        playHapticSound('click');
        return;
      }

      // Simulate sending
      if (submitBriefBtn) {
        submitBriefBtn.disabled = true;
        const originalHtml = submitBriefBtn.innerHTML;
        submitBriefBtn.innerHTML = `<span>MEMPROSES DISPATCH...</span>`;

        setTimeout(() => {
          submitBriefBtn.disabled = false;
          submitBriefBtn.innerHTML = originalHtml;
          radicalInquiryForm.reset();
          updateCalculator();
          playHapticSound('chime');
          showToast('Protokol Brief Terkirim! Tim Studio akan menghubungi dalam 24 Jam.', 'info');
        }, 1200);
      }
    });
  }

  // =========================================================================
  // 13. BRAND LOGO TEXT SCRAMBLE DECRYPTION EFFECT
  // =========================================================================
  const scrambleElements = document.querySelectorAll('.scramble-trig');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789//_#[]';

  scrambleElements.forEach((el) => {
    const targetText = el.dataset.target || el.textContent;
    let scrambleInterval = null;

    el.addEventListener('mouseenter', () => {
      let iteration = 0;
      clearInterval(scrambleInterval);

      scrambleInterval = setInterval(() => {
        el.textContent = targetText
          .split('')
          .map((letter, index) => {
            if (index < iteration) return targetText[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        if (iteration >= targetText.length) {
          clearInterval(scrambleInterval);
        }
        iteration += 1 / 2;
      }, 30);
    });
  });

  // Initial update
  updateCalculator();
  console.log('URDEVA RADICAL SPATIAL OS initialized successfully.');
});

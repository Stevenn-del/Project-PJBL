/**
 * ==========================================================================
 * KARSA POTRET — WAYANG MOTION CONTROLLER
 * Real-time Hand-Tracking Puppet Interaction using MediaPipe Hands
 * Reference-Accurate Redesign with Fullscreen & Cultural Kelir Environment
 * ==========================================================================
 */

(function () {
  'use strict';

  // --- Configuration & Constants ---
  const CONFIG = {
    lerpFactor: 0.18,          // Smooth interpolation speed (0.1 = slow/fluid, 0.3 = snappy)
    maxRotationDeg: 22,        // Max tilt angle for puppets in degrees
    pinchThreshold: 0.065,     // Normalized distance between thumb & index for gesture
    stagePaddingX: 90,         // Stage left/right horizontal boundary margin
    stagePaddingY: 60,         // Stage top/bottom vertical boundary margin
    defaultLeftXRatio: 0.28,   // Left puppet default X position ratio
    defaultRightXRatio: 0.72,  // Right puppet default X position ratio
    defaultYRatio: 0.52,       // Default Y position ratio
  };

  // --- DOM Elements ---
  const els = {
    canvas: document.getElementById('kelir-canvas'),
    ctx: null,
    blencongLight: document.getElementById('blencong-light'),
    stageViewport: document.getElementById('stage-viewport'),
    stageContainer: document.getElementById('wayang-experience-container'),
    statusDot: document.getElementById('status-dot'),
    statusText: document.getElementById('tracking-status-text'),
    handCountBadge: document.getElementById('hand-count-badge'),
    btnStart: document.getElementById('btn-start-motion'),
    btnStop: document.getElementById('btn-stop-camera'),
    btnReset: document.getElementById('btn-reset-puppets'),
    btnTogglePip: document.getElementById('btn-toggle-pip'),
    btnToggleShadow: document.getElementById('btn-toggle-shadow'),
    btnToggleFullscreen: document.getElementById('btn-toggle-fullscreen'),
    selectPuppetMode: document.getElementById('select-puppet-mode'),
    btnOpenGuide: document.getElementById('btn-open-guide'),
    btnCloseGuide: document.getElementById('btn-close-guide'),
    btnUnderstoodGuide: document.getElementById('btn-understood-guide'),
    guideModal: document.getElementById('guide-modal'),
    btnRetryCamera: document.getElementById('btn-retry-camera'),
    btnInteractive: document.getElementById('btn-start-interactive'),
    overlayIntro: document.getElementById('overlay-intro'),
    overlayLoading: document.getElementById('overlay-loading'),
    overlayError: document.getElementById('overlay-error'),
    loadingStepText: document.getElementById('loading-step-text'),
    errorMessageText: document.getElementById('error-message-text'),
    webcamPipCard: document.getElementById('webcam-pip-card'),
    webcamVideo: document.getElementById('webcam-video'),
    webcamCanvas: document.getElementById('webcam-canvas'),
    webcamCtx: null,
    btnMinimizePip: document.getElementById('btn-minimize-pip'),
    btnClosePip: document.getElementById('btn-close-pip'),
    pipGuideText: document.getElementById('pip-guide-text'),
    puppetBadgeLeft: document.getElementById('puppet-badge-left'),
    puppetBadgeRight: document.getElementById('puppet-badge-right'),
    puppetBadgeCenter: document.getElementById('puppet-badge-center'),
    badgeLeftRole: document.getElementById('badge-left-role'),
    badgeLeftName: document.getElementById('badge-left-name'),
    badgeRightRole: document.getElementById('badge-right-role'),
    badgeRightName: document.getElementById('badge-right-name'),
    debogLabelLeft: document.getElementById('debog-label-left'),
    debogLabelRight: document.getElementById('debog-label-right'),
    fullscreenHudHelper: document.getElementById('fullscreen-hud-helper'),
  };

  if (!els.canvas) {
    console.error('Wayang Motion: Canvas element not found.');
    return;
  }

  els.ctx = els.canvas.getContext('2d');
  if (els.webcamCanvas) {
    els.webcamCtx = els.webcamCanvas.getContext('2d');
  }

  // --- Preloaded Puppet Assets ---
  const puppetAssets = {
    // Reference Wayang from Instagram Reel (Primary Faithful Artwork)
    reference: {
      img: new Image(),
      loaded: false,
      src: 'assets/images/wayang-reference.png',
      aspectRatio: 587 / 1208, // 0.485927
    },
    // Classic Javanese Characters
    gatotkaca: {
      img: new Image(),
      loaded: false,
      src: 'assets/images/wayang-gatotkaca.png',
      aspectRatio: 765 / 1136, // 0.673415
    },
    arjuna: {
      img: new Image(),
      loaded: false,
      src: 'assets/images/wayang-arjuna.png',
      aspectRatio: 559 / 1129, // 0.495128
    },
  };

  puppetAssets.reference.img.onload = () => { puppetAssets.reference.loaded = true; };
  puppetAssets.reference.img.src = puppetAssets.reference.src;

  puppetAssets.gatotkaca.img.onload = () => { puppetAssets.gatotkaca.loaded = true; };
  puppetAssets.gatotkaca.img.src = puppetAssets.gatotkaca.src;

  puppetAssets.arjuna.img.onload = () => { puppetAssets.arjuna.loaded = true; };
  puppetAssets.arjuna.img.src = puppetAssets.arjuna.src;

  // --- Runtime Application State ---
  const state = {
    isActive: false,
    isCameraRunning: false,
    isSimulationMode: false,
    shadowMode: false,
    isFullscreen: false,
    isFullscreenFallback: false,
    characterMode: 'reference', // 'reference' (default Reel puppet) or 'gatotkaca-arjuna'
    pipVisible: true,
    pipMinimized: false,
    handsInstance: null,
    cameraInstance: null,
    mediaStream: null,
    detectedHandsCount: 0,
    activePointerDragging: null, // For mouse/touch interactive simulation
    blencongFlicker: 1.0,
    puppetBaseHeight: 480,       // Base height in pixels (scales up in fullscreen)
    particles: [],
    // Left Puppet State (Controls Left side)
    gatotkaca: {
      name: 'Wayang Kulit Utama (Kiri)',
      targetX: 0,
      targetY: 0,
      targetAngle: 0,
      currentX: 0,
      currentY: 0,
      currentAngle: 0,
      isPinching: false,
      lastSeen: 0,
    },
    // Right Puppet State (Controls Right side)
    arjuna: {
      name: 'Wayang Kulit Utama (Kanan)',
      targetX: 0,
      targetY: 0,
      targetAngle: 0,
      currentX: 0,
      currentY: 0,
      currentAngle: 0,
      isPinching: false,
      lastSeen: 0,
    },
  };

  // --- Set Character Mode & Update Stage Badges ---
  function setCharacterMode(mode) {
    state.characterMode = mode;
    if (mode === 'reference') {
      state.gatotkaca.name = 'Wayang Kulit Utama (Kiri)';
      state.arjuna.name = 'Wayang Kulit Utama (Kanan)';
      if (els.badgeLeftRole) els.badgeLeftRole.textContent = 'Wayang Kulit Tradisional';
      if (els.badgeLeftName) els.badgeLeftName.textContent = 'Tokoh Referensi (Kiri)';
      if (els.badgeRightRole) els.badgeRightRole.textContent = 'Wayang Kulit Tradisional';
      if (els.badgeRightName) els.badgeRightName.textContent = 'Tokoh Referensi (Kanan)';
      if (els.debogLabelLeft) els.debogLabelLeft.textContent = 'Gedebog Kiwa (Tangan Kiri)';
      if (els.debogLabelRight) els.debogLabelRight.textContent = 'Gedebog Tengen (Tangan Kanan)';
      if (els.puppetBadgeCenter) els.puppetBadgeCenter.style.display = 'block';
    } else {
      state.gatotkaca.name = 'Raden Gatotkaca';
      state.arjuna.name = 'Raden Arjuna';
      if (els.badgeLeftRole) els.badgeLeftRole.textContent = 'Ksatria Pringgodani';
      if (els.badgeLeftName) els.badgeLeftName.textContent = 'Raden Gatotkaca';
      if (els.badgeRightRole) els.badgeRightRole.textContent = 'Ksatria Madukara';
      if (els.badgeRightName) els.badgeRightName.textContent = 'Raden Arjuna';
      if (els.debogLabelLeft) els.debogLabelLeft.textContent = 'Gedebog Kiwa (Gatotkaca)';
      if (els.debogLabelRight) els.debogLabelRight.textContent = 'Gedebog Tengen (Arjuna)';
      if (els.puppetBadgeCenter) els.puppetBadgeCenter.style.display = 'none';
    }
  }

  // --- Initialize Puppet Coordinate Bounds ---
  function initPuppetPositions() {
    const w = els.canvas.width;
    const h = els.canvas.height;

    state.gatotkaca.targetX = w * CONFIG.defaultLeftXRatio;
    state.gatotkaca.targetY = h * CONFIG.defaultYRatio;
    state.gatotkaca.currentX = state.gatotkaca.targetX;
    state.gatotkaca.currentY = state.gatotkaca.targetY;
    state.gatotkaca.targetAngle = 0;
    state.gatotkaca.currentAngle = 0;

    state.arjuna.targetX = w * CONFIG.defaultRightXRatio;
    state.arjuna.targetY = h * CONFIG.defaultYRatio;
    state.arjuna.currentX = state.arjuna.targetX;
    state.arjuna.currentY = state.arjuna.targetY;
    state.arjuna.targetAngle = 0;
    state.arjuna.currentAngle = 0;
  }

  // --- Particle Effects (Sparks when executing gesture / action) ---
  function emitParticles(x, y, count = 5) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1.5;
      state.particles.push({
        x: x + (Math.random() - 0.5) * 30,
        y: y + (Math.random() - 0.5) * 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        life: 1.0,
        color: Math.random() > 0.4 ? '#D6AE7C' : '#F0D9A7',
        size: Math.random() * 3 + 2,
      });
    }
  }

  function updateParticles() {
    for (let i = state.particles.length - 1; i >= 0; i--) {
      const p = state.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.025;
      if (p.life <= 0) {
        state.particles.splice(i, 1);
      }
    }
  }

  function drawParticles(ctx) {
    if (state.particles.length === 0) return;
    ctx.save();
    for (const p of state.particles) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // --- Puppet Rendering Engine ---
  function drawPuppet(ctx, puppet, isLeftPuppet) {
    // Select asset based on active character mode
    let asset;
    let isFlipped = false;

    if (state.characterMode === 'reference') {
      asset = puppetAssets.reference;
      // In reference artwork (wayang-reference.png), puppet faces right.
      // Left puppet faces right (isFlipped = false) towards center.
      // Right puppet faces left (isFlipped = true) towards center.
      isFlipped = !isLeftPuppet;
    } else {
      if (isLeftPuppet) {
        asset = puppetAssets.gatotkaca;
        isFlipped = false; // Gatotkaca faces right
      } else {
        asset = puppetAssets.arjuna;
        isFlipped = false; // Arjuna naturally faces left in its asset
      }
    }

    if (!asset || !asset.loaded) return;

    // Strict preservation of original aspect ratio without distortion
    const h = state.puppetBaseHeight;
    const w = h * asset.aspectRatio;

    ctx.save();
    ctx.translate(puppet.currentX, puppet.currentY);
    ctx.rotate(puppet.currentAngle);

    // Realistic puppet stick extension downwards to Gedebog base
    ctx.save();
    ctx.strokeStyle = '#281408';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.44);
    ctx.lineTo(0, h * 0.94);
    ctx.stroke();

    // Tuding brass connector ring
    ctx.fillStyle = '#C89B3C';
    ctx.beginPath();
    ctx.arc(0, h * 0.72, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Traditional Shadow on Kelir Screen behind the Puppet (Faithful to Instagram Reel)
    ctx.save();
    if (state.shadowMode) {
      // Silhouette shadow puppet look with crisp dark projection
      ctx.shadowColor = 'rgba(0, 0, 0, 0.96)';
      ctx.shadowBlur = 28;
      ctx.shadowOffsetX = isFlipped ? -22 : 22;
      ctx.shadowOffsetY = 14;
      ctx.filter = 'brightness(0.06) contrast(1.4)';
    } else {
      // Warm, natural diffuse drop shadow on linen kelir cloth
      ctx.shadowColor = 'rgba(65, 30, 10, 0.42)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = isFlipped ? -20 : 20;
      ctx.shadowOffsetY = 16;
      ctx.filter = 'none';
    }

    if (isFlipped) {
      ctx.scale(-1, 1);
    }

    ctx.drawImage(asset.img, -w / 2, -h / 2, w, h);
    ctx.restore();

    // Pulse aura when gesture / pinch is triggered
    if (puppet.isPinching) {
      ctx.save();
      ctx.strokeStyle = 'rgba(214, 174, 124, 0.75)';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, h * 0.45, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  // --- Main Animation & Render Loop ---
  let animationFrameId = null;

  function renderLoop() {
    const ctx = els.ctx;
    const w = els.canvas.width;
    const h = els.canvas.height;

    // 1. Clear Stage
    ctx.clearRect(0, 0, w, h);

    // 2. Simulate traditional oil lamp flame flicker (Blencong)
    state.blencongFlicker += (Math.random() - 0.5) * 0.02;
    state.blencongFlicker = Math.max(0.94, Math.min(1.06, state.blencongFlicker));

    // Dynamic Blencong warm ambient background over traditional linen kelir
    const lampX = w * 0.5;
    const lampY = h * 0.20;
    const lampRadius = Math.max(w, h) * 0.65 * state.blencongFlicker;

    const lampGradient = ctx.createRadialGradient(
      lampX, lampY, 30,
      lampX, lampY, lampRadius
    );

    if (state.shadowMode) {
      // Deep backlit shadow play atmosphere
      ctx.fillStyle = '#170903';
      ctx.fillRect(0, 0, w, h);

      lampGradient.addColorStop(0, 'rgba(255, 248, 225, 0.96)');
      lampGradient.addColorStop(0.32, 'rgba(240, 195, 110, 0.72)');
      lampGradient.addColorStop(0.68, 'rgba(65, 24, 7, 0.92)');
      lampGradient.addColorStop(1, 'rgba(20, 7, 2, 0.99)');
    } else {
      // Authentic illuminated linen kelir cloth (warm cream / sand parchment)
      ctx.fillStyle = '#F5EADB';
      ctx.fillRect(0, 0, w, h);

      lampGradient.addColorStop(0, 'rgba(255, 253, 245, 0.98)');
      lampGradient.addColorStop(0.28, 'rgba(248, 238, 218, 0.82)');
      lampGradient.addColorStop(0.62, 'rgba(228, 203, 162, 0.55)');
      lampGradient.addColorStop(1, 'rgba(185, 142, 95, 0.35)');
    }

    ctx.fillStyle = lampGradient;
    ctx.fillRect(0, 0, w, h);

    // 3. Smooth Puppet Movement Interpolation (Lerp / Exponential smoothing)
    const lerp = CONFIG.lerpFactor;

    // Left Puppet (Gatotkaca / Reference Left)
    state.gatotkaca.currentX += (state.gatotkaca.targetX - state.gatotkaca.currentX) * lerp;
    state.gatotkaca.currentY += (state.gatotkaca.targetY - state.gatotkaca.currentY) * lerp;
    state.gatotkaca.currentAngle += (state.gatotkaca.targetAngle - state.gatotkaca.currentAngle) * lerp;

    // Right Puppet (Arjuna / Reference Right)
    state.arjuna.currentX += (state.arjuna.targetX - state.arjuna.currentX) * lerp;
    state.arjuna.currentY += (state.arjuna.targetY - state.arjuna.currentY) * lerp;
    state.arjuna.currentAngle += (state.arjuna.targetAngle - state.arjuna.currentAngle) * lerp;

    // 4. Draw Both Puppets Facing Center (Duel / Dialogue Pose)
    drawPuppet(ctx, state.gatotkaca, true);
    drawPuppet(ctx, state.arjuna, false);

    // 5. Update & Draw Interactive Particles
    updateParticles();
    drawParticles(ctx);

    animationFrameId = requestAnimationFrame(renderLoop);
  }

  // --- Hand Tracking Landmark Processing ---
  function onResults(results) {
    if (!state.isActive) return;

    // Draw hand landmarks on small PiP webcam preview canvas
    if (els.webcamCtx && els.webcamCanvas) {
      const pCtx = els.webcamCtx;
      pCtx.save();
      pCtx.clearRect(0, 0, els.webcamCanvas.width, els.webcamCanvas.height);

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        for (const landmarks of results.multiHandLandmarks) {
          if (window.drawConnectors && window.HAND_CONNECTIONS) {
            window.drawConnectors(pCtx, landmarks, window.HAND_CONNECTIONS, {
              color: '#D6AE7C',
              lineWidth: 2,
            });
          }
          if (window.drawLandmarks) {
            window.drawLandmarks(pCtx, landmarks, {
              color: '#F0D9A7',
              lineWidth: 1,
              radius: 2.5,
            });
          }
        }
      }
      pCtx.restore();
    }

    const landmarksList = results.multiHandLandmarks || [];
    const count = landmarksList.length;
    state.detectedHandsCount = count;

    // Update Status Indicators
    updateStatusBadge(count);

    if (count === 0) {
      return;
    }

    // Dynamic Stage Bounds based on current canvas dimensions
    const stageW = els.canvas.width;
    const stageH = els.canvas.height;
    const minX = CONFIG.stagePaddingX;
    const maxX = stageW - CONFIG.stagePaddingX;
    const minY = CONFIG.stagePaddingY + 70;
    const maxY = stageH - CONFIG.stagePaddingY - 30;

    // Process Hand Positions
    if (count === 1) {
      // Single hand detected: check which side the hand is on
      const lm = landmarksList[0];
      const palmCenter = getPalmCenter(lm);
      // Mirrored horizontal position: webcam feed is inverted
      const normX = 1.0 - palmCenter.x;
      const normY = palmCenter.y;

      const tilt = calculateHandTilt(lm);
      const isPinch = checkPinchGesture(lm);

      // If hand is on the left half of the frame -> Left Puppet, else -> Right Puppet
      if (normX < 0.5) {
        state.gatotkaca.targetX = clamp(normX * 1.8 * stageW, minX, stageW * 0.55);
        state.gatotkaca.targetY = clamp(normY * stageH, minY, maxY);
        state.gatotkaca.targetAngle = tilt;
        state.gatotkaca.isPinching = isPinch;
        if (isPinch) emitParticles(state.gatotkaca.currentX, state.gatotkaca.currentY, 2);
      } else {
        state.arjuna.targetX = clamp((normX - 0.2) * 1.5 * stageW, stageW * 0.45, maxX);
        state.arjuna.targetY = clamp(normY * stageH, minY, maxY);
        state.arjuna.targetAngle = tilt;
        state.arjuna.isPinching = isPinch;
        if (isPinch) emitParticles(state.arjuna.currentX, state.arjuna.currentY, 2);
      }
    } else if (count >= 2) {
      // Two hands detected: sort by mirrored X coordinate
      const handA = { lm: landmarksList[0], normX: 1.0 - getPalmCenter(landmarksList[0]).x };
      const handB = { lm: landmarksList[1], normX: 1.0 - getPalmCenter(landmarksList[1]).x };

      const leftHand = handA.normX <= handB.normX ? handA.lm : handB.lm;
      const rightHand = handA.normX > handB.normX ? handA.lm : handB.lm;

      // Control Left Puppet with Left Hand
      const leftCenter = getPalmCenter(leftHand);
      const leftNormX = 1.0 - leftCenter.x;
      const leftNormY = leftCenter.y;
      state.gatotkaca.targetX = clamp(leftNormX * 1.6 * stageW, minX, stageW * 0.52);
      state.gatotkaca.targetY = clamp(leftNormY * stageH, minY, maxY);
      state.gatotkaca.targetAngle = calculateHandTilt(leftHand);
      state.gatotkaca.isPinching = checkPinchGesture(leftHand);
      if (state.gatotkaca.isPinching) emitParticles(state.gatotkaca.currentX, state.gatotkaca.currentY, 2);

      // Control Right Puppet with Right Hand
      const rightCenter = getPalmCenter(rightHand);
      const rightNormX = 1.0 - rightCenter.x;
      const rightNormY = rightCenter.y;
      state.arjuna.targetX = clamp((rightNormX - 0.2) * 1.6 * stageW, stageW * 0.48, maxX);
      state.arjuna.targetY = clamp(rightNormY * stageH, minY, maxY);
      state.arjuna.targetAngle = calculateHandTilt(rightHand);
      state.arjuna.isPinching = checkPinchGesture(rightHand);
      if (state.arjuna.isPinching) emitParticles(state.arjuna.currentX, state.arjuna.currentY, 2);
    }
  }

  // --- Utility Landmark Computations ---
  function getPalmCenter(landmarks) {
    // Palm center estimated from Wrist (0) and Middle MCP (9)
    return {
      x: (landmarks[0].x + landmarks[9].x) * 0.5,
      y: (landmarks[0].y + landmarks[9].y) * 0.5,
    };
  }

  function calculateHandTilt(landmarks) {
    // Vector between wrist (0) and middle MCP (9)
    const dx = landmarks[9].x - landmarks[0].x;
    const dy = landmarks[9].y - landmarks[0].y;
    // Mirrored camera horizontal dx
    const angleRad = Math.atan2(-dx, -dy);
    const maxRad = (CONFIG.maxRotationDeg * Math.PI) / 180;
    return clamp(angleRad, -maxRad, maxRad);
  }

  function checkPinchGesture(landmarks) {
    // Distance between thumb tip (4) and index fingertip (8)
    const dx = landmarks[4].x - landmarks[8].x;
    const dy = landmarks[4].y - landmarks[8].y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < CONFIG.pinchThreshold;
  }

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  // --- UI Status Indicator Management ---
  function updateStatusBadge(handCount) {
    if (!state.isActive) {
      els.statusDot.className = 'status-dot';
      els.statusText.textContent = 'Kamera Belum Aktif';
      els.handCountBadge.style.display = 'none';
      return;
    }

    if (state.isSimulationMode) {
      els.statusDot.className = 'status-dot active';
      els.statusText.textContent = 'Mode Simulasi Kursor Aktif';
      els.handCountBadge.style.display = 'inline-block';
      els.handCountBadge.textContent = 'Kontrol Kursor';
      return;
    }

    if (handCount === 0) {
      els.statusDot.className = 'status-dot detecting';
      els.statusText.textContent = 'Mencari Tangan di Depan Kamera...';
      els.handCountBadge.style.display = 'inline-block';
      els.handCountBadge.textContent = '0 Tangan';
      if (els.pipGuideText) els.pipGuideText.textContent = 'Arahkan telapak tangan ke kamera';
    } else if (handCount === 1) {
      els.statusDot.className = 'status-dot active';
      els.statusText.textContent = '1 Tangan Terdeteksi — Tokoh Mengikuti Gerakan';
      els.handCountBadge.style.display = 'inline-block';
      els.handCountBadge.textContent = '1 Tangan Terdeteksi';
      if (els.pipGuideText) els.pipGuideText.textContent = 'Angkat kedua tangan untuk kendali penuh';
    } else {
      els.statusDot.className = 'status-dot active';
      const label = state.characterMode === 'reference' ? 'Dua Wayang Siap!' : 'Gatotkaca & Arjuna Siap!';
      els.statusText.textContent = `2 Tangan Terdeteksi — ${label}`;
      els.handCountBadge.style.display = 'inline-block';
      els.handCountBadge.textContent = '2 Tangan Siap';
      if (els.pipGuideText) els.pipGuideText.textContent = 'Kedua wayang terhubung!';
    }
  }

  // --- MediaPipe Hands Initialization ---
  async function initMediaPipeHands() {
    if (state.handsInstance) return state.handsInstance;

    els.loadingStepText.textContent = 'Memuat modul kecerdasan buatan MediaPipe...';

    if (typeof window.Hands === 'undefined') {
      throw new Error('Pustaka MediaPipe Hands tidak dapat dimuat dari CDN.');
    }

    const hands = new window.Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults(onResults);
    state.handsInstance = hands;
    return hands;
  }

  // --- Camera Lifecycle ---
  async function startExperience() {
    try {
      els.overlayIntro.classList.add('hidden');
      els.overlayError.classList.add('hidden');
      els.overlayLoading.classList.remove('hidden');
      els.loadingStepText.textContent = 'Menghubungkan ke peramban & memuat model...';

      // 1. Initialize MediaPipe
      const hands = await initMediaPipeHands();

      // 2. Request Camera Permission
      els.loadingStepText.textContent = 'Menghubungkan ke kamera webcam Anda...';

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Peramban Anda tidak mendukung akses webcam.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      state.mediaStream = stream;
      els.webcamVideo.srcObject = stream;
      await els.webcamVideo.play();

      // 3. Connect MediaPipe Camera Utility
      if (typeof window.Camera !== 'undefined') {
        state.cameraInstance = new window.Camera(els.webcamVideo, {
          onFrame: async () => {
            if (state.isActive && state.isCameraRunning && !els.webcamVideo.paused) {
              await hands.send({ image: els.webcamVideo });
            }
          },
          width: 640,
          height: 480,
        });
        await state.cameraInstance.start();
      } else {
        // Fallback standard video loop if Camera utility isn't present
        const videoLoop = async () => {
          if (state.isActive && state.isCameraRunning && !els.webcamVideo.paused) {
            await hands.send({ image: els.webcamVideo });
            requestAnimationFrame(videoLoop);
          }
        };
        requestAnimationFrame(videoLoop);
      }

      state.isActive = true;
      state.isCameraRunning = true;
      state.isSimulationMode = false;

      // Update UI state
      els.overlayLoading.classList.add('hidden');
      els.btnStop.style.display = 'inline-flex';
      updateStatusBadge(0);

    } catch (err) {
      console.warn('Wayang Motion: Camera error / permission issue:', err);
      stopCameraTracks();
      els.overlayLoading.classList.add('hidden');
      els.overlayError.classList.remove('hidden');
      els.errorMessageText.textContent = 
        `Gagal menghubungkan kamera: ${err.message || 'Izin ditolak atau kamera tidak ditemukan.'} Anda dapat mencoba menghubungkan kembali atau bermain menggunakan kursor.`;
      els.statusDot.className = 'status-dot error';
      els.statusText.textContent = 'Kamera Gagal Dihubungkan';
    }
  }

  function stopCameraTracks() {
    if (state.mediaStream) {
      state.mediaStream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.error('Error stopping track:', e);
        }
      });
      state.mediaStream = null;
    }
    if (els.webcamVideo) {
      els.webcamVideo.srcObject = null;
    }
    if (state.cameraInstance) {
      try {
        state.cameraInstance.stop();
      } catch (e) {}
      state.cameraInstance = null;
    }
    state.isCameraRunning = false;
  }

  function stopExperience() {
    stopCameraTracks();
    state.isActive = false;
    state.isSimulationMode = false;
    state.detectedHandsCount = 0;

    // Reset UI
    els.btnStop.style.display = 'none';
    els.overlayIntro.classList.remove('hidden');
    els.overlayLoading.classList.add('hidden');
    els.overlayError.classList.add('hidden');
    initPuppetPositions();
    updateStatusBadge(0);
  }

  // --- Interactive Simulation Mode (Fallback when Camera is Denied / Unavailable) ---
  function startInteractiveSimulation() {
    stopCameraTracks();
    state.isActive = true;
    state.isCameraRunning = false;
    state.isSimulationMode = true;

    els.overlayIntro.classList.add('hidden');
    els.overlayLoading.classList.add('hidden');
    els.overlayError.classList.add('hidden');
    els.btnStop.style.display = 'inline-flex';

    updateStatusBadge(1);
  }

  // --- Fullscreen Engine ---
  function toggleFullscreen() {
    const container = els.stageContainer;
    if (!container) return;

    const isCurrentlyFs = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      state.isFullscreenFallback
    );

    if (!isCurrentlyFs) {
      enterFullscreen(container);
    } else {
      exitFullscreen();
    }
  }

  function enterFullscreen(container) {
    if (container.requestFullscreen) {
      container.requestFullscreen().catch((err) => {
        console.warn('Native requestFullscreen failed, using in-window fallback:', err);
        enterFullscreenFallback();
      });
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
    } else {
      enterFullscreenFallback();
    }
  }

  function exitFullscreen() {
    if (state.isFullscreenFallback) {
      exitFullscreenFallback();
      return;
    }

    if (document.exitFullscreen) {
      document.exitFullscreen().catch((err) => {
        console.warn('Native exitFullscreen error:', err);
        exitFullscreenFallback();
      });
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else {
      exitFullscreenFallback();
    }
  }

  function enterFullscreenFallback() {
    state.isFullscreenFallback = true;
    updateFullscreenLayout(true);
  }

  function exitFullscreenFallback() {
    state.isFullscreenFallback = false;
    updateFullscreenLayout(false);
  }

  function handleFullscreenChange() {
    const isFs = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      state.isFullscreenFallback
    );
    updateFullscreenLayout(isFs);
  }

  function updateFullscreenLayout(isFs) {
    state.isFullscreen = isFs;

    if (!els.stageContainer) return;

    if (isFs) {
      els.stageContainer.classList.add('is-fullscreen');
      document.body.classList.add('is-fullscreen-active');
    } else {
      els.stageContainer.classList.remove('is-fullscreen', 'is-fullscreen-fallback');
      document.body.classList.remove('is-fullscreen-active');
    }

    // Update Fullscreen button state and accessibility
    if (els.btnToggleFullscreen) {
      const icon = els.btnToggleFullscreen.querySelector('i');
      const text = els.btnToggleFullscreen.querySelector('span');

      if (isFs) {
        if (icon) icon.className = 'bi bi-fullscreen-exit';
        if (text) text.textContent = 'Keluar Layar Penuh';
        els.btnToggleFullscreen.title = 'Keluar dari layar penuh (Tekan Esc)';
        els.btnToggleFullscreen.setAttribute('aria-pressed', 'true');
        els.btnToggleFullscreen.setAttribute('aria-label', 'Keluar Layar Penuh');
      } else {
        if (icon) icon.className = 'bi bi-arrows-fullscreen';
        if (text) text.textContent = 'Layar Penuh';
        els.btnToggleFullscreen.title = 'Tampilkan panggung kelir layar penuh (Fullscreen)';
        els.btnToggleFullscreen.setAttribute('aria-pressed', 'false');
        els.btnToggleFullscreen.setAttribute('aria-label', 'Layar Penuh');
      }
    }

    // Show Esc helper toast briefly in Fullscreen
    if (els.fullscreenHudHelper) {
      if (isFs) {
        els.fullscreenHudHelper.classList.remove('hidden');
        setTimeout(() => {
          if (els.fullscreenHudHelper) els.fullscreenHudHelper.classList.add('hidden');
        }, 5000);
      } else {
        els.fullscreenHudHelper.classList.add('hidden');
      }
    }

    // Resize canvas to match new viewport without resetting tracking or camera
    resizeCanvas(isFs);
  }

  function resizeCanvas(isFs) {
    if (!els.canvas) return;

    if (isFs) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      els.canvas.width = w;
      els.canvas.height = h;
      // In fullscreen, puppet becomes prominent (~70% of screen height)
      state.puppetBaseHeight = Math.min(Math.round(h * 0.72), 850);
    } else {
      els.canvas.width = 1680;
      els.canvas.height = 640;
      state.puppetBaseHeight = 480;
    }

    // Smoothly recalibrate puppet targets to fit new dimensions
    const curW = els.canvas.width;
    const curH = els.canvas.height;
    state.gatotkaca.targetX = curW * CONFIG.defaultLeftXRatio;
    state.gatotkaca.targetY = curH * CONFIG.defaultYRatio;
    state.arjuna.targetX = curW * CONFIG.defaultRightXRatio;
    state.arjuna.targetY = curH * CONFIG.defaultYRatio;
  }

  // --- Mouse / Pointer Control Handlers (For Simulation & Accessibility) ---
  function setupPointerHandlers() {
    const canvas = els.canvas;

    function handlePointerMove(e) {
      if (!state.isActive) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      // In simulation mode, or if user drags on canvas
      if (state.isSimulationMode || state.activePointerDragging) {
        if (x < canvas.width * 0.5) {
          state.gatotkaca.targetX = clamp(x, CONFIG.stagePaddingX, canvas.width * 0.52);
          state.gatotkaca.targetY = clamp(y, CONFIG.stagePaddingY + 70, canvas.height - CONFIG.stagePaddingY);
          state.gatotkaca.targetAngle = (x - canvas.width * 0.28) * 0.0008;
        } else {
          state.arjuna.targetX = clamp(x, canvas.width * 0.48, canvas.width - CONFIG.stagePaddingX);
          state.arjuna.targetY = clamp(y, CONFIG.stagePaddingY + 70, canvas.height - CONFIG.stagePaddingY);
          state.arjuna.targetAngle = (x - canvas.width * 0.72) * 0.0008;
        }
      }
    }

    canvas.addEventListener('pointerdown', (e) => {
      state.activePointerDragging = true;
      handlePointerMove(e);
    });

    window.addEventListener('pointermove', handlePointerMove);

    window.addEventListener('pointerup', () => {
      state.activePointerDragging = false;
    });
  }

  // --- Event Listeners Setup ---
  function setupEventListeners() {
    // Start Button
    if (els.btnStart) {
      els.btnStart.addEventListener('click', startExperience);
    }

    // Stop Button
    if (els.btnStop) {
      els.btnStop.addEventListener('click', stopExperience);
    }

    // Retry Camera Button
    if (els.btnRetryCamera) {
      els.btnRetryCamera.addEventListener('click', startExperience);
    }

    // Interactive Simulation Button
    if (els.btnInteractive) {
      els.btnInteractive.addEventListener('click', startInteractiveSimulation);
    }

    // Reset Puppets Position Button
    if (els.btnReset) {
      els.btnReset.addEventListener('click', () => {
        initPuppetPositions();
      });
    }

    // Fullscreen Toggle Button
    if (els.btnToggleFullscreen) {
      els.btnToggleFullscreen.addEventListener('click', toggleFullscreen);
    }

    // Character Mode Selector
    if (els.selectPuppetMode) {
      els.selectPuppetMode.addEventListener('change', (e) => {
        setCharacterMode(e.target.value);
      });
    }

    // Native Fullscreen Change Listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    // Window Resize Handler (Recalculate canvas when in Fullscreen)
    window.addEventListener('resize', () => {
      if (state.isFullscreen || state.isFullscreenFallback) {
        resizeCanvas(true);
      }
    });

    // Shadow Mode Toggle
    if (els.btnToggleShadow) {
      els.btnToggleShadow.addEventListener('click', () => {
        state.shadowMode = !state.shadowMode;
        els.stageViewport.classList.toggle('shadow-mode', state.shadowMode);
        const icon = els.btnToggleShadow.querySelector('i');
        const text = els.btnToggleShadow.querySelector('span');
        if (state.shadowMode) {
          if (icon) icon.className = 'bi bi-sun-fill';
          if (text) text.textContent = 'Mode Warna';
        } else {
          if (icon) icon.className = 'bi bi-moon-stars';
          if (text) text.textContent = 'Mode Bayangan';
        }
      });
    }

    // Toggle PiP Live Preview
    if (els.btnTogglePip) {
      els.btnTogglePip.addEventListener('click', () => {
        state.pipVisible = !state.pipVisible;
        els.webcamPipCard.classList.toggle('hidden', !state.pipVisible);
      });
    }

    if (els.btnMinimizePip) {
      els.btnMinimizePip.addEventListener('click', () => {
        state.pipMinimized = !state.pipMinimized;
        els.webcamPipCard.classList.toggle('collapsed', state.pipMinimized);
        const icon = els.btnMinimizePip.querySelector('i');
        if (icon) {
          icon.className = state.pipMinimized ? 'bi bi-plus' : 'bi bi-dash';
        }
      });
    }

    if (els.btnClosePip) {
      els.btnClosePip.addEventListener('click', () => {
        state.pipVisible = false;
        els.webcamPipCard.classList.add('hidden');
      });
    }

    // Guide Modal Handlers
    if (els.btnOpenGuide && els.guideModal) {
      els.btnOpenGuide.addEventListener('click', () => {
        els.guideModal.classList.add('open');
      });
    }

    if (els.btnCloseGuide && els.guideModal) {
      els.btnCloseGuide.addEventListener('click', () => {
        els.guideModal.classList.remove('open');
      });
    }

    if (els.btnUnderstoodGuide && els.guideModal) {
      els.btnUnderstoodGuide.addEventListener('click', () => {
        els.guideModal.classList.remove('open');
      });
    }

    // Escape Key Handler (Closes Guide Modal and Exits Fullscreen)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (els.guideModal && els.guideModal.classList.contains('open')) {
          els.guideModal.classList.remove('open');
        } else if (state.isFullscreenFallback) {
          exitFullscreenFallback();
        }
      }
    });

    // Cleanup Camera on page unload / navigation
    window.addEventListener('beforeunload', stopCameraTracks);
    window.addEventListener('pagehide', stopCameraTracks);
  }

  // --- Initial Mount ---
  function init() {
    setCharacterMode('reference');
    initPuppetPositions();
    setupEventListeners();
    setupPointerHandlers();
    renderLoop();
    console.log('Wayang Motion initialized successfully with reference wayang asset & fullscreen support.');
  }

  // Boot on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

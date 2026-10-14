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
    soundToggle: document.getElementById('sound-toggle'),
    settingsToggle: document.getElementById('settings-toggle'),
    settingsDrawer: document.getElementById('settings'),
    btnCloseSettings: document.getElementById('btn-close-settings'),
    optCharacters: document.getElementById('opt-characters'),
    optFingers: document.getElementById('opt-fingers'),
    optFacing: document.getElementById('opt-facing'),
    optCamera: document.getElementById('opt-camera'),
    optSize: document.getElementById('opt-size'),
    optVolume: document.getElementById('opt-volume'),
    toast: document.getElementById('toast'),
    previewPopout: document.getElementById('preview-popout'),
    statusPill: document.getElementById('status'),
    statusTextDirect: document.getElementById('status-text'),
    introStatus: document.getElementById('intro-status'),
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

  // --- Articulated Reference Rig Assets (Extracted directly from wayangmotionref asset) ---
  const rigAssets = {
    background: { img: new Image(), loaded: false, src: 'assets/images/reference-rig/background.png' },
    body:       { img: new Image(), loaded: false, src: 'assets/images/reference-rig/body.png' },
    upperArmL:  { img: new Image(), loaded: false, src: 'assets/images/reference-rig/upper-arm-l.png' },
    upperArmR:  { img: new Image(), loaded: false, src: 'assets/images/reference-rig/upper-arm-r.png' },
    forearmL:   { img: new Image(), loaded: false, src: 'assets/images/reference-rig/forearm-l.png' },
    forearmR:   { img: new Image(), loaded: false, src: 'assets/images/reference-rig/forearm-r.png' },
    handL:      { img: new Image(), loaded: false, src: 'assets/images/reference-rig/hand-l.png' },
    handR:      { img: new Image(), loaded: false, src: 'assets/images/reference-rig/hand-r.png' },
  };

  Object.values(rigAssets).forEach((item) => {
    item.img.onload = () => { item.loaded = true; };
    item.img.src = item.src;
  });

  // --- 1-Euro Adaptive Low-Pass Filter (Jitter Suppression with Zero-Lag) ---
  class OneEuroFilter {
    constructor(freq = 60, mincutoff = 1.2, beta = 0.008, dcutoff = 1.0) {
      this.freq = freq;
      this.mincutoff = mincutoff;
      this.beta = beta;
      this.dcutoff = dcutoff;
      this.xPrev = null;
      this.dxPrev = 0;
      this.lastTime = null;
    }

    alpha(cutoff, dt) {
      const tau = 1.0 / (2 * Math.PI * cutoff);
      return 1.0 / (1.0 + tau / dt);
    }

    filter(x, timestamp = performance.now()) {
      if (this.lastTime === null || this.xPrev === null) {
        this.lastTime = timestamp;
        this.xPrev = x;
        this.dxPrev = 0;
        return x;
      }

      const dt = Math.max((timestamp - this.lastTime) / 1000.0, 0.001);
      this.lastTime = timestamp;

      // Filtered derivative
      const dx = (x - this.xPrev) / dt;
      const aD = this.alpha(this.dcutoff, dt);
      const dxHat = aD * dx + (1.0 - aD) * this.dxPrev;
      this.dxPrev = dxHat;

      // Adaptive cutoff frequency: increases when moving fast, drops when stationary
      const cutoff = this.mincutoff + this.beta * Math.abs(dxHat);
      const a = this.alpha(cutoff, dt);

      // Filtered output
      const xHat = a * x + (1.0 - a) * this.xPrev;
      this.xPrev = xHat;
      return xHat;
    }

    reset() {
      this.xPrev = null;
      this.dxPrev = 0;
      this.lastTime = null;
    }
  }

  function normalizeAngleDiff(target, current) {
    let diff = (target - current) % (Math.PI * 2);
    if (diff > Math.PI) diff -= Math.PI * 2;
    if (diff < -Math.PI) diff += Math.PI * 2;
    return diff;
  }

  // --- Kinematic Rig Dimensions & Joint Pivots (Calibrated with mathematical precision) ---
  const RIG_CONSTANTS = {
    bodyWidth: 706,
    bodyHeight: 1377,
    bodyCenterX: 355,
    bodyCenterY: 688,
    shoulderFront: { x: 445, y: 430 },
    shoulderRear:  { x: 246, y: 430 },
    upperArmLen: 186.6,
    forearmLen: 158.0,
    upperArmAngleOffset: 0.0805, // atan2(15, 186)
    forearmAngleOffset: 0.0063,  // atan2(1, 158)
  };

  // 2-Bone Inverse Kinematics Solver (Analytical Law of Cosines)
  function solveIK(sx, sy, tx, ty, l1, l2, bendDown = true) {
    const dx = tx - sx;
    const dy = ty - sy;
    let dist = Math.sqrt(dx * dx + dy * dy);
    dist = Math.max(8.0, Math.min(l1 + l2 - 1.0, dist));
    const phi = Math.atan2(dy, dx);
    let cosAlpha = (l1 * l1 + dist * dist - l2 * l2) / (2.0 * l1 * dist);
    cosAlpha = Math.max(-1.0, Math.min(1.0, cosAlpha));
    const alpha = Math.acos(cosAlpha);
    const th1 = phi + (bendDown ? alpha : -alpha);
    const ex = sx + l1 * Math.cos(th1);
    const ey = sy + l1 * Math.sin(th1);
    const th2 = Math.atan2(ty - ey, tx - ex);
    return { th1, th2, ex, ey };
  }

  // --- Toast Notification Helper ---
  let toastTimer = null;
  function showToast(message, duration = 2400) {
    if (!els.toast) return;
    els.toast.textContent = message;
    els.toast.classList.remove('hidden');
    els.toast.classList.add('visible', 'show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      if (els.toast) {
        els.toast.classList.remove('visible', 'show');
        els.toast.classList.add('hidden');
      }
    }, duration);
  }

  // --- Background Gamelan Music & Beat Clock (Matching Primary Reference) ---
  const gamelanAudio = {
    element: new Audio('assets/audio/backsound.mp3'),
    beats: [],
    currentBeatIndex: 0,
    isPlaying: false,
    isMuted: false,
    volume: 0.6,
    lastBeatTime: 0,
    lastBeatPulse: 0,

    async init() {
      this.element.loop = true;
      this.element.volume = this.volume;
      this.element.preload = 'auto';

      try {
        const res = await fetch('assets/audio/backsound-beats.json');
        if (res.ok) {
          const data = await res.json();
          this.beats = data.beats || [];
        }
      } catch (err) {
        console.warn('Wayang Motion: Failed to load backsound-beats.json', err);
      }
    },

    async play() {
      try {
        this.element.volume = this.isMuted ? 0 : this.volume;
        await this.element.play();
        this.isPlaying = true;
        this.updateButtonUI(true);
      } catch (err) {
        // Autoplay may be restricted before user gesture
        console.log('Wayang Motion: Audio play waiting for user interaction');
      }
    },

    pause() {
      this.element.pause();
      this.isPlaying = false;
      this.updateButtonUI(false);
    },

    toggle() {
      if (!this.isPlaying || this.element.paused) {
        this.isMuted = false;
        this.play();
        showToast('Musik Gamelan Dimainkan');
      } else {
        this.isMuted = !this.isMuted;
        this.element.volume = this.isMuted ? 0 : this.volume;
        this.updateButtonUI(!this.isMuted);
        showToast(this.isMuted ? 'Musik Gamelan Dibisukan' : 'Musik Gamelan Aktif');
      }
    },

    setVolume(val) {
      this.volume = Math.max(0, Math.min(1, val));
      if (!this.isMuted) {
        this.element.volume = this.volume;
      }
    },

    updateButtonUI(active) {
      if (!els.soundToggle) return;
      els.soundToggle.classList.toggle('playing', active);
      els.soundToggle.setAttribute('aria-pressed', active ? 'true' : 'false');
      const onIcon = els.soundToggle.querySelector('.icon-sound-on');
      const offIcon = els.soundToggle.querySelector('.icon-sound-off');
      if (onIcon && offIcon) {
        onIcon.style.display = active ? 'block' : 'none';
        offIcon.style.display = active ? 'none' : 'block';
      }
    },

    tick() {
      if (!this.isPlaying || this.element.paused || this.beats.length === 0) return 0;
      const curTime = this.element.currentTime;
      while (this.currentBeatIndex < this.beats.length && this.beats[this.currentBeatIndex] <= curTime) {
        this.lastBeatTime = this.beats[this.currentBeatIndex];
        this.lastBeatPulse = performance.now();
        this.currentBeatIndex++;
      }
      if (this.currentBeatIndex >= this.beats.length && curTime < 2) {
        this.currentBeatIndex = 0;
      }
      const elapsed = performance.now() - this.lastBeatPulse;
      if (elapsed < 320) {
        return 1.0 - (elapsed / 320);
      }
      return 0;
    }
  };

  // --- Runtime Application State ---
  const state = {
    isActive: false,
    isCameraRunning: false,
    isSimulationMode: false,
    shadowMode: false,
    isFullscreen: false,
    isFullscreenFallback: false,
    characterMode: 'reference', // 'reference' (default Reel puppet) or 'gatotkaca-arjuna'
    puppetCount: 'two',         // 'two' or 'one'
    facingMode: 'target',       // 'target', 'walk', 'manual'
    fingerMap: 'thumb-index',   // 'thumb-index', 'thumb-pinky', 'index-pinky'
    lastSingleHandTarget: null, // 'gatotkaca' or 'arjuna' (spatial hysteresis)
    leftFlipped: false,         // Default: Left puppet faces right (towards center)
    rightFlipped: true,         // Default: Right puppet faces left (towards center)
    isDancing: false,           // Kiprahan dance rhythm
    puppetSizeMultiplier: 1.0,  // Puppet scale factor
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
      lastTrackingTime: 0,
      isTrackingActive: false,
      trackingBlend: 0,
      frontArm: {
        targetX: 200,
        targetY: -100,
        currentX: 200,
        currentY: -100,
        currentTh1: 0.4,
        currentTh2: -0.5,
        prevY: -100,
        angle: 0,
      },
      rearArm: {
        targetX: 90,
        targetY: -220,
        currentX: 90,
        currentY: -220,
        currentTh1: -0.3,
        currentTh2: -1.2,
        prevY: -220,
        angle: 0,
      },
      filters: {
        x: new OneEuroFilter(60, 1.2, 0.007),
        y: new OneEuroFilter(60, 1.2, 0.007),
        angle: new OneEuroFilter(60, 0.9, 0.005),
        frontArmX: new OneEuroFilter(60, 1.4, 0.009),
        frontArmY: new OneEuroFilter(60, 1.4, 0.009),
        rearArmX: new OneEuroFilter(60, 1.4, 0.009),
        rearArmY: new OneEuroFilter(60, 1.4, 0.009),
      },
      idleCycle: 0,
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
      lastTrackingTime: 0,
      isTrackingActive: false,
      trackingBlend: 0,
      frontArm: {
        targetX: 200,
        targetY: -100,
        currentX: 200,
        currentY: -100,
        currentTh1: 0.4,
        currentTh2: -0.5,
        prevY: -100,
        angle: 0,
      },
      rearArm: {
        targetX: 90,
        targetY: -220,
        currentX: 90,
        currentY: -220,
        currentTh1: -0.3,
        currentTh2: -1.2,
        prevY: -220,
        angle: 0,
      },
      filters: {
        x: new OneEuroFilter(60, 1.2, 0.007),
        y: new OneEuroFilter(60, 1.2, 0.007),
        angle: new OneEuroFilter(60, 0.9, 0.005),
        frontArmX: new OneEuroFilter(60, 1.4, 0.009),
        frontArmY: new OneEuroFilter(60, 1.4, 0.009),
        rearArmX: new OneEuroFilter(60, 1.4, 0.009),
        rearArmY: new OneEuroFilter(60, 1.4, 0.009),
      },
      idleCycle: 2.5,
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
    state.gatotkaca.frontArm.targetX = 200;
    state.gatotkaca.frontArm.targetY = -100;
    state.gatotkaca.frontArm.currentX = 200;
    state.gatotkaca.frontArm.currentY = -100;
    state.gatotkaca.frontArm.currentTh1 = 0.4;
    state.gatotkaca.frontArm.currentTh2 = -0.5;
    state.gatotkaca.rearArm.targetX = 90;
    state.gatotkaca.rearArm.targetY = -220;
    state.gatotkaca.rearArm.currentX = 90;
    state.gatotkaca.rearArm.currentY = -220;
    state.gatotkaca.rearArm.currentTh1 = -0.3;
    state.gatotkaca.rearArm.currentTh2 = -1.2;
    state.gatotkaca.lastTrackingTime = 0;
    state.gatotkaca.isTrackingActive = false;
    state.gatotkaca.trackingBlend = 0;
    if (state.gatotkaca.filters) {
      Object.values(state.gatotkaca.filters).forEach(f => f.reset());
    }

    state.arjuna.targetX = w * CONFIG.defaultRightXRatio;
    state.arjuna.targetY = h * CONFIG.defaultYRatio;
    state.arjuna.currentX = state.arjuna.targetX;
    state.arjuna.currentY = state.arjuna.targetY;
    state.arjuna.targetAngle = 0;
    state.arjuna.currentAngle = 0;
    state.arjuna.frontArm.targetX = 200;
    state.arjuna.frontArm.targetY = -100;
    state.arjuna.frontArm.currentX = 200;
    state.arjuna.frontArm.currentY = -100;
    state.arjuna.frontArm.currentTh1 = 0.4;
    state.arjuna.frontArm.currentTh2 = -0.5;
    state.arjuna.rearArm.targetX = 90;
    state.arjuna.rearArm.targetY = -220;
    state.arjuna.rearArm.currentX = 90;
    state.arjuna.rearArm.currentY = -220;
    state.arjuna.rearArm.currentTh1 = -0.3;
    state.arjuna.rearArm.currentTh2 = -1.2;
    state.arjuna.lastTrackingTime = 0;
    state.arjuna.isTrackingActive = false;
    state.arjuna.trackingBlend = 0;
    if (state.arjuna.filters) {
      Object.values(state.arjuna.filters).forEach(f => f.reset());
    }
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

  // --- Articulated Puppet Rendering Engine ---
  function drawArticulatedPuppet(ctx, puppet, isFlipped, danceOffsetY, danceAngle) {
    const baseH = state.puppetBaseHeight * (state.puppetSizeMultiplier || 1.0);
    const scale = baseH / 1377;

    const ox = RIG_CONSTANTS.bodyCenterX; // 355
    const oy = RIG_CONSTANTS.bodyCenterY; // 688

    const shFrontX = RIG_CONSTANTS.shoulderFront.x; // 445
    const shFrontY = RIG_CONSTANTS.shoulderFront.y; // 430
    const shRearX = RIG_CONSTANTS.shoulderRear.x;   // 246
    const shRearY = RIG_CONSTANTS.shoulderRear.y;   // 430

    const l1 = RIG_CONSTANTS.upperArmLen; // 186.6
    const l2 = RIG_CONSTANTS.forearmLen;  // 158.0

    // Front arm target (in unscaled body relative coordinates)
    const fTx = ox + puppet.frontArm.currentX;
    const fTy = oy + puppet.frontArm.currentY;

    // Rear arm target
    const rTx = ox + puppet.rearArm.currentX;
    const rTy = oy + puppet.rearArm.currentY;

    // Solve 2-bone IK for both arms
    const frontIK = solveIK(shFrontX, shFrontY, fTx, fTy, l1, l2, true);
    const rearIK = solveIK(shRearX, shRearY, rTx, rTy, l1, l2, false);

    // Compute stage bottom in local unscaled coordinates for stick extension
    const stageBottomY = (els.canvas.height - (puppet.currentY + danceOffsetY)) / scale;

    ctx.save();
    ctx.translate(puppet.currentX, puppet.currentY + danceOffsetY);
    ctx.rotate(puppet.currentAngle + danceAngle);
    if (isFlipped) {
      ctx.scale(-1, 1);
    }
    ctx.scale(scale, scale);

    // Dynamic Blencong Shadow on linen kelir cloth
    if (state.shadowMode) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.98)';
      ctx.shadowBlur = 32 / scale;
      ctx.shadowOffsetX = 22 / scale;
      ctx.shadowOffsetY = 16 / scale;
      ctx.filter = 'brightness(0.04) contrast(1.6)';
    } else {
      ctx.shadowColor = 'rgba(50, 20, 8, 0.44)';
      ctx.shadowBlur = 22 / scale;
      ctx.shadowOffsetX = 20 / scale;
      ctx.shadowOffsetY = 16 / scale;
      ctx.filter = 'none';
    }

    function drawPart(imgObj, pinX, pinY, attachX, attachY, angle) {
      if (!imgObj || !imgObj.loaded) return;
      ctx.save();
      ctx.translate(attachX, attachY);
      ctx.rotate(angle);
      ctx.drawImage(imgObj.img, -pinX, -pinY);
      ctx.restore();
    }

    // 1. REAR ARM (Layered behind the body)
    const rearTh1 = puppet.rearArm.currentTh1;
    const rearTh2 = puppet.rearArm.currentTh2;
    const rearEx = shRearX + l1 * Math.cos(rearTh1);
    const rearEy = shRearY + l1 * Math.sin(rearTh1);
    const rearWx = rearEx + l2 * Math.cos(rearTh2);
    const rearWy = rearEy + l2 * Math.sin(rearTh2);

    if (rigAssets.upperArmL.loaded) {
      drawPart(rigAssets.upperArmL, 24, 34, shRearX - ox, shRearY - oy, rearTh1 - RIG_CONSTANTS.upperArmAngleOffset);
    }
    if (rigAssets.forearmL.loaded) {
      drawPart(rigAssets.forearmL, 18, 51, rearEx - ox, rearEy - oy, rearTh2);
    }
    if (rigAssets.handR.loaded) {
      const rearWristFlex = clamp((puppet.rearArm.targetY - puppet.rearArm.currentY) * 0.001, -0.3, 0.3);
      drawPart(rigAssets.handR, 22, 55, rearWx - ox, rearWy - oy, rearTh2 + rearWristFlex);
    }
    // Rear Hand Stick (Tudhing Tangan) - anchored precisely at wrist rivet
    const rStickTopX = (rearWx - ox) + 38 * Math.cos(rearTh2);
    const rStickTopY = (rearWy - oy) + 38 * Math.sin(rearTh2);
    ctx.save();
    ctx.strokeStyle = '#180A04';
    ctx.lineWidth = 4 / scale;
    ctx.beginPath();
    ctx.moveTo(rStickTopX, rStickTopY);
    ctx.lineTo(rStickTopX - 35, Math.max(stageBottomY, 700));
    ctx.stroke();
    ctx.restore();

    // 2. MAIN BODY
    if (rigAssets.body.loaded) {
      ctx.drawImage(rigAssets.body.img, -ox, -oy);
    } else if (puppetAssets.reference.loaded) {
      const rw = 587;
      const rh = 1208;
      ctx.drawImage(puppetAssets.reference.img, -rw / 2, -rh / 2, rw, rh);
    }

    // Central Horn Rod (Cempurit Pokok)
    ctx.save();
    ctx.strokeStyle = '#140602';
    ctx.lineWidth = 7 / scale;
    ctx.beginPath();
    ctx.moveTo(0, -oy + 250);
    ctx.lineTo(0, Math.max(stageBottomY, 700));
    ctx.stroke();

    // Traditional Gold Tangsul Bindings
    ctx.strokeStyle = '#D6AE7C';
    ctx.lineWidth = 2.5 / scale;
    for (const bY of [-320, -120, 100, 300, 520]) {
      ctx.beginPath();
      ctx.moveTo(-7 / scale, bY);
      ctx.lineTo(7 / scale, bY);
      ctx.stroke();
    }
    ctx.restore();

    // 3. FRONT ARM (Layered in front of the body)
    const frontTh1 = puppet.frontArm.currentTh1;
    const frontTh2 = puppet.frontArm.currentTh2;
    const frontEx = shFrontX + l1 * Math.cos(frontTh1);
    const frontEy = shFrontY + l1 * Math.sin(frontTh1);
    const frontWx = frontEx + l2 * Math.cos(frontTh2);
    const frontWy = frontEy + l2 * Math.sin(frontTh2);

    if (rigAssets.upperArmL.loaded) {
      drawPart(rigAssets.upperArmL, 24, 34, shFrontX - ox, shFrontY - oy, frontTh1 - RIG_CONSTANTS.upperArmAngleOffset);
    }
    if (rigAssets.forearmL.loaded) {
      drawPart(rigAssets.forearmL, 18, 51, frontEx - ox, frontEy - oy, frontTh2);
    }
    if (rigAssets.handR.loaded) {
      const frontWristFlex = clamp((puppet.frontArm.targetY - puppet.frontArm.currentY) * 0.0012, -0.35, 0.35);
      drawPart(rigAssets.handR, 22, 55, frontWx - ox, frontWy - oy, frontTh2 + frontWristFlex);
    }
    // Front Hand Stick (Tudhing Tangan) - anchored precisely at wrist rivet
    const fStickTopX = (frontWx - ox) + 38 * Math.cos(frontTh2);
    const fStickTopY = (frontWy - oy) + 38 * Math.sin(frontTh2);
    ctx.save();
    ctx.strokeStyle = '#180A04';
    ctx.lineWidth = 4 / scale;
    ctx.beginPath();
    ctx.moveTo(fStickTopX, fStickTopY);
    ctx.lineTo(fStickTopX + 35, Math.max(stageBottomY, 700));
    ctx.stroke();
    ctx.restore();

    // Gestural Pulse Aura on Pinch Action
    if (puppet.isPinching) {
      ctx.save();
      ctx.strokeStyle = 'rgba(214, 174, 124, 0.75)';
      ctx.lineWidth = 3 / scale;
      ctx.setLineDash([6 / scale, 6 / scale]);
      ctx.beginPath();
      ctx.arc(0, 0, 500, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  // --- Master Puppet Draw Router ---
  function drawPuppet(ctx, puppet, isLeftPuppet, danceOffsetY = 0, danceAngle = 0) {
    let isFlipped = false;

    if (state.characterMode === 'reference') {
      isFlipped = isLeftPuppet ? state.leftFlipped : state.rightFlipped;
      // If rig assets are available, render articulated puppet rig
      if (rigAssets.body.loaded || puppetAssets.reference.loaded) {
        drawArticulatedPuppet(ctx, puppet, isFlipped, danceOffsetY, danceAngle);
        return;
      }
    }

    // Classic Character Mode (Gatotkaca / Arjuna fallback)
    let asset;
    if (isLeftPuppet) {
      asset = puppetAssets.gatotkaca;
      isFlipped = state.leftFlipped;
    } else {
      asset = puppetAssets.arjuna;
      isFlipped = !state.rightFlipped;
    }

    if (!asset || !asset.loaded) return;

    const h = state.puppetBaseHeight * (state.puppetSizeMultiplier || 1.0);
    const w = h * asset.aspectRatio;

    ctx.save();
    ctx.translate(puppet.currentX, puppet.currentY + danceOffsetY);
    ctx.rotate(puppet.currentAngle + danceAngle);

    ctx.save();
    ctx.strokeStyle = '#281408';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.44);
    ctx.lineTo(0, h * 0.94);
    ctx.stroke();
    ctx.fillStyle = '#C89B3C';
    ctx.beginPath();
    ctx.arc(0, h * 0.72, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    if (state.shadowMode) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.96)';
      ctx.shadowBlur = 28;
      ctx.shadowOffsetX = isFlipped ? -22 : 22;
      ctx.shadowOffsetY = 14;
      ctx.filter = 'brightness(0.06) contrast(1.4)';
    } else {
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

  // --- Kinematic Motion Propagation Engine (Hands -> Arms -> Torso -> Body) ---
  function updatePuppetKinematics(puppet, isLeft, beatPulse) {
    const handLerp = 0.24;
    const bodyLerp = CONFIG.lerpFactor; // 0.18

    // 1. Hands lead: interpolate hand targets fluidly
    puppet.frontArm.prevY = puppet.frontArm.currentY;
    puppet.frontArm.currentX += (puppet.frontArm.targetX - puppet.frontArm.currentX) * handLerp;
    puppet.frontArm.currentY += (puppet.frontArm.targetY - puppet.frontArm.currentY) * handLerp;

    puppet.rearArm.prevY = puppet.rearArm.currentY;
    puppet.rearArm.currentX += (puppet.rearArm.targetX - puppet.rearArm.currentX) * handLerp;
    puppet.rearArm.currentY += (puppet.rearArm.targetY - puppet.rearArm.currentY) * handLerp;

    // 2. Solve 2-Bone Inverse Kinematics & interpolate joint angles with wrap-around protection
    const ox = RIG_CONSTANTS.bodyCenterX;
    const oy = RIG_CONSTANTS.bodyCenterY;
    const l1 = RIG_CONSTANTS.upperArmLen;
    const l2 = RIG_CONSTANTS.forearmLen;

    const fTx = ox + puppet.frontArm.currentX;
    const fTy = oy + puppet.frontArm.currentY;
    const rTx = ox + puppet.rearArm.currentX;
    const rTy = oy + puppet.rearArm.currentY;

    const frontIK = solveIK(RIG_CONSTANTS.shoulderFront.x, RIG_CONSTANTS.shoulderFront.y, fTx, fTy, l1, l2, true);
    const rearIK = solveIK(RIG_CONSTANTS.shoulderRear.x, RIG_CONSTANTS.shoulderRear.y, rTx, rTy, l1, l2, false);

    const angleLerp = 0.28;
    const dF1 = normalizeAngleDiff(frontIK.th1, puppet.frontArm.currentTh1);
    puppet.frontArm.currentTh1 += dF1 * angleLerp;
    const dF2 = normalizeAngleDiff(frontIK.th2, puppet.frontArm.currentTh2);
    puppet.frontArm.currentTh2 += dF2 * angleLerp;

    const dR1 = normalizeAngleDiff(rearIK.th1, puppet.rearArm.currentTh1);
    puppet.rearArm.currentTh1 += dR1 * angleLerp;
    const dR2 = normalizeAngleDiff(rearIK.th2, puppet.rearArm.currentTh2);
    puppet.rearArm.currentTh2 += dR2 * angleLerp;

    // 3. Torso tilts smoothly in reaction to arm reach and vertical displacement
    const reachOffset = (puppet.frontArm.currentX - 200) * 0.00035;
    const verticalBob = (puppet.frontArm.currentY - (-100)) * 0.00015;
    const dynamicTilt = puppet.targetAngle + reachOffset;
    puppet.currentAngle += (dynamicTilt - puppet.currentAngle) * 0.14;

    // 4. Body translates smoothly
    puppet.currentX += (puppet.targetX - puppet.currentX) * bodyLerp;
    puppet.currentY += (puppet.targetY - puppet.currentY + verticalBob * 16) * bodyLerp;

    // 5. Dynamic Facing in 'walk' mode
    if (state.facingMode === 'walk') {
      const vx = puppet.targetX - puppet.currentX;
      if (Math.abs(vx) > 2.0) {
        if (isLeft) state.leftFlipped = vx < 0;
        else state.rightFlipped = vx < 0;
      }
    }

    // 6. Tracking State & Graceful Decay (Holding position during momentary dropouts)
    const now = performance.now();
    const timeSinceTracked = now - (puppet.lastTrackingTime || 0);
    const isActivelyTracked = state.isCameraRunning && (timeSinceTracked < 450);
    const isPointerActive = (now - (puppet.lastPointerTime || 0)) < 1200;

    if (isActivelyTracked || isPointerActive) {
      puppet.isTrackingActive = true;
      puppet.trackingBlend = Math.min(1.0, (puppet.trackingBlend || 0) + 0.1);
    } else {
      puppet.isTrackingActive = false;
      // If tracking lost for > 1200ms, slowly decay back towards resting posture and idle cycle
      if (timeSinceTracked > 1200) {
        puppet.trackingBlend = Math.max(0.0, (puppet.trackingBlend || 0) - 0.02);
      }
    }

    // 7. Natural breathing & autonomous conversational gestures ONLY when idle
    if (!puppet.isTrackingActive && (puppet.trackingBlend || 0) < 0.95) {
      puppet.idleCycle = (puppet.idleCycle || 0) + 0.028;
      const t = puppet.idleCycle;

      const idleBlend = 1.0 - (puppet.trackingBlend || 0);
      const defaultBaseX = isLeft ? (els.canvas.width * CONFIG.defaultLeftXRatio) : (els.canvas.width * CONFIG.defaultRightXRatio);
      const defaultBaseY = els.canvas.height * CONFIG.defaultYRatio;

      const waveX = Math.sin(t * 0.75) * 28;
      const waveY = Math.cos(t * 1.1) * 36;
      const rearWave = Math.sin(t * 0.85 + 1.2) * 22;
      const beatPop = beatPulse * 24;

      const idleFX = 205 + waveX;
      const idleFY = -105 + waveY - beatPop;
      const idleRX = 90 + rearWave;
      const idleRY = -220 - rearWave * 0.4 - beatPop * 0.5;
      const idleTilt = Math.sin(t * 0.55) * 0.035;

      puppet.targetX += (defaultBaseX - puppet.targetX) * (0.02 * idleBlend);
      puppet.targetY += (defaultBaseY - puppet.targetY) * (0.02 * idleBlend);
      puppet.frontArm.targetX += (idleFX - puppet.frontArm.targetX) * (0.04 * idleBlend);
      puppet.frontArm.targetY += (idleFY - puppet.frontArm.targetY) * (0.04 * idleBlend);
      puppet.rearArm.targetX += (idleRX - puppet.rearArm.targetX) * (0.04 * idleBlend);
      puppet.rearArm.targetY += (idleRY - puppet.rearArm.targetY) * (0.04 * idleBlend);
      puppet.targetAngle += (idleTilt - puppet.targetAngle) * (0.04 * idleBlend);
    }
  }

  // --- Main Animation & Render Loop ---
  let animationFrameId = null;

  function renderLoop() {
    const ctx = els.ctx;
    const w = els.canvas.width;
    const h = els.canvas.height;

    const beatPulse = gamelanAudio.tick();

    // 1. Clear Stage
    ctx.clearRect(0, 0, w, h);

    // 2. Oil lamp flame flicker
    state.blencongFlicker += (Math.random() - 0.5) * 0.02;
    state.blencongFlicker = Math.max(0.94, Math.min(1.06, state.blencongFlicker));

    // 3. Stage Background
    if (state.shadowMode) {
      // Deep backlit nocturnal theater
      ctx.fillStyle = '#170903';
      ctx.fillRect(0, 0, w, h);

      const lampX = w * 0.5;
      const lampY = h * 0.20;
      const lampRadius = Math.max(w, h) * 0.65 * state.blencongFlicker;
      const lampGradient = ctx.createRadialGradient(lampX, lampY, 30, lampX, lampY, lampRadius);
      lampGradient.addColorStop(0, 'rgba(255, 248, 225, 0.96)');
      lampGradient.addColorStop(0.32, 'rgba(240, 195, 110, 0.72)');
      lampGradient.addColorStop(0.68, 'rgba(65, 24, 7, 0.92)');
      lampGradient.addColorStop(1, 'rgba(20, 7, 2, 0.99)');
      ctx.fillStyle = lampGradient;
      ctx.fillRect(0, 0, w, h);
    } else {
      if (state.characterMode === 'reference' && rigAssets.background.loaded) {
        // Authentic reference background from wayangmotionref
        ctx.drawImage(rigAssets.background.img, 0, 0, w, h);
        const lampX = w * 0.5;
        const lampY = h * 0.20;
        const lampRadius = Math.max(w, h) * 0.60 * state.blencongFlicker;
        const lampGradient = ctx.createRadialGradient(lampX, lampY, 20, lampX, lampY, lampRadius);
        lampGradient.addColorStop(0, 'rgba(255, 255, 242, 0.22)');
        lampGradient.addColorStop(0.48, 'rgba(255, 235, 195, 0.08)');
        lampGradient.addColorStop(1, 'rgba(180, 120, 60, 0.0)');
        ctx.fillStyle = lampGradient;
        ctx.fillRect(0, 0, w, h);
      } else {
        // Parchment linen kelir fallback
        ctx.fillStyle = '#F5EADB';
        ctx.fillRect(0, 0, w, h);
        const lampX = w * 0.5;
        const lampY = h * 0.20;
        const lampRadius = Math.max(w, h) * 0.65 * state.blencongFlicker;
        const lampGradient = ctx.createRadialGradient(lampX, lampY, 30, lampX, lampY, lampRadius);
        lampGradient.addColorStop(0, 'rgba(255, 253, 245, 0.98)');
        lampGradient.addColorStop(0.28, 'rgba(248, 238, 218, 0.82)');
        lampGradient.addColorStop(0.62, 'rgba(228, 203, 162, 0.55)');
        lampGradient.addColorStop(1, 'rgba(185, 142, 95, 0.35)');
        ctx.fillStyle = lampGradient;
        ctx.fillRect(0, 0, w, h);
      }
    }

    // 4. Update Kinematics for Both Puppets
    updatePuppetKinematics(state.gatotkaca, true, beatPulse);
    if (state.puppetCount !== 'one') {
      updatePuppetKinematics(state.arjuna, false, beatPulse);
    }

    // 5. Kiprahan Dance offsets when dancing
    let danceOffsetYLeft = 0;
    let danceOffsetYRight = 0;
    let danceAngleLeft = 0;
    let danceAngleRight = 0;

    if (state.isDancing) {
      const t = performance.now();
      const wave = Math.sin(t * 0.007);
      danceOffsetYLeft = (wave * 12) - (beatPulse * 16);
      danceOffsetYRight = (-wave * 12) - (beatPulse * 16);
      danceAngleLeft = Math.cos(t * 0.006) * 0.07;
      danceAngleRight = -Math.cos(t * 0.006) * 0.07;
    }

    // 6. Draw Both Puppets Facing Center
    drawPuppet(ctx, state.gatotkaca, true, danceOffsetYLeft, danceAngleLeft);
    if (state.puppetCount !== 'one') {
      drawPuppet(ctx, state.arjuna, false, danceOffsetYRight, danceAngleRight);
    }

    // 7. Update & Draw Particles
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

    // Process Hand Positions & Articulated Kinematic Targets
    function mapHandToPuppet(puppet, lm, sW, sH, bMinX, bMaxX, bMinY, bMaxY, isLeft) {
      const now = performance.now();
      const palm = getPalmCenter(lm);
      const normX = 1.0 - palm.x;
      const normY = palm.y;

      let rawTargetX;
      if (isLeft) {
        rawTargetX = clamp(normX * 1.6 * sW, bMinX, sW * 0.52);
      } else {
        rawTargetX = clamp((normX - 0.2) * 1.6 * sW, sW * 0.48, bMaxX);
      }
      const rawTargetY = clamp(normY * sH, bMinY, bMaxY);
      const rawTargetAngle = calculateHandTilt(lm);

      // 1-Euro Adaptive Low-Pass Filter: Zero jitter when stationary, zero lag when moving
      puppet.targetX = puppet.filters.x.filter(rawTargetX, now);
      puppet.targetY = puppet.filters.y.filter(rawTargetY, now);
      puppet.targetAngle = puppet.filters.angle.filter(rawTargetAngle, now);

      // Schmitt trigger for pinch prevents boundary flickering
      puppet.isPinching = checkPinchGesture(lm, puppet.isPinching);

      // Configurable finger landmark mapping from user settings
      let frontTipIdx = 8; // Index tip
      let rearTipIdx = 4;  // Thumb tip
      if (state.fingerMap === 'thumb-pinky') {
        frontTipIdx = 20; // Pinky tip
        rearTipIdx = 4;   // Thumb tip
      } else if (state.fingerMap === 'index-pinky') {
        frontTipIdx = 8;  // Index tip
        rearTipIdx = 20;  // Pinky tip
      }

      // Front Arm: Driven by chosen front finger relative to palm
      const fTip = lm[frontTipIdx];
      const fTipX = 1.0 - fTip.x;
      const fTipY = fTip.y;
      const dIdxX = fTipX - normX;
      const dIdxY = fTipY - normY;
      const forwardSign = isLeft ? 1 : -1;
      const rawFArmX = 200 + clamp(dIdxX * forwardSign * 700, -90, 160);
      const rawFArmY = -120 + clamp(dIdxY * 600, -180, 120);
      puppet.frontArm.targetX = puppet.filters.frontArmX.filter(rawFArmX, now);
      puppet.frontArm.targetY = puppet.filters.frontArmY.filter(rawFArmY, now);

      // Rear Arm: Driven by chosen rear finger relative to palm
      const rTip = lm[rearTipIdx];
      const rTipX = 1.0 - rTip.x;
      const rTipY = rTip.y;
      const dThX = rTipX - normX;
      const dThY = rTipY - normY;
      const rawRArmX = 90 + clamp(dThX * forwardSign * 500, -70, 100);
      const rawRArmY = -220 + clamp(dThY * 500, -120, 120);
      puppet.rearArm.targetX = puppet.filters.rearArmX.filter(rawRArmX, now);
      puppet.rearArm.targetY = puppet.filters.rearArmY.filter(rawRArmY, now);

      puppet.lastTrackingTime = now;
      puppet.isTrackingActive = true;

      if (puppet.isPinching) {
        emitParticles(puppet.currentX, puppet.currentY, 2);
      }
    }

    if (count === 1) {
      const lm = landmarksList[0];
      const palmCenter = getPalmCenter(lm);
      const normX = 1.0 - palmCenter.x;

      // Spatial Hysteresis: Prevent rapid puppet swapping when hovering near stage center
      let targetPuppet = state.lastSingleHandTarget;
      if (!targetPuppet) {
        targetPuppet = normX < 0.50 ? 'gatotkaca' : 'arjuna';
      } else if (targetPuppet === 'gatotkaca' && normX > 0.56) {
        targetPuppet = 'arjuna';
      } else if (targetPuppet === 'arjuna' && normX < 0.44) {
        targetPuppet = 'gatotkaca';
      }
      state.lastSingleHandTarget = targetPuppet;

      if (state.puppetCount === 'one') {
        mapHandToPuppet(state.gatotkaca, lm, stageW, stageH, minX, maxX, minY, maxY, true);
      } else {
        if (targetPuppet === 'gatotkaca') {
          mapHandToPuppet(state.gatotkaca, lm, stageW, stageH, minX, stageW * 0.55, minY, maxY, true);
        } else {
          mapHandToPuppet(state.arjuna, lm, stageW, stageH, stageW * 0.45, maxX, minY, maxY, false);
        }
      }

      // Detect pinky-finger Kiprahan dance gesture
      if (checkPinkyDanceGesture(lm) && !state.isDancing) {
        state.isDancing = true;
        showToast('Tari Kiprahan Aktif (Gestur Jari Kelingking)');
      }
    } else if (count >= 2) {
      state.lastSingleHandTarget = null;
      const handA = { lm: landmarksList[0], normX: 1.0 - getPalmCenter(landmarksList[0]).x };
      const handB = { lm: landmarksList[1], normX: 1.0 - getPalmCenter(landmarksList[1]).x };
      const leftHand = handA.normX <= handB.normX ? handA.lm : handB.lm;
      const rightHand = handA.normX > handB.normX ? handA.lm : handB.lm;

      if (state.puppetCount === 'one') {
        // Dual-hand control of single puppet: Left hand = body/rear arm, Right hand = front arm
        mapHandToPuppet(state.gatotkaca, leftHand, stageW, stageH, minX, maxX, minY, maxY, true);
        const rPalm = getPalmCenter(rightHand);
        const rNormX = 1.0 - rPalm.x;
        const rNormY = rPalm.y;
        const rIdxX = 1.0 - rightHand[8].x;
        const rIdxY = rightHand[8].y;
        const dX = rIdxX - rNormX;
        const dY = rIdxY - rNormY;
        const now = performance.now();
        state.gatotkaca.frontArm.targetX = state.gatotkaca.filters.frontArmX.filter(200 + clamp(dX * 800, -120, 180), now);
        state.gatotkaca.frontArm.targetY = state.gatotkaca.filters.frontArmY.filter(-120 + clamp(dY * 700, -200, 140), now);
      } else {
        mapHandToPuppet(state.gatotkaca, leftHand, stageW, stageH, minX, stageW * 0.52, minY, maxY, true);
        mapHandToPuppet(state.arjuna, rightHand, stageW, stageH, stageW * 0.48, maxX, minY, maxY, false);
      }

      if ((checkPinkyDanceGesture(leftHand) || checkPinkyDanceGesture(rightHand)) && !state.isDancing) {
        state.isDancing = true;
        showToast('Tari Kiprahan Aktif (Gestur Jari Kelingking)');
      }
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

  // Schmitt trigger for pinch gesture prevents fluttering at threshold boundary
  function checkPinchGesture(landmarks, isCurrentlyPinching = false) {
    if (!landmarks || landmarks.length < 9) return false;
    const dx = landmarks[4].x - landmarks[8].x;
    const dy = landmarks[4].y - landmarks[8].y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return isCurrentlyPinching ? (dist < CONFIG.pinchThreshold + 0.020) : (dist < CONFIG.pinchThreshold);
  }

  // Cultural dalang gesture: Pinky finger extended alone triggers Kiprahan dance
  function checkPinkyDanceGesture(lm) {
    if (!lm || lm.length < 21) return false;
    const w = lm[0];
    const dPinky = Math.hypot(lm[20].x - w.x, lm[20].y - w.y);
    const dPinkyPip = Math.hypot(lm[18].x - w.x, lm[18].y - w.y);
    const dRing = Math.hypot(lm[16].x - w.x, lm[16].y - w.y);
    const dRingPip = Math.hypot(lm[14].x - w.x, lm[14].y - w.y);
    const dMid = Math.hypot(lm[12].x - w.x, lm[12].y - w.y);
    const dMidPip = Math.hypot(lm[10].x - w.x, lm[10].y - w.y);
    const dIdx = Math.hypot(lm[8].x - w.x, lm[8].y - w.y);
    const dIdxPip = Math.hypot(lm[6].x - w.x, lm[6].y - w.y);

    const pinkyExtended = dPinky > dPinkyPip * 1.18;
    const ringCurled = dRing < dRingPip * 1.08;
    const midCurled = dMid < dMidPip * 1.08;
    const idxCurled = dIdx < dIdxPip * 1.16;

    return pinkyExtended && ringCurled && midCurled && idxCurled;
  }

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  // --- UI Status Indicator Management ---
  function updateStatusBadge(handCount) {
    if (!state.isActive) {
      if (els.statusDot) els.statusDot.className = 'status-dot';
      if (els.statusText) els.statusText.textContent = 'Kamera Belum Aktif';
      if (els.statusTextDirect) els.statusTextDirect.textContent = 'Siap Dimainkan';
      if (els.statusPill) { els.statusPill.classList.remove('active', 'error'); }
      if (els.handCountBadge) els.handCountBadge.style.display = 'none';
      return;
    }

    if (state.isSimulationMode) {
      if (els.statusDot) els.statusDot.className = 'status-dot active';
      if (els.statusText) els.statusText.textContent = 'Mode Simulasi Kursor Aktif';
      if (els.statusTextDirect) els.statusTextDirect.textContent = 'Simulasi Kursor Aktif';
      if (els.statusPill) { els.statusPill.classList.add('active'); els.statusPill.classList.remove('error'); }
      if (els.handCountBadge) {
        els.handCountBadge.style.display = 'inline-block';
        els.handCountBadge.textContent = 'Kontrol Kursor';
      }
      return;
    }

    if (handCount === 0) {
      if (els.statusDot) els.statusDot.className = 'status-dot detecting';
      if (els.statusText) els.statusText.textContent = 'Mencari Tangan di Depan Kamera...';
      if (els.statusTextDirect) els.statusTextDirect.textContent = 'Mencari Tangan...';
      if (els.statusPill) { els.statusPill.classList.remove('active', 'error'); }
      if (els.handCountBadge) {
        els.handCountBadge.style.display = 'inline-block';
        els.handCountBadge.textContent = '0 Tangan';
      }
      if (els.pipGuideText) els.pipGuideText.textContent = 'Arahkan telapak tangan ke kamera';
    } else if (handCount === 1) {
      if (els.statusDot) els.statusDot.className = 'status-dot active';
      if (els.statusText) els.statusText.textContent = '1 Tangan Terdeteksi — Tokoh Mengikuti Gerakan';
      if (els.statusTextDirect) els.statusTextDirect.textContent = '1 Tangan Terdeteksi';
      if (els.statusPill) { els.statusPill.classList.add('active'); els.statusPill.classList.remove('error'); }
      if (els.handCountBadge) {
        els.handCountBadge.style.display = 'inline-block';
        els.handCountBadge.textContent = '1 Tangan';
      }
      if (els.pipGuideText) els.pipGuideText.textContent = 'Angkat kedua tangan untuk kendali penuh';
    } else {
      if (els.statusDot) els.statusDot.className = 'status-dot active';
      const label = state.characterMode === 'reference' ? 'Dua Wayang Siap!' : 'Gatotkaca & Arjuna Siap!';
      if (els.statusText) els.statusText.textContent = `2 Tangan Terdeteksi — ${label}`;
      if (els.statusTextDirect) els.statusTextDirect.textContent = '2 Tangan Siap';
      if (els.statusPill) { els.statusPill.classList.add('active'); els.statusPill.classList.remove('error'); }
      if (els.handCountBadge) {
        els.handCountBadge.style.display = 'inline-block';
        els.handCountBadge.textContent = '2 Tangan';
      }
      if (els.pipGuideText) els.pipGuideText.textContent = 'Kedua wayang terhubung!';
    }
  }

  // --- MediaPipe Hands Initialization ---
  async function initMediaPipeHands() {
    if (state.handsInstance) return state.handsInstance;

    els.loadingStepText.textContent = 'Memuat modul kecerdasan buatan MediaPipe Hands...';

    if (typeof window.Hands === 'undefined') {
      throw new Error('Pustaka MediaPipe Hands tidak dapat dimuat dari CDN. Periksa koneksi internet Anda.');
    }

    const hands = new window.Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.60,
      minTrackingConfidence: 0.55,
    });

    hands.onResults(onResults);
    state.handsInstance = hands;
    return hands;
  }

  // --- Managed Video Tracking Loop Engine ---
  let isTrackingFrameBusy = false;
  let videoTrackingCallbackId = null;

  function startVideoTrackingLoop(hands) {
    cancelVideoTrackingLoop();

    const processFrame = async () => {
      if (!state.isActive || !state.isCameraRunning) return;

      const video = els.webcamVideo;
      if (
        video &&
        !video.paused &&
        !video.ended &&
        video.readyState >= 2 &&
        video.videoWidth > 0 &&
        video.videoHeight > 0
      ) {
        if (!isTrackingFrameBusy) {
          isTrackingFrameBusy = true;
          try {
            await hands.send({ image: video });
          } catch (err) {
            console.warn('MediaPipe hands.send error:', err);
          } finally {
            isTrackingFrameBusy = false;
          }
        }
      }

      if (state.isActive && state.isCameraRunning && video) {
        if ('requestVideoFrameCallback' in video) {
          videoTrackingCallbackId = video.requestVideoFrameCallback(processFrame);
        } else {
          videoTrackingCallbackId = requestAnimationFrame(processFrame);
        }
      }
    };

    if ('requestVideoFrameCallback' in els.webcamVideo) {
      videoTrackingCallbackId = els.webcamVideo.requestVideoFrameCallback(processFrame);
    } else {
      videoTrackingCallbackId = requestAnimationFrame(processFrame);
    }
  }

  function cancelVideoTrackingLoop() {
    if (videoTrackingCallbackId !== null) {
      if (els.webcamVideo && 'cancelVideoFrameCallback' in els.webcamVideo) {
        try {
          els.webcamVideo.cancelVideoFrameCallback(videoTrackingCallbackId);
        } catch (e) {}
      }
      cancelAnimationFrame(videoTrackingCallbackId);
      videoTrackingCallbackId = null;
    }
    isTrackingFrameBusy = false;
  }

  // --- Camera Lifecycle ---
  async function startExperience() {
    try {
      els.overlayIntro.classList.add('hidden', 'gone');
      els.overlayError.classList.add('hidden');
      els.overlayLoading.classList.remove('hidden');
      els.loadingStepText.textContent = 'Menghubungkan ke kamera webcam Anda...';

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Peramban Anda tidak mendukung akses webcam atau WebRTC.');
      }

      // Stop any existing streams first to prevent hardware device contention
      stopCameraTracks();

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user',
          },
          audio: false,
        });
      } catch (prefErr) {
        if (prefErr.name === 'NotAllowedError' || prefErr.name === 'PermissionDeniedError') {
          throw new Error('Izin kamera ditolak. Mohon berikan izin webcam di peramban Anda untuk memainkan wayang.');
        } else if (prefErr.name === 'NotFoundError' || prefErr.name === 'DevicesNotFoundError') {
          throw new Error('Perangkat webcam tidak ditemukan. Pastikan kamera terpasang.');
        } else if (prefErr.name === 'NotReadableError' || prefErr.name === 'TrackStartError') {
          throw new Error('Kamera sedang digunakan aplikasi lain. Tutup aplikasi yang menggunakan webcam dan coba lagi.');
        }
        console.warn('Preferred constraints failed, trying basic video: true fallback', prefErr);
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        } catch (basicErr) {
          if (basicErr.name === 'NotAllowedError' || basicErr.name === 'PermissionDeniedError') {
            throw new Error('Izin kamera ditolak. Mohon izinkan akses webcam pada bilah alamat peramban Anda.');
          }
          throw basicErr;
        }
      }

      state.mediaStream = stream;
      const video = els.webcamVideo;
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;

      // Wait until video stream is actively playing with valid dimensions
      els.loadingStepText.textContent = 'Menyelaraskan umpan video kamera...';

      try {
        await video.play();
      } catch (playErr) {
        console.warn('Initial video.play() notice:', playErr);
      }

      await new Promise((resolve) => {
        if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
          resolve();
          return;
        }

        let isDone = false;
        const onReady = () => {
          if (!isDone && video.videoWidth > 0 && video.videoHeight > 0) {
            isDone = true;
            video.removeEventListener('loadeddata', onReady);
            video.removeEventListener('canplay', onReady);
            video.removeEventListener('playing', onReady);
            resolve();
          }
        };

        video.addEventListener('loadeddata', onReady);
        video.addEventListener('canplay', onReady);
        video.addEventListener('playing', onReady);

        setTimeout(() => {
          if (!isDone) {
            isDone = true;
            video.removeEventListener('loadeddata', onReady);
            video.removeEventListener('canplay', onReady);
            video.removeEventListener('playing', onReady);
            resolve();
          }
        }, 3000);
      });

      // Synchronize landmark canvas internal resolution to match actual video feed
      if (els.webcamCanvas && video.videoWidth > 0 && video.videoHeight > 0) {
        els.webcamCanvas.width = video.videoWidth;
        els.webcamCanvas.height = video.videoHeight;
      }

      // Initialize the hand-tracking model ONLY after video stream is ready
      els.loadingStepText.textContent = 'Menyiapkan modul pelacakan tangan MediaPipe Hands...';
      const hands = await initMediaPipeHands();

      state.isActive = true;
      state.isCameraRunning = true;
      state.isSimulationMode = false;

      // Start Managed Frame Tracking Loop
      startVideoTrackingLoop(hands);

      // Update UI state
      els.overlayLoading.classList.add('hidden');
      if (els.btnStop) els.btnStop.style.display = 'inline-flex';
      updateStatusBadge(0);
      gamelanAudio.play();
      showToast('Wayang Motion Aktif — Gerakkan tangan di depan kamera');

    } catch (err) {
      console.warn('Wayang Motion: Camera error / permission issue:', err);
      stopCameraTracks();
      els.overlayLoading.classList.add('hidden');
      els.overlayError.classList.remove('hidden');
      els.errorMessageText.textContent = 
        `Gagal menghubungkan kamera: ${err.message || 'Izin ditolak atau kamera tidak ditemukan.'} Anda dapat mencoba menghubungkan kembali atau bermain menggunakan kursor.`;
      if (els.statusDot) els.statusDot.className = 'status-dot error';
      if (els.statusText) els.statusText.textContent = 'Kamera Gagal Dihubungkan';
      if (els.statusTextDirect) els.statusTextDirect.textContent = 'Gagal Kamera';
      if (els.statusPill) { els.statusPill.classList.add('error'); }
    }
  }

  function stopCameraTracks() {
    cancelVideoTrackingLoop();

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
      try {
        els.webcamVideo.pause();
      } catch (e) {}
      els.webcamVideo.srcObject = null;
    }
    if (els.webcamCtx && els.webcamCanvas) {
      els.webcamCtx.clearRect(0, 0, els.webcamCanvas.width, els.webcamCanvas.height);
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
    if (els.btnStop) els.btnStop.style.display = 'none';
    els.overlayIntro.classList.remove('hidden', 'gone');
    els.overlayLoading.classList.add('hidden');
    els.overlayError.classList.add('hidden');
    initPuppetPositions();
    updateStatusBadge(0);
    gamelanAudio.pause();
    showToast('Sesi Wayang dihentikan');
  }

  // --- Interactive Simulation Mode (Fallback when Camera is Denied / Unavailable) ---
  function startInteractiveSimulation() {
    stopCameraTracks();
    state.isActive = true;
    state.isCameraRunning = false;
    state.isSimulationMode = true;

    els.overlayIntro.classList.add('hidden', 'gone');
    els.overlayLoading.classList.add('hidden');
    els.overlayError.classList.add('hidden');
    if (els.btnStop) els.btnStop.style.display = 'inline-flex';

    updateStatusBadge(1);
    gamelanAudio.play();
    showToast('Mode Simulasi Kursor Aktif — Geser atau klik panggung');
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

          const relX = x - state.gatotkaca.currentX;
          const relY = y - state.gatotkaca.currentY;
          state.gatotkaca.frontArm.targetX = clamp(200 + relX * 0.75, 110, 360);
          state.gatotkaca.frontArm.targetY = clamp(-100 + relY * 0.75, -280, 20);
          state.gatotkaca.rearArm.targetX = clamp(90 + relX * 0.35, 20, 190);
          state.gatotkaca.rearArm.targetY = clamp(-220 + relY * 0.35, -300, -100);
          state.gatotkaca.lastPointerTime = performance.now();
        } else {
          state.arjuna.targetX = clamp(x, canvas.width * 0.48, canvas.width - CONFIG.stagePaddingX);
          state.arjuna.targetY = clamp(y, CONFIG.stagePaddingY + 70, canvas.height - CONFIG.stagePaddingY);
          state.arjuna.targetAngle = (x - canvas.width * 0.72) * 0.0008;

          const relX = x - state.arjuna.currentX;
          const relY = y - state.arjuna.currentY;
          state.arjuna.frontArm.targetX = clamp(200 - relX * 0.75, 110, 360);
          state.arjuna.frontArm.targetY = clamp(-100 + relY * 0.75, -280, 20);
          state.arjuna.rearArm.targetX = clamp(90 - relX * 0.35, 20, 190);
          state.arjuna.rearArm.targetY = clamp(-220 + relY * 0.35, -300, -100);
          state.arjuna.lastPointerTime = performance.now();
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

    // Interactive Simulation Buttons (Intro and Error Fallback)
    if (els.btnInteractive) {
      els.btnInteractive.addEventListener('click', startInteractiveSimulation);
    }
    const btnInteractiveIntro = document.getElementById('btn-start-interactive-intro');
    if (btnInteractiveIntro) {
      btnInteractiveIntro.addEventListener('click', startInteractiveSimulation);
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

    // Sound Toggle Button
    if (els.soundToggle) {
      els.soundToggle.addEventListener('click', () => {
        gamelanAudio.toggle();
      });
    }

    // Settings Drawer Controls
    function openSettings() {
      if (!els.settingsDrawer) return;
      els.settingsDrawer.hidden = false;
      els.settingsDrawer.classList.add('open');
      if (els.settingsToggle) els.settingsToggle.setAttribute('aria-expanded', 'true');
    }

    function closeSettings() {
      if (!els.settingsDrawer) return;
      els.settingsDrawer.hidden = true;
      els.settingsDrawer.classList.remove('open');
      if (els.settingsToggle) els.settingsToggle.setAttribute('aria-expanded', 'false');
    }

    if (els.settingsToggle) {
      els.settingsToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (els.settingsDrawer && !els.settingsDrawer.hidden) {
          closeSettings();
        } else {
          openSettings();
        }
      });
    }

    if (els.btnCloseSettings) {
      els.btnCloseSettings.addEventListener('click', () => {
        closeSettings();
      });
    }

    // Click outside settings drawer to close
    document.addEventListener('click', (e) => {
      if (els.settingsDrawer && !els.settingsDrawer.hidden) {
        if (!els.settingsDrawer.contains(e.target) && !els.settingsToggle.contains(e.target)) {
          closeSettings();
        }
      }
    });

    // Option: Characters Count
    if (els.optCharacters) {
      els.optCharacters.addEventListener('change', (e) => {
        state.puppetCount = e.target.value;
        showToast(state.puppetCount === 'one' ? 'Satu Tokoh (Kedua tangan mengendalikan 1 wayang)' : 'Dua Tokoh (Satu per tangan)');
      });
    }

    // Option: Finger Landmark Mapping
    if (els.optFingers) {
      els.optFingers.addEventListener('change', (e) => {
        state.fingerMap = e.target.value;
        showToast(`Tuding Lengan: ${e.target.options[e.target.selectedIndex].text}`);
      });
    }

    // Option: Facing Mode
    if (els.optFacing) {
      els.optFacing.addEventListener('change', (e) => {
        state.facingMode = e.target.value;
        if (state.facingMode === 'target') {
          state.leftFlipped = false;
          state.rightFlipped = true;
        }
        showToast(`Arah Hadap: ${e.target.options[e.target.selectedIndex].text}`);
      });
    }

    // Option: Camera Toggle Checkbox
    if (els.optCamera) {
      els.optCamera.addEventListener('change', (e) => {
        state.pipVisible = e.target.checked;
        if (els.webcamPipCard) els.webcamPipCard.classList.toggle('hidden', !state.pipVisible);
        showToast(state.pipVisible ? 'Pratinjau kamera aktif' : 'Pratinjau kamera disembunyikan');
      });
    }

    // Option: Puppet Size Slider
    if (els.optSize) {
      els.optSize.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        state.puppetSizeMultiplier = val / 0.55;
      });
    }

    // Option: Music Volume Slider
    if (els.optVolume) {
      els.optVolume.addEventListener('input', (e) => {
        gamelanAudio.setVolume(parseFloat(e.target.value));
      });
    }

    // Popout Preview Button
    if (els.previewPopout) {
      els.previewPopout.addEventListener('click', () => {
        showToast('Jendela pop-out pratinjau kamera disimulasikan');
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

    // Hotkeys Handler (Matching Primary Reference Website)
    window.addEventListener('keydown', (e) => {
      // Ignore hotkeys when actively typing inside form inputs
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const key = e.key.toUpperCase();

      if (key === 'D') {
        state.isDancing = !state.isDancing;
        showToast(state.isDancing ? 'Tari Kiprahan Aktif (Beat Gamelan)' : 'Tari Kiprahan Selesai');
      } else if (key === 'F') {
        state.leftFlipped = !state.leftFlipped;
        showToast('Arah hadap wayang kiri dibalik');
      } else if (key === 'G') {
        state.rightFlipped = !state.rightFlipped;
        showToast('Arah hadap wayang kanan dibalik');
      } else if (key === 'H') {
        document.body.classList.toggle('ui-hidden');
        const isHidden = document.body.classList.contains('ui-hidden');
        showToast(isHidden ? 'Antarmuka disembunyikan (Tekan H untuk kembali)' : 'Antarmuka ditampilkan');
      } else if (key === 'C') {
        initPuppetPositions();
        showToast('Posisi wayang dikalibrasi ulang');
      } else if (key === 'V') {
        state.pipVisible = !state.pipVisible;
        if (els.webcamPipCard) els.webcamPipCard.classList.toggle('hidden', !state.pipVisible);
        if (els.optCamera) els.optCamera.checked = state.pipVisible;
        showToast(state.pipVisible ? 'Pratinjau kamera aktif' : 'Pratinjau kamera disembunyikan');
      } else if (key === 'P') {
        if (els.previewPopout) els.previewPopout.click();
      } else if (key === 'M') {
        gamelanAudio.toggle();
      } else if (e.key === 'Escape') {
        if (els.settingsDrawer && !els.settingsDrawer.hidden) {
          closeSettings();
        } else if (els.guideModal && els.guideModal.classList.contains('open')) {
          els.guideModal.classList.remove('open');
        } else if (state.isFullscreen || state.isFullscreenFallback) {
          if (state.isFullscreenFallback) exitFullscreenFallback();
          else toggleFullscreen();
        }
      }
    });

    // Cleanup Camera on page unload / navigation
    window.addEventListener('beforeunload', stopCameraTracks);
    window.addEventListener('pagehide', stopCameraTracks);
  }

  // --- Initial Mount ---
  async function init() {
    setCharacterMode('reference');
    initPuppetPositions();
    setupEventListeners();
    setupPointerHandlers();
    await gamelanAudio.init();
    renderLoop();
    console.log('Wayang Motion initialized successfully with reference wayang asset, gamelan audio & fullscreen support.');
  }

  // Boot on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/**
 * ==========================================================================
 * KARSA POTRET — WAYANG MOTION CONTROLLER
 * Real-time Hand-Tracking Puppet Interaction using MediaPipe Hands
 * ==========================================================================
 */

(function () {
  'use strict';

  // --- Configuration & Constants ---
  const CONFIG = {
    lerpFactor: 0.18,          // Smooth interpolation speed (0.1 = slow/fluid, 0.3 = snappy)
    maxRotationDeg: 22,        // Max tilt angle for puppets in degrees
    pinchThreshold: 0.065,     // Normalized distance between thumb & index for gesture
    stagePaddingX: 80,         // Stage left/right horizontal boundary margin
    stagePaddingY: 60,         // Stage top/bottom vertical boundary margin
    defaultGatotkacaXRatio: 0.30,
    defaultGatotkacaYRatio: 0.52,
    defaultArjunaXRatio: 0.70,
    defaultArjunaYRatio: 0.54,
  };

  // --- DOM Elements ---
  const els = {
    canvas: document.getElementById('kelir-canvas'),
    ctx: null,
    blencongLight: document.getElementById('blencong-light'),
    stageViewport: document.getElementById('stage-viewport'),
    statusDot: document.getElementById('status-dot'),
    statusText: document.getElementById('tracking-status-text'),
    handCountBadge: document.getElementById('hand-count-badge'),
    btnStart: document.getElementById('btn-start-motion'),
    btnStop: document.getElementById('btn-stop-camera'),
    btnReset: document.getElementById('btn-reset-puppets'),
    btnTogglePip: document.getElementById('btn-toggle-pip'),
    btnToggleShadow: document.getElementById('btn-toggle-shadow'),
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
  };

  if (!els.canvas) {
    console.error('Wayang Motion: Canvas element not found.');
    return;
  }

  els.ctx = els.canvas.getContext('2d');
  if (els.webcamCanvas) {
    els.webcamCtx = els.webcamCanvas.getContext('2d');
  }

  // --- Images for Puppets ---
  const puppetAssets = {
    gatotkaca: {
      img: new Image(),
      loaded: false,
      src: 'assets/images/wayang-gatotkaca.png',
      aspectRatio: 765 / 1136,
    },
    arjuna: {
      img: new Image(),
      loaded: false,
      src: 'assets/images/wayang-arjuna.png',
      aspectRatio: 559 / 1129,
    },
  };

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
    pipVisible: true,
    pipMinimized: false,
    handsInstance: null,
    cameraInstance: null,
    mediaStream: null,
    detectedHandsCount: 0,
    activePointerDragging: null, // For mouse/touch interactive simulation
    blencongFlicker: 1.0,
    particles: [],
    // Puppet States
    gatotkaca: {
      name: 'Raden Gatotkaca',
      targetX: 0,
      targetY: 0,
      targetAngle: 0,
      currentX: 0,
      currentY: 0,
      currentAngle: 0,
      scale: 0.42,
      baseHeight: 460,
      isPinching: false,
      lastSeen: 0,
    },
    arjuna: {
      name: 'Raden Arjuna',
      targetX: 0,
      targetY: 0,
      targetAngle: 0,
      currentX: 0,
      currentY: 0,
      currentAngle: 0,
      scale: 0.42,
      baseHeight: 460,
      isPinching: false,
      lastSeen: 0,
    },
  };

  // --- Initialize Puppet Coordinate Bounds ---
  function initPuppetPositions() {
    const w = els.canvas.width;
    const h = els.canvas.height;

    state.gatotkaca.targetX = w * CONFIG.defaultGatotkacaXRatio;
    state.gatotkaca.targetY = h * CONFIG.defaultGatotkacaYRatio;
    state.gatotkaca.currentX = state.gatotkaca.targetX;
    state.gatotkaca.currentY = state.gatotkaca.targetY;
    state.gatotkaca.targetAngle = 0;
    state.gatotkaca.currentAngle = 0;

    state.arjuna.targetX = w * CONFIG.defaultArjunaXRatio;
    state.arjuna.targetY = h * CONFIG.defaultArjunaYRatio;
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
        color: Math.random() > 0.4 ? '#D4AF37' : '#F4E0A5',
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
  function drawPuppet(ctx, puppet, asset, isFlipped = false) {
    if (!asset.loaded) return;

    const w = puppet.baseHeight * asset.aspectRatio;
    const h = puppet.baseHeight;

    ctx.save();
    ctx.translate(puppet.currentX, puppet.currentY);
    ctx.rotate(puppet.currentAngle);

    // Puppet stick (Tuding) extending downwards to banana trunk base (Debog)
    ctx.save();
    ctx.strokeStyle = '#2B1E12';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.45);
    ctx.lineTo(0, h * 0.95);
    ctx.stroke();
    // Tuding handle ring
    ctx.fillStyle = '#8C6F23';
    ctx.beginPath();
    ctx.arc(0, h * 0.7, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Traditional Shadow behind the puppet on the Kelir screen
    ctx.save();
    ctx.shadowColor = state.shadowMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(0, 0, 0, 0.65)';
    ctx.shadowBlur = state.shadowMode ? 28 : 18;
    ctx.shadowOffsetX = isFlipped ? -12 : 12;
    ctx.shadowOffsetY = 14;

    // Filter for Shadow mode vs Full color mode
    if (state.shadowMode) {
      // Silhouette shadow puppet look
      ctx.filter = 'brightness(0.08) drop-shadow(0 0 10px rgba(0,0,0,0.8))';
    }

    if (isFlipped) {
      ctx.scale(-1, 1);
    }

    ctx.drawImage(asset.img, -w / 2, -h / 2, w, h);
    ctx.restore();

    // Pulse aura when gesture / pinch is triggered
    if (puppet.isPinching) {
      ctx.save();
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.65)';
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
    state.blencongFlicker = Math.max(0.92, Math.min(1.08, state.blencongFlicker));

    // Dynamic Blencong warm ambient background
    const lampX = w * 0.5;
    const lampY = h * 0.22;
    const lampGradient = ctx.createRadialGradient(
      lampX, lampY, 30,
      lampX, lampY, w * 0.65 * state.blencongFlicker
    );

    if (state.shadowMode) {
      lampGradient.addColorStop(0, 'rgba(255, 248, 230, 0.92)');
      lampGradient.addColorStop(0.35, 'rgba(240, 222, 185, 0.65)');
      lampGradient.addColorStop(0.7, 'rgba(60, 45, 25, 0.85)');
      lampGradient.addColorStop(1, 'rgba(15, 12, 10, 0.98)');
    } else {
      lampGradient.addColorStop(0, 'rgba(255, 235, 170, 0.22)');
      lampGradient.addColorStop(0.4, 'rgba(212, 175, 55, 0.08)');
      lampGradient.addColorStop(0.8, 'rgba(12, 16, 22, 0.7)');
      lampGradient.addColorStop(1, 'rgba(6, 8, 11, 0.95)');
    }

    ctx.fillStyle = lampGradient;
    ctx.fillRect(0, 0, w, h);

    // 3. Smooth Puppet Movement Interpolation (Lerp / Exponential smoothing)
    const lerp = CONFIG.lerpFactor;

    // Gatotkaca
    state.gatotkaca.currentX += (state.gatotkaca.targetX - state.gatotkaca.currentX) * lerp;
    state.gatotkaca.currentY += (state.gatotkaca.targetY - state.gatotkaca.currentY) * lerp;
    state.gatotkaca.currentAngle += (state.gatotkaca.targetAngle - state.gatotkaca.currentAngle) * lerp;

    // Arjuna
    state.arjuna.currentX += (state.arjuna.targetX - state.arjuna.currentX) * lerp;
    state.arjuna.currentY += (state.arjuna.targetY - state.arjuna.currentY) * lerp;
    state.arjuna.currentAngle += (state.arjuna.targetAngle - state.arjuna.currentAngle) * lerp;

    // 4. Draw Puppets
    // Gatotkaca is on the left facing right
    drawPuppet(ctx, state.gatotkaca, puppetAssets.gatotkaca, false);
    // Arjuna is on the right facing left
    drawPuppet(ctx, state.arjuna, puppetAssets.arjuna, false);

    // 5. Update & Draw Particles
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
              color: '#D4AF37',
              lineWidth: 2,
            });
          }
          if (window.drawLandmarks) {
            window.drawLandmarks(pCtx, landmarks, {
              color: '#F4E0A5',
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

    const stageW = els.canvas.width;
    const stageH = els.canvas.height;
    const minX = CONFIG.stagePaddingX;
    const maxX = stageW - CONFIG.stagePaddingX;
    const minY = CONFIG.stagePaddingY + 80;
    const maxY = stageH - CONFIG.stagePaddingY - 40;

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

      // If hand is on the left half of the frame -> Gatotkaca, else -> Arjuna
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
      // Hand 0 vs Hand 1: whichever has smaller (1 - x) is left, larger is right
      const handA = { lm: landmarksList[0], normX: 1.0 - getPalmCenter(landmarksList[0]).x };
      const handB = { lm: landmarksList[1], normX: 1.0 - getPalmCenter(landmarksList[1]).x };

      const leftHand = handA.normX <= handB.normX ? handA.lm : handB.lm;
      const rightHand = handA.normX > handB.normX ? handA.lm : handB.lm;

      // Control Gatotkaca with Left Hand
      const leftCenter = getPalmCenter(leftHand);
      const leftNormX = 1.0 - leftCenter.x;
      const leftNormY = leftCenter.y;
      state.gatotkaca.targetX = clamp(leftNormX * 1.6 * stageW, minX, stageW * 0.52);
      state.gatotkaca.targetY = clamp(leftNormY * stageH, minY, maxY);
      state.gatotkaca.targetAngle = calculateHandTilt(leftHand);
      state.gatotkaca.isPinching = checkPinchGesture(leftHand);
      if (state.gatotkaca.isPinching) emitParticles(state.gatotkaca.currentX, state.gatotkaca.currentY, 2);

      // Control Arjuna with Right Hand
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
      els.pipGuideText.textContent = 'Arahkan telapak tangan ke kamera';
    } else if (handCount === 1) {
      els.statusDot.className = 'status-dot active';
      els.statusText.textContent = '1 Tangan Terdeteksi — Tokoh Mengikuti Gerakan';
      els.handCountBadge.style.display = 'inline-block';
      els.handCountBadge.textContent = '1 Tangan Terdeteksi';
      els.pipGuideText.textContent = 'Angkat kedua tangan untuk kendali penuh';
    } else {
      els.statusDot.className = 'status-dot active';
      els.statusText.textContent = '2 Tangan Terdeteksi — Gatotkaca & Arjuna Siap!';
      els.handCountBadge.style.display = 'inline-block';
      els.handCountBadge.textContent = '2 Tangan Siap';
      els.pipGuideText.textContent = 'Kedua wayang terhubung!';
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
          state.gatotkaca.targetX = clamp(x, CONFIG.stagePaddingX, canvas.width * 0.5);
          state.gatotkaca.targetY = clamp(y, CONFIG.stagePaddingY + 80, canvas.height - CONFIG.stagePaddingY);
          state.gatotkaca.targetAngle = (x - canvas.width * 0.25) * 0.0008;
        } else {
          state.arjuna.targetX = clamp(x, canvas.width * 0.5, canvas.width - CONFIG.stagePaddingX);
          state.arjuna.targetY = clamp(y, CONFIG.stagePaddingY + 80, canvas.height - CONFIG.stagePaddingY);
          state.arjuna.targetAngle = (x - canvas.width * 0.75) * 0.0008;
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

    // Escape Key to Close Modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && els.guideModal && els.guideModal.classList.contains('open')) {
        els.guideModal.classList.remove('open');
      }
    });

    // Cleanup Camera on page unload / navigation
    window.addEventListener('beforeunload', stopCameraTracks);
    window.addEventListener('pagehide', stopCameraTracks);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && state.isCameraRunning) {
        // Pause or stop tracks if tab is hidden
      }
    });
  }

  // --- Initial Mount ---
  function init() {
    initPuppetPositions();
    setupEventListeners();
    setupPointerHandlers();
    renderLoop();
    console.log('Wayang Motion initialized successfully.');
  }

  // Boot on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

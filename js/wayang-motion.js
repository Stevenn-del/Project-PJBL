/**
 * ==========================================================================
 * KARSA POTRET — WAYANG MOTION DIGITAL KELIR CONTROLLER
 * High-End 3D Lamp-Lit Shadow Theater Engine & Articulated Kinematics
 * Reference: https://wayang-digital-indonesia.vercel.app/ & wayangmotionref
 * ==========================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. MATHEMATICAL & PHYSICS FOUNDATION
  // ==========================================================================
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smoothstep = (a, b, x) => {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };

  function wrapAngle(a) {
    while (a > Math.PI) a -= Math.PI * 2;
    while (a < -Math.PI) a += Math.PI * 2;
    return a;
  }

  // 2D Affine Matrix [a, b, c, d, e, f]: x' = a*x + c*y + e, y' = b*x + d*y + f
  const Affine = {
    identity: () => [1, 0, 0, 1, 0, 0],
    translate: (x, y) => [1, 0, 0, 1, x, y],
    rotate(t) {
      const c = Math.cos(t), s = Math.sin(t);
      return [c, s, -s, c, 0, 0];
    },
    scale: (sx, sy = sx) => [sx, 0, 0, sy, 0, 0],
    mul(m, n) {
      return [
        m[0] * n[0] + m[2] * n[1],
        m[1] * n[0] + m[3] * n[1],
        m[0] * n[2] + m[2] * n[3],
        m[1] * n[2] + m[3] * n[3],
        m[0] * n[4] + m[2] * n[5] + m[4],
        m[1] * n[4] + m[3] * n[5] + m[5],
      ];
    },
    chain(...ms) {
      return ms.reduce((acc, m) => Affine.mul(acc, m));
    },
    apply(m, x, y) {
      return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
    },
    invert(m) {
      const det = m[0] * m[3] - m[1] * m[2];
      const id = 1 / (det || 1e-9);
      return [
        m[3] * id, -m[1] * id, -m[2] * id, m[0] * id,
        (m[2] * m[5] - m[3] * m[4]) * id,
        (m[1] * m[4] - m[0] * m[5]) * id,
      ];
    },
  };

  // Damped Harmonic Oscillator (Spring) with Semi-Implicit Euler Integration
  class Spring {
    constructor(x = 0, k = 100, zeta = 1) {
      this.x = x;
      this.v = 0;
      this.k = k;
      this.zeta = zeta;
    }
    step(target, dt) {
      const c = 2 * this.zeta * Math.sqrt(this.k);
      this.v += (this.k * (target - this.x) - c * this.v) * dt;
      this.x += this.v * dt;
      return this.x;
    }
    stepAngle(target, dt) {
      const c = 2 * this.zeta * Math.sqrt(this.k);
      this.v += (this.k * wrapAngle(target - this.x) - c * this.v) * dt;
      this.x += this.v * dt;
      return this.x;
    }
    snap(x) {
      this.x = x;
      this.v = 0;
    }
  }

  class Spring2 {
    constructor(x, y, k, zeta) {
      this.sx = new Spring(x, k, zeta);
      this.sy = new Spring(y, k, zeta);
    }
    get x() { return this.sx.x; }
    get y() { return this.sy.x; }
    get vx() { return this.sx.v; }
    get vy() { return this.sy.v; }
    step(tx, ty, dt) {
      this.sx.step(tx, dt);
      this.sy.step(ty, dt);
    }
    snap(x, y) {
      this.sx.snap(x);
      this.sy.snap(y);
    }
  }

  // 1-Euro Adaptive Filter (Casiez et al.)
  class OneEuro {
    constructor(minCutoff = 1.0, beta = 0.0, dCutoff = 1.0) {
      this.minCutoff = minCutoff;
      this.beta = beta;
      this.dCutoff = dCutoff;
      this.reset();
    }
    reset() {
      this.x = null;
      this.dx = 0;
    }
    static alpha(cutoff, dt) {
      const tau = 1 / (2 * Math.PI * cutoff);
      return 1 / (1 + tau / dt);
    }
    filter(value, dt) {
      if (this.x === null) {
        this.x = value;
        return value;
      }
      const d = (value - this.x) / (dt || 0.016);
      this.dx = lerp(this.dx, d, OneEuro.alpha(this.dCutoff, dt));
      const cutoff = this.minCutoff + this.beta * Math.abs(this.dx);
      this.x = lerp(this.x, value, OneEuro.alpha(cutoff, dt));
      return this.x;
    }
  }

  // Smooth 1D Value Noise for Blencong Flame Flicker & Sway
  function noise1(t) {
    const i = Math.floor(t);
    const f = t - i;
    const h = (n) => {
      const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
      return s - Math.floor(s);
    };
    const u = f * f * (3 - 2 * f);
    return lerp(h(i), h(i + 1), u);
  }

  // Vector helper functions
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const len = (v) => Math.hypot(v[0], v[1]);
  const ang = (v) => Math.atan2(v[1], v[0]);
  const rotV = (v, t) => {
    const c = Math.cos(t), s = Math.sin(t);
    return [c * v[0] - s * v[1], s * v[0] + c * v[1]];
  };
  const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  // ==========================================================================
  // 2. KIPRAHAN SIGNATURE DANCE CHOREOGRAPHY
  // ==========================================================================
  const DEFAULT_BEAT = 0.68;
  const KIPRAH_BEATS = 19.5;
  const TURN_BEATS = [15, 16];

  const REST_F = [0.45, -0.55];
  const REST_B = [-0.25, -0.95];
  const SEMBAH_F = [0.55, 0.45];
  const SEMBAH_B = [1.15, 0.45];
  const ULAP_F = [0.3, 0.85];
  const HIP_B = [-0.15, -0.75];
  const SPREAD_F = [1.0, 0.45];
  const SPREAD_B = [-0.95, -0.25];
  const OUT_F = [1.05, 0.08];
  const OUT_B = [-1.0, 0.05];
  const SNAP = 0.17;

  const arc = (r, a) => [r * Math.cos(a), r * Math.sin(a)];
  const mixV = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
  const K = (b, pose, snap = SNAP) => ({ b, snap, ...pose });

  const DANCE_KEYS = [
    // 1. Sembahan — sink, hands up to the face, bowing salute
    K(-0.01, { motif: 'sembahan', x: 0, y: 8, tilt: 0.04, depth: 0, front: REST_F, back: REST_B }),
    K(0, { y: 12, tilt: 0.1, front: [0.5, 0.05], back: [0.55, -0.25] }),
    K(0.33, { y: 16, tilt: 0.18, front: SEMBAH_F, back: SEMBAH_B }),
    K(1, { y: 22, tilt: 0.26 }),
    K(1.33, { y: 14, tilt: 0.14 }),
    K(1.66, { y: 18, tilt: 0.2 }, 0.1),

    // 2. Ulap-ulap — rise, hand at brow, looking far
    K(2, { motif: 'ulap-ulap', y: -10, tilt: -0.06, front: ULAP_F, back: HIP_B }),
    K(2.33, { x: 26, tilt: 0.05 }),
    K(2.66, { x: 0, tilt: -0.09 }),
    K(3, { x: 34, y: -16, tilt: 0.07 }),
    K(3.33, { x: 20, tilt: -0.03 }, 0.1),
    K(3.66, { y: -8, tilt: 0.02 }, 0.1),

    // 3. Kiprah — bold jumps, arms flung to new angles, hopping on each beat
    K(4, { motif: 'kiprah', x: 10, y: -24, tilt: 0.14, front: SPREAD_F, back: SPREAD_B }),
    K(4.25, { y: 4, tilt: 0.06 }, 0.1),
    K(5, { x: 0, y: -20, tilt: -0.12, front: [0.7, 0.95], back: [-0.7, -0.6] }),
    K(5.25, { y: 4 }, 0.1),
    K(6, { x: 32, y: -22, tilt: 0.18, front: [1.1, -0.1], back: [-0.6, 0.8] }),
    K(6.25, { y: 6 }, 0.1),
    K(6.66, { front: [0.9, 0.6], back: [-0.95, -0.2] }),
    K(7, { x: 12, y: -24, tilt: -0.13, front: [0.4, 1.0], back: [-1.0, 0.3] }),
    K(7.25, { y: 6, tilt: -0.04 }, 0.1),
    K(7.6, { tilt: 0.07 }),

    // 4. Ombak Banyu — "water waves", rise-and-fall rippling forward
    K(8, { motif: 'ombak banyu', x: 30, y: -22, tilt: -0.07, front: [0.95, 0.7], back: [-0.9, -0.5] }),
    K(8.5, { x: 45, y: 18, tilt: 0.11, front: [0.95, -0.2], back: [-0.9, 0.45] }),
    K(9, { x: 60, y: -22, tilt: -0.07, front: [0.95, 0.7], back: [-0.9, -0.5] }),
    K(9.5, { x: 75, y: 18, tilt: 0.11, front: [0.95, -0.2], back: [-0.9, 0.45] }),
    K(10, { x: 90, y: -22, tilt: -0.07, front: [0.95, 0.7], back: [-0.9, -0.5] }),
    K(10.5, { x: 100, y: 18, tilt: 0.11, front: [0.95, -0.2], back: [-0.9, 0.45] }),
    K(11, { x: 110, y: -18, tilt: -0.05, front: [0.95, 0.6], back: [-0.9, -0.4] }),
    K(11.5, { x: 115, y: 10, tilt: 0.08, front: [0.95, 0.1], back: [-0.9, 0.2] }),

    // 5. Srisig — rapid tiny steps
    K(12, { motif: 'srisig', x: 135, y: -8, tilt: 0.13, front: OUT_F, back: OUT_B }, 0.1),
    K(12.33, { x: 157, y: 0 }, 0.1),
    K(12.66, { x: 179, y: -8 }, 0.1),
    K(13, { x: 201, y: 0 }, 0.1),
    K(13.33, { x: 223, y: -8 }, 0.1),
    K(13.66, { x: 240, y: 0 }, 0.1),

    // 6. Besut — jump toward the lamp (shadow swells dramatically!), wheeling arms, 360 spin
    K(14, { motif: 'besut', x: 0, y: -52, tilt: 0.02, depth: 0.9, front: arc(0.95, Math.PI / 2), back: arc(0.9, -Math.PI / 2) }, 0.22),
    K(14.5, { front: arc(0.95, 0), back: arc(0.9, Math.PI) }),
    K(15.5, { front: arc(0.95, -Math.PI / 2), back: arc(0.9, Math.PI / 2) }),
    K(16.33, { front: arc(0.95, Math.PI), back: arc(0.9, 0) }),
    K(16.66, { y: -4, tilt: 0.04, depth: 0.2, front: arc(0.95, Math.PI / 2), back: arc(0.9, -Math.PI / 2) }, 0.18),

    // 7. Sabetan — whip-like strike of the front arm with a lunge
    K(17, { motif: 'sabetan', x: -12, y: 0, tilt: -0.12, depth: 0, front: arc(1.1, 2.5), back: SPREAD_B }),
    K(17.33, { x: 80, tilt: 0.22, front: arc(1.15, -0.4) }, 0.08),

    // 8. Tancep — slammed into gedebog, rebound, settle
    K(18.33, { motif: 'tancep', x: 72, y: 34, tilt: 0.03, front: REST_F, back: REST_B }, 0.1),
    K(18.5, { y: 20 }, 0.1),
    K(18.8, { x: 0, y: 8, tilt: 0 }, 0.5),
  ];

  for (let i = 1; i < DANCE_KEYS.length; i++) {
    for (const f of ['motif', 'x', 'y', 'tilt', 'depth', 'front', 'back']) {
      if (DANCE_KEYS[i][f] === undefined) DANCE_KEYS[i][f] = DANCE_KEYS[i - 1][f];
    }
  }

  function kiprahPose(b) {
    let i = 0;
    while (i + 1 < DANCE_KEYS.length && DANCE_KEYS[i + 1].b <= b) i++;
    const key = DANCE_KEYS[i];
    const prev = DANCE_KEYS[Math.max(0, i - 1)];
    const u = i === 0 ? 1 : clamp((b - key.b) / key.snap, 0, 1);
    const t = 1 - Math.pow(1 - u, 2);
    const since = Math.max(0, b - key.b - key.snap);
    return {
      motif: key.motif,
      x: lerp(prev.x, key.x, t),
      y: lerp(prev.y, key.y, t),
      tilt: lerp(prev.tilt, key.tilt, t),
      depth: lerp(prev.depth, key.depth, t),
      front: mixV(prev.front, key.front, t),
      back: mixV(prev.back, key.back, t),
      still: u < 1 ? 0 : 1 - Math.exp(-since * 5),
    };
  }

  function danceWeight(b, start) {
    const ramp = (t) => {
      const u = clamp(t, 0, 1);
      return u * u * (3 - 2 * u);
    };
    if (b < 0) return ramp((b - start) / Math.max(0.01, -start));
    if (b > 18.0) return 1 - ramp((b - 18.0) / (KIPRAH_BEATS - 18.0));
    return 1;
  }

  // ==========================================================================
  // 3. ARTICULATED WAYANG RIG SPECIFICATION
  // ==========================================================================
  const resolveWmAsset = (url) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('/')) return url;
    if (window.location.pathname.includes('/pages/') && !url.startsWith('../')) {
      return '../' + url;
    }
    return url;
  };

  const rot180 = (p, size) => [size[0] - p[0], size[1] - p[1]];

  const LEFT = {
    upper: { src: 'assets/images/wayang-motion/reference-rig/upper-arm-l.webp', size: [231, 89], prox: [211, 44], dist: [22, 28] },
    fore:  { src: 'assets/images/wayang-motion/reference-rig/forearm-l.webp',   size: [195, 109], prox: [172, 58], dist: [13, 53] },
    hand:  { src: 'assets/images/wayang-motion/reference-rig/hand-l.webp',      size: [108, 124], prox: [91.7, 67.5], grip: [52, 76] },
  };

  const BRAJA_LEFT = {
    upper: { src: 'assets/images/wayang-motion/brajawisena-rig/upper-arm-l.webp', size: [231, 89], prox: [211, 44], dist: [22, 28] },
    fore:  { src: 'assets/images/wayang-motion/brajawisena-rig/forearm-l.webp',   size: [195, 109], prox: [172, 58], dist: [13, 53] },
    hand:  { src: 'assets/images/wayang-motion/brajawisena-rig/hand-l.webp',      size: [108, 124], prox: [91.7, 67.5], grip: [52, 76] },
  };

  const mirrorPiece = (p, src) => {
    const out = { src, size: p.size };
    for (const k of ['prox', 'dist', 'grip']) if (p[k]) out[k] = rot180(p[k], p.size);
    return out;
  };

  const PARTS = {
    body:   { src: 'assets/images/wayang-motion/reference-rig/body.webp', size: [706, 1377] },
    upperL: LEFT.upper,
    foreL:  LEFT.fore,
    handL:  LEFT.hand,
    upperR: mirrorPiece(LEFT.upper, 'assets/images/wayang-motion/reference-rig/upper-arm-r.webp'),
    foreR:  mirrorPiece(LEFT.fore,  'assets/images/wayang-motion/reference-rig/forearm-r.webp'),
    handR:  mirrorPiece(LEFT.hand,  'assets/images/wayang-motion/reference-rig/hand-r.webp'),

    // Authentic Traditional Opponent: Prabu Brajawisena Rig Assets
    braja_body:   { src: 'assets/images/wayang-motion/brajawisena-rig/body.webp', size: [706, 1377] },
    braja_upperL: BRAJA_LEFT.upper,
    braja_foreL:  BRAJA_LEFT.fore,
    braja_handL:  BRAJA_LEFT.hand,
    braja_upperR: mirrorPiece(BRAJA_LEFT.upper, 'assets/images/wayang-motion/brajawisena-rig/upper-arm-r.webp'),
    braja_foreR:  mirrorPiece(BRAJA_LEFT.fore,  'assets/images/wayang-motion/brajawisena-rig/forearm-r.webp'),
    braja_handR:  mirrorPiece(BRAJA_LEFT.hand,  'assets/images/wayang-motion/brajawisena-rig/hand-r.webp'),
  };

  for (const k in PARTS) {
    if (PARTS[k] && PARTS[k].src) PARTS[k].src = resolveWmAsset(PARTS[k].src);
  }

  const BODY_RIG = {
    anchor: [345, 760],
    shoulder: { L: [247.5, 432.5], R: [442.5, 432.5] },
    stickTop: [346, 318],
    stickFoot: [346, 1334],
    ties: [470, 1010, 1262],
  };

  const REST_POSE = { L: [-150, 250], R: [70, 330] };

  class Arm {
    constructor(side, partPrefix = '') {
      this.side = side;
      this.partPrefix = partPrefix;
      this.upper = PARTS[partPrefix + 'upper' + side] || PARTS['upper' + side];
      this.fore = PARTS[partPrefix + 'fore' + side] || PARTS['fore' + side];
      this.hand = PARTS[partPrefix + 'hand' + side] || PARTS['hand' + side];
      this.shoulder = BODY_RIG.shoulder[side];

      const u = sub(this.upper.dist, this.upper.prox);
      this.Lu = len(u);
      this.restU = ang(u);
      const f = add(sub(this.fore.dist, this.fore.prox), sub(this.hand.grip, this.hand.prox));
      this.Lf = len(f);
      this.restF = ang(f);
      this.bend = side === 'L' ? -1 : 1;

      this.rotU = new Spring(0, 260, 0.34);
      this.rotF = new Spring(0, 210, 0.26);
      this.rotH = new Spring(0, 110, 0.2);
      this.target = null;
      this.rodX = new Spring(0, 45, 0.75);
      this.solution = { rotU: 0, rotF: 0 };
      this.initialized = false;
      this.rodInit = false;
    }

    initRestPose(B) {
      const targetLocal = add(this.shoulder, REST_POSE[this.side]);
      const sol = this.solve(targetLocal);
      this.solution = sol;
      this.rotU.snap(sol.rotU);
      this.rotF.snap(sol.rotF);
      this.rotH.snap(sol.rotF);
      const targetWorld = Affine.apply(B, ...targetLocal);
      this.target = new Spring2(targetWorld[0], targetWorld[1], 320, 0.5);
      this.target.snap(targetWorld[0], targetWorld[1]);
      this.rodX.snap(targetWorld[0]);
      this.initialized = true;
      this.rodInit = true;
    }

    solve(T) {
      const S = this.shoulder;
      const d = sub(T, S);
      const a = ang(d);
      const dist = clamp(len(d), Math.abs(this.Lu - this.Lf) + 40, this.Lu + this.Lf - 0.5);
      const cosA = clamp((this.Lu * this.Lu + dist * dist - this.Lf * this.Lf) / (2 * this.Lu * dist), -1, 1);
      const thU = a + this.bend * Math.acos(cosA);
      const elbow = [S[0] + this.Lu * Math.cos(thU), S[1] + this.Lu * Math.sin(thU)];
      const reach = [S[0] + dist * Math.cos(a), S[1] + dist * Math.sin(a)];
      const thF = ang(sub(reach, elbow));
      return { rotU: wrapAngle(thU - this.restU), rotF: wrapAngle(thF - this.restF) };
    }

    pose(B) {
      const upperM = Affine.chain(B, Affine.translate(...this.shoulder), Affine.rotate(this.rotU.x), Affine.translate(-this.upper.prox[0], -this.upper.prox[1]));
      const elbow = add(this.shoulder, rotV(sub(this.upper.dist, this.upper.prox), this.rotU.x));
      const foreM = Affine.chain(B, Affine.translate(...elbow), Affine.rotate(this.rotF.x), Affine.translate(-this.fore.prox[0], -this.fore.prox[1]));
      const wrist = add(elbow, rotV(sub(this.fore.dist, this.fore.prox), this.rotF.x));
      const handM = Affine.chain(B, Affine.translate(...wrist), Affine.rotate(this.rotH.x), Affine.translate(-this.hand.prox[0], -this.hand.prox[1]));
      const gripLocal = add(wrist, rotV(sub(this.hand.grip, this.hand.prox), this.rotH.x));
      return { upperM, foreM, handM, grip: Affine.apply(B, ...gripLocal) };
    }
  }

  function rodLimit(spring, target, maxDev) {
    const d = wrapAngle(spring.x - target);
    if (Math.abs(d) > maxDev) {
      spring.x = target + Math.sign(d) * maxDev;
      if (spring.v * Math.sign(d) > 0) spring.v *= -0.3;
    } else {
      spring.x = target + d;
    }
  }

  class Puppet {
    constructor({ x = 960, y = 650, facing = 1, lookDir = null, id = null, character = null, image = null, partPrefix = '' } = {}) {
      this.id = id;
      this.character = character;
      this.image = image;
      this.partPrefix = partPrefix;
      this.baseScale = 0.53;
      this.scale = this.baseScale;
      this.home = [x, y];
      this.pos = new Spring2(x, y, 260, 0.78);
      this.bodyTarget = [x, y];
      this.tilt = new Spring(0, 75, 0.55);
      this.depth = new Spring(0, 32, 1.0);

      // Raw image texture forward direction:
      // Both Prabu Wahyana (reference-rig) and Prabu Brajawisena (brajawisena-rig) have their raw body/head
      // textures drawn facing LEFT (-1). Therefore, both use rawFacing = -1.
      this.rawFacing = -1;

      // World look direction: +1 = looking RIGHT towards +X, -1 = looking LEFT towards -X
      const initialLook = lookDir !== null ? lookDir : (facing !== undefined && facing !== null ? facing : -1);
      this.defaultLookDir = initialLook;
      this.lookDir = initialLook;
      this.facing = initialLook;
      this.defaultFacing = initialLook;

      // Visual horizontal flip factor:
      // flipX = rawFacing * lookDir
      // Wahyana (rawFacing -1) looking RIGHT (+1): flipX = (-1) * (+1) = -1 (mirrored -> looks right towards center)
      // Brajawisena (rawFacing -1) looking LEFT (-1): flipX = (-1) * (-1) = +1 (unmirrored -> looks left towards center)
      this.flipX = this.rawFacing * this.lookDir;
      this.flip = { from: this.lookDir, to: this.lookDir, t: 1 };

      this.facingMode = 'target';
      this.faceTargetX = null;
      this.turnTimer = 0;
      this.walkPhase = 0;
      this.surfaceTilt = [0, 0];
      this.prevVel = [0, 0];
      this.dance = null;
      this.danceStarted = false;
      this.danceOffset = [0, 0];
      this.danceTilt = 0;
      this.dSpring = { x: new Spring(0, 620, 0.32), y: new Spring(0, 620, 0.3), tilt: new Spring(0, 520, 0.3) };
      this.time = 0;
      this.lastBodyXY = null;
      this.lastBodyV = [0, 0];
      this.lastRot = 0;
      this.lastRotV = 0;
      this.prevFrame = new Map();
      this.B = this.bodyMatrix(0);
      this.arms = { L: new Arm('L', partPrefix), R: new Arm('R', partPrefix) };
      this.arms.L.initRestPose(this.B);
      this.arms.R.initRestPose(this.B);
    }

    get dancing() {
      return this.dance !== null;
    }

    startDance(rhythm) {
      const period = rhythm?.period ?? DEFAULT_BEAT;
      const k = period < 0.5 ? 2 : 1;
      const pos = (rhythm?.pos ?? 0) / k;
      let lead = Math.ceil(pos) - pos;
      if (lead < 0.45) lead += 1;
      this.dance = { b: -lead, start: -lead, k, turned: new Set() };
      this.danceStarted = true;
      for (const s of Object.values(this.dSpring)) s.snap(0);
    }

    turn() {
      if (this.flip.t < 1) return;
      const targetLook = -this.lookDir;
      this.flip = { from: this.lookDir, to: targetLook, t: 0 };
      this.lookDir = targetLook;
      this.facing = targetLook;
    }

    bodyMatrix(bob) {
      return Affine.chain(
        Affine.translate(this.pos.x + this.danceOffset[0], this.pos.y + bob + this.danceOffset[1]),
        Affine.rotate(this.tilt.x + this.danceTilt),
        Affine.scale(this.scale * this.flipX, this.scale),
        Affine.translate(-BODY_RIG.anchor[0], -BODY_RIG.anchor[1]),
      );
    }

    update(dt, input, view, rhythm) {
      if (!state.isActive) {
        // Ready state: every puppet remains completely stationary with zero flicker or sway
        const homeX = view.x + view.w * (this.id === 'prabu-brajawisena' ? 0.62 : 0.38);
        const homeY = view.y + view.h * 0.6;
        this.home = [homeX, homeY];
        this.pos.snap(homeX, homeY);
        this.bodyTarget = [homeX, homeY];
        this.tilt.snap(0);
        this.depth.snap(0);
        this.dance = null;
        this.danceOffset = [0, 0];
        this.danceTilt = 0;
        this.walkPhase = 0;
        this.turnTimer = 0;
        this.lookDir = this.defaultLookDir;
        this.facing = this.defaultLookDir;
        this.flipX = this.rawFacing * this.lookDir;
        this.flip = { from: this.lookDir, to: this.lookDir, t: 1 };
        this.surfaceTilt = [0, 0];
        this.prevVel = [0, 0];
        this.B = this.bodyMatrix(0);
        for (const side of ['L', 'R']) {
          const arm = this.arms[side];
          arm.initRestPose(this.B);
        }
        return;
      }
      if (input.danceTrigger && !this.dance) this.startDance(rhythm);
      let D = null, w = 0;
      if (this.dance) {
        const d = this.dance;
        d.b += (rhythm?.db ?? dt / DEFAULT_BEAT) / d.k;
        for (const tb of TURN_BEATS) {
          if (!d.turned.has(tb) && d.b >= tb) {
            d.turned.add(tb);
            this.turn();
          }
        }
        if (d.b >= KIPRAH_BEATS) {
          this.dance = null;
        } else {
          D = kiprahPose(d.b);
          w = danceWeight(d.b, d.start);
        }
      }

      const fwd = this.lookDir;
      const kS = this.scale / this.baseScale;
      this.time += dt;

      const ds = this.dSpring;
      ds.x.step(D ? w * D.x : 0, dt);
      ds.y.step(D ? w * D.y : 0, dt);
      ds.tilt.step(D ? w * D.tilt : 0, dt);

      const getar = D ? w * (0.35 + 0.65 * D.still) : 0;
      const t = this.time;
      const quiverY = getar * (1.6 * Math.sin(t * 2 * Math.PI * 10.5) + 0.9 * Math.sin(t * 2 * Math.PI * 6.3 + 1.7));
      const quiverT = getar * 0.009 * Math.sin(t * 2 * Math.PI * 8.1 + 0.4);
      this.danceOffset = [ds.x.x * fwd * kS, (ds.y.x + quiverY) * kS];
      this.danceTilt = (ds.tilt.x + quiverT) * fwd;

      if (input.body) {
        this.bodyTarget = [
          clamp(input.body.x, view.x + 40, view.x + view.w - 40),
          clamp(input.body.y, view.y + view.h * 0.12, view.y + view.h * 1.1),
        ];
      }
      this.pos.step(this.bodyTarget[0], this.bodyTarget[1], dt);
      const vx = this.pos.vx, vy = this.pos.vy;
      this.danceOffset[0] = clamp(this.danceOffset[0], view.x + 60 - this.pos.x, view.x + view.w - 60 - this.pos.x);

      const lean = clamp(-vx * 0.00018, -0.14, 0.14);
      this.tilt.stepAngle(clamp(((input.tilt ?? 0) + lean) * (1 - w), -0.5, 0.5), dt);

      this.depth.step(lerp(input.depth ?? 0, D ? D.depth : 0, w), dt);
      this.scale = this.baseScale * (1 + 0.14 * this.depth.x);

      const speed = Math.abs(vx);
      this.walkPhase += dt * speed * 0.017;
      const bob = -Math.abs(Math.sin(this.walkPhase)) * clamp(speed / 380, 0, 1) * 9;

      let wantTurn = false;
      if (!this.dance) {
        if (this.facingMode === 'walk') {
          const walkDir = Math.sign(vx);
          wantTurn = speed > 240 && walkDir !== 0 && this.lookDir !== walkDir;
        } else if (this.facingMode === 'target' && this.faceTargetX !== null) {
          const dx = this.faceTargetX - this.pos.x;
          const targetDir = Math.sign(dx);
          wantTurn = Math.abs(dx) > 60 && targetDir !== 0 && this.lookDir !== targetDir;
        }
      }
      if (wantTurn) {
        this.turnTimer += dt;
        if (this.turnTimer > 0.2) this.turn();
      } else {
        this.turnTimer = 0;
      }
      if (this.flip.t < 1) {
        this.flip.t = Math.min(1, this.flip.t + dt / 0.42);
        this.flipX = this.rawFacing * this.flip.from * Math.cos(Math.PI * easeInOut(this.flip.t));
      } else {
        this.flipX = this.rawFacing * this.lookDir;
      }

      const ax = (vx - this.prevVel[0]) / Math.max(dt, 1e-3);
      this.prevVel = [vx, vy];
      this.surfaceTilt = [clamp(vx * 0.00035 + ax * 0.00002, -0.35, 0.35), clamp(vy * 0.0003, -0.25, 0.25)];

      this.B = this.bodyMatrix(bob);
      const B = this.B;
      const canSolve = Math.abs(this.flipX) > 0.25;
      const invB = canSolve ? Affine.invert(B) : null;

      const bodyXY = [this.pos.x + this.danceOffset[0], this.pos.y + bob + this.danceOffset[1]];
      const rot = this.tilt.x + this.danceTilt;
      let acc = [0, 0], rotAcc = 0;
      if (this.lastBodyXY && dt > 0) {
        const v = [(bodyXY[0] - this.lastBodyXY[0]) / dt, (bodyXY[1] - this.lastBodyXY[1]) / dt];
        acc = [(v[0] - this.lastBodyV[0]) / dt, (v[1] - this.lastBodyV[1]) / dt];
        this.lastBodyV = v;
        const rv = (rot - this.lastRot) / dt;
        rotAcc = (rv - this.lastRotV) / dt;
        this.lastRotV = rv;
      }
      this.lastBodyXY = bodyXY;
      this.lastRot = rot;

      const mirror = Math.sign(this.flipX) || 1;
      const kick = (seg, gain) => {
        const r = [B[0] * seg[0] + B[2] * seg[1], B[1] * seg[0] + B[3] * seg[1]];
        const r2 = r[0] * r[0] + r[1] * r[1] || 1;
        const alpha = clamp((r[0] * -acc[1] - r[1] * -acc[0]) / r2, -900, 900);
        return (alpha * mirror - rotAcc) * gain * dt;
      };
      const snappy = D !== null;

      const sL = Affine.apply(B, ...BODY_RIG.shoulder.L);
      const sR = Affine.apply(B, ...BODY_RIG.shoulder.R);
      const leftArm = sL[0] <= sR[0] ? 'L' : 'R';
      const specs = {
        [leftArm]: input.arms?.left,
        [leftArm === 'L' ? 'R' : 'L']: input.arms?.right,
      };

      for (const side of ['L', 'R']) {
        const arm = this.arms[side];
        const shoulderW = side === 'L' ? sL : sR;
        const spec = specs[side];
        let tgt;
        if (spec?.type === 'rel') {
          const g = (arm.Lu + arm.Lf) * this.scale * 0.82;
          tgt = [shoulderW[0] + spec.dx * g, shoulderW[1] + spec.dy * g];
        } else if (spec?.type === 'abs') {
          tgt = [spec.x, spec.y];
        } else {
          tgt = Affine.apply(B, ...add(arm.shoulder, REST_POSE[side]));
        }
        if (D) {
          const v = side === 'L' ? D.front : D.back;
          const g = (arm.Lu + arm.Lf) * this.scale * 0.82;
          const dtgt = [shoulderW[0] + fwd * v[0] * g, shoulderW[1] - v[1] * g];
          tgt = [lerp(tgt[0], dtgt[0], w), lerp(tgt[1], dtgt[1], w)];
        }

        if (!arm.initialized) {
          arm.target = new Spring2(tgt[0], tgt[1], 320, 0.5);
          arm.initialized = true;
        }
        for (const s of [arm.target.sx, arm.target.sy]) {
          s.k = snappy ? 560 : 320;
          s.zeta = snappy ? 0.3 : 0.5;
        }
        arm.target.step(tgt[0], tgt[1], dt);

        if (canSolve) arm.solution = arm.solve(Affine.apply(invB, arm.target.x, arm.target.y));
        arm.rotU.v += kick(rotV(sub(arm.upper.dist, arm.upper.prox), arm.rotU.x), 0.07);
        arm.rotF.v += kick(rotV([arm.Lf * Math.cos(arm.restF), arm.Lf * Math.sin(arm.restF)], arm.rotF.x), 0.1);
        arm.rotH.v += kick(rotV(sub(arm.hand.grip, arm.hand.prox), arm.rotH.x), 0.14);
        arm.rotU.stepAngle(arm.solution.rotU, dt);
        arm.rotF.stepAngle(arm.solution.rotF, dt);
        arm.rotH.stepAngle(arm.rotF.x, dt);
        rodLimit(arm.rotU, arm.solution.rotU, 0.7);
        rodLimit(arm.rotF, arm.solution.rotF, 0.9);
        rodLimit(arm.rotH, arm.rotF.x, 0.8);

        const restRod = arm.target.x + (this.pos.x - arm.target.x) * 0.3;
        const rodTarget = lerp(spec?.rodX ?? restRod, restRod, w);
        if (!arm.rodInit) {
          arm.rodX.snap(rodTarget);
          arm.rodInit = true;
        }
        arm.rodX.step(rodTarget, dt);
      }
    }

    frame(view) {
      const B = this.B;
      const bottom = view.y + view.h + 90;
      const k = this.scale / this.baseScale;
      const poses = { L: this.arms.L.pose(B), R: this.arms.R.pose(B) };
      const tilt = this.surfaceTilt;
      const pfx = this.partPrefix || '';

      const armItems = (side) => [
        { kind: 'part', id: pfx + 'upper' + side, key: pfx + 'upper' + side, m: poses[side].upperM, tilt },
        { kind: 'part', id: pfx + 'fore' + side,  key: pfx + 'fore' + side,  m: poses[side].foreM,  tilt },
        { kind: 'part', id: pfx + 'hand' + side,  key: pfx + 'hand' + side,  m: poses[side].handM,  tilt },
      ];

      const top = Affine.apply(B, ...BODY_RIG.stickTop);
      const foot = Affine.apply(B, ...BODY_RIG.stickFoot);
      const axis = sub(foot, top);
      const axisLen = len(axis) || 1;
      const dir = [axis[0] / axisLen, axis[1] / axisLen];
      const s = this.scale;
      const cap = [top[0] - dir[0] * 10 * s, top[1] - dir[1] * 10 * s];
      const handleStart = [foot[0] + dir[0] * 150 * s, foot[1] + dir[1] * 150 * s];
      const tEnd = dir[1] > 0.15 ? Math.max(0, (bottom - handleStart[1]) / dir[1]) : 1600;
      const end = [handleStart[0] + dir[0] * tEnd, handleStart[1] + dir[1] * tEnd];

      const gapit = {
        kind: 'stick',
        id: 'gapit',
        style: 'gapit',
        pts: [
          { p: cap, w: 2.5 * s },
          { p: top, w: 8 * s },
          { p: foot, w: 13 * s },
          { p: handleStart, w: 26 * s },
          { p: end, w: 30 * s },
        ],
        ties: BODY_RIG.ties.map((y) => [(y - BODY_RIG.stickTop[1] + 10) * s, 9 * s]),
      };

      const rods = ['L', 'R'].map((side) => {
        const grip = poses[side].grip;
        const bx = this.arms[side].rodX.x;
        const ropeDir = sub([bx, bottom], grip);
        const L = len(ropeDir) || 1;
        const d = [ropeDir[0] / L, ropeDir[1] / L];
        return {
          kind: 'stick',
          id: 'rod' + side,
          style: 'rod',
          pts: [
            { p: [grip[0] - d[0] * 3 * k, grip[1] - d[1] * 3 * k], w: 1.6 * k },
            { p: [grip[0] + d[0] * 4 * k, grip[1] + d[1] * 4 * k], w: 3.4 * k },
            { p: [bx, bottom], w: 6.5 * k },
          ],
          ties: [[5 * k, 6 * k]],
        };
      });

      const sL = Affine.apply(B, ...BODY_RIG.shoulder.L);
      const sR = Affine.apply(B, ...BODY_RIG.shoulder.R);
      const front = (this.lookDir > 0) ? (sL[0] >= sR[0] ? 'L' : 'R') : (sL[0] <= sR[0] ? 'L' : 'R');
      const back = front === 'L' ? 'R' : 'L';
      const items = [
        ...armItems(back),
        { kind: 'part', id: pfx + 'body', key: pfx + 'body', m: B, tilt },
        gapit,
        ...armItems(front),
        ...rods,
      ];
      return items;
    }
  }

  // ==========================================================================
  // 4. WEBGL2 GENUINE 3D LAMP-LIT SHADOW THEATER RENDERER
  // ==========================================================================
  const STAGE_W = 1920;
  const STAGE_H = 1080;

  const VS_PART = `#version 300 es
layout(location=0) in vec2 aPos;
uniform vec3 uM0;
uniform vec3 uM1;
uniform vec2 uSize;
uniform vec4 uView;
uniform vec4 uProj;
out vec2 vUv;
out vec2 vWorld;
void main() {
  vec2 local = aPos * uSize;
  vec2 w = vec2(dot(uM0, vec3(local, 1.0)), dot(uM1, vec3(local, 1.0)));
  vWorld = w;
  w = uProj.xy + (w - uProj.xy) * uProj.z + vec2(0.0, uProj.w);
  vec2 ndc = (w - uView.xy) / uView.zw * 2.0 - 1.0;
  gl_Position = vec4(ndc.x, -ndc.y, 0.0, 1.0);
  vUv = aPos;
}`;

  const LIGHTING = `
uniform vec3 uLamp;
uniform vec3 uEye;
uniform vec3 uLampColor;
uniform float uIntensity;
vec3 lampLight(vec3 P, out vec3 L, out vec3 H) {
  vec3 Ld = uLamp - P;
  float dist = length(Ld);
  L = Ld / dist;
  H = normalize(L + normalize(uEye - P));
  return uLampColor * uIntensity / (1.0 + dist * dist / (2800.0 * 2800.0));
}`;

  const FS_PART = `#version 300 es
precision highp float;
in vec2 vUv;
in vec2 vWorld;
uniform sampler2D uTex;
uniform vec2 uTexel;
uniform vec3 uM0;
uniform vec3 uM1;
uniform vec2 uTilt;
uniform float uBump;
uniform float uAlpha;
${LIGHTING}
out vec4 outColor;

float height(vec2 uv) {
  vec4 t = texture(uTex, uv);
  return dot(t.rgb, vec3(0.299, 0.587, 0.114)) * 0.65 + t.a * 0.35;
}

void main() {
  vec4 t = texture(uTex, vUv);
  if (t.a < 0.003) discard;
  vec3 alb = t.rgb / t.a;

  vec2 e = uTexel * 1.35;
  float hl = height(vUv - vec2(e.x, 0.0));
  float hr = height(vUv + vec2(e.x, 0.0));
  float hu = height(vUv - vec2(0.0, e.y));
  float hd = height(vUv + vec2(0.0, e.y));
  vec3 nt = normalize(vec3((hl - hr) * uBump, (hu - hd) * uBump, 1.0));

  vec2 c0 = vec2(uM0.x, uM1.x);
  vec2 c1 = vec2(uM0.y, uM1.y);
  float sc = max(length(c0), 1e-4);
  vec3 N = normalize(vec3((nt.x * c0 + nt.y * c1) / sc + uTilt, nt.z));

  float mx = max(alb.r, max(alb.g, alb.b));
  float mn = min(alb.r, min(alb.g, alb.b));
  float sat = (mx - mn) / max(mx, 1e-3);
  float gold = smoothstep(0.03, 0.12, alb.g - alb.b)
             * (1.0 - smoothstep(0.16, 0.32, alb.r - alb.g))
             * smoothstep(-0.10, 0.02, alb.r - alb.g)
             * smoothstep(0.30, 0.55, mx)
             * smoothstep(0.12, 0.28, sat);

  vec3 L, H;
  vec3 light = lampLight(vec3(vWorld, 0.0), L, H);
  float ndl = max(dot(N, L), 0.0);
  float ndh = max(dot(N, H), 0.0);

  vec3 ambient = vec3(0.34, 0.27, 0.22);
  vec3 diffuse = alb * (ambient + light * ndl * mix(1.0, 0.72, gold));

  vec3 goldTint = mix(alb, vec3(1.0, 0.85, 0.52), 0.3);
  vec3 specGold = goldTint * (pow(ndh, 80.0) * 2.4 + pow(ndh, 14.0) * 0.30);
  vec3 specPaint = vec3(1.0, 0.94, 0.84) * pow(ndh, 40.0) * 0.16;
  vec3 spec = mix(specPaint, specGold, gold) * light;

  float slope = clamp(1.0 - nt.z, 0.0, 1.0);
  vec3 rim = alb * vec3(1.0, 0.78, 0.5) * slope * 0.5;

  vec3 col = diffuse + spec + rim;
  outColor = vec4(col * t.a, t.a) * uAlpha;
}`;

  const FS_PART_SHADOW = `#version 300 es
precision highp float;
in vec2 vUv;
in vec2 vWorld;
uniform sampler2D uTex;
uniform float uTint;
uniform float uAlpha;
out vec4 outColor;
void main() {
  vec4 t = texture(uTex, vUv);
  outColor = vec4(t.rgb * uTint, t.a) * uAlpha;
}`;

  const VS_STICK = `#version 300 es
layout(location=0) in vec2 aPos;
layout(location=1) in vec2 aCoord;
layout(location=2) in vec2 aAcross;
uniform vec4 uView;
uniform vec4 uProj;
out vec2 vCoord;
out vec2 vAcross;
out vec2 vWorld;
void main() {
  vWorld = aPos;
  vec2 w = uProj.xy + (aPos - uProj.xy) * uProj.z + vec2(0.0, uProj.w);
  vec2 ndc = (w - uView.xy) / uView.zw * 2.0 - 1.0;
  gl_Position = vec4(ndc.x, -ndc.y, 0.0, 1.0);
  vCoord = aCoord;
  vAcross = aAcross;
}`;

  const NOISE = `
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}`;

  const FS_STICK = `#version 300 es
precision highp float;
in vec2 vCoord;
in vec2 vAcross;
in vec2 vWorld;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec2 uTies[4];
uniform int uTieCount;
uniform float uSeed;
uniform float uAlpha;
${LIGHTING}
${NOISE}
out vec4 outColor;
void main() {
  float u = vCoord.x;
  float v = vCoord.y;
  float aw = fwidth(u);
  float a = 1.0 - smoothstep(1.0 - aw, 1.0 + aw, abs(u));
  if (a <= 0.001) discard;
  float uc = clamp(u, -1.0, 1.0);
  float z = sqrt(max(1.0 - uc * uc, 0.0));
  vec3 N = normalize(vec3(vAcross * uc, z + 0.08));

  float streak = vnoise(vec2(uc * 2.5 + uSeed, v * 0.02)) * 0.65 + vnoise(vec2(uc * 8.0 - uSeed, v * 0.09)) * 0.35;
  vec3 base = mix(uColorA, uColorB, smoothstep(0.45, 0.95, streak));
  base += uColorB * pow(1.0 - z, 2.0) * 0.45;
  float shin = 70.0;
  float specK = 1.0;

  for (int i = 0; i < 4; i++) {
    if (i >= uTieCount) break;
    float d = abs(v - uTies[i].x);
    if (d < uTies[i].y) {
      float wrap = 0.5 + 0.5 * sin(v * 2.2);
      base = vec3(0.80, 0.70, 0.50) * (0.62 + 0.38 * wrap);
      N = normalize(vec3(vAcross * uc * 0.8, z + 0.3));
      shin = 10.0;
      specK = 0.18;
    }
  }

  vec3 L, H;
  vec3 light = lampLight(vec3(vWorld, 0.0), L, H);
  float ndl = max(dot(N, L), 0.0);
  float ndh = max(dot(N, H), 0.0);
  vec3 col = base * (vec3(0.30, 0.25, 0.22) + light * ndl) + light * (pow(ndh, shin) * 1.1 + pow(ndh, 8.0) * 0.06) * specK;
  outColor = vec4(col * a, a) * uAlpha;
}`;

  const FS_STICK_SHADOW = `#version 300 es
precision highp float;
in vec2 vCoord;
in vec2 vAcross;
in vec2 vWorld;
uniform float uAlpha;
out vec4 outColor;
void main() {
  float aw = fwidth(vCoord.x);
  float a = 1.0 - smoothstep(1.0 - aw, 1.0 + aw, abs(vCoord.x));
  outColor = vec4(0.0, 0.0, 0.0, a) * uAlpha;
}`;

  const VS_FULL = `#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

  const FS_BG = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uBg;
uniform sampler2D uShadow0;
uniform sampler2D uShadow1;
uniform vec4 uView;
uniform vec2 uHot;
uniform float uFlicker;
uniform vec2 uShadowK;
uniform float uTime;
${NOISE}
out vec4 outColor;
void main() {
  vec2 buv = vec2(vUv.x, 1.0 - vUv.y);
  vec3 bg = texture(uBg, clamp(buv, vec2(0.0), vec2(1.0))).rgb;

  // Noticeably darken stage background with deep warm brown, dark mahogany & muted antique gold tones
  // Greatly reduces competing brightness so 3D wayang characters and gold prada stand out with theatrical clarity
  vec3 mahoganyBase = vec3(0.08, 0.04, 0.02);
  vec3 warmTone = vec3(0.38, 0.29, 0.21);
  vec3 lit = mahoganyBase + bg * warmTone;

  vec4 s0 = texture(uShadow0, vUv);
  vec4 s1 = texture(uShadow1, vUv);
  vec3 trans = clamp(1.0 - uShadowK.x * s0.a + uShadowK.x * s0.rgb, 0.0, 1.0)
             * clamp(1.0 - uShadowK.y * s1.a + uShadowK.y * s1.rgb, 0.0, 1.0);
  lit *= trans;
  outColor = vec4(lit, 1.0);
}`;

  const FS_BLUR = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uDir;
out vec4 outColor;
const float W[5] = float[](0.2270270, 0.1945946, 0.1216216, 0.0540540, 0.0162162);
void main() {
  vec4 c = texture(uTex, vUv) * W[0];
  for (int i = 1; i < 5; i++) {
    vec2 o = uDir * float(i);
    c += (texture(uTex, vUv + o) + texture(uTex, vUv - o)) * W[i];
  }
  outColor = c;
}`;

  const FS_BRIGHT = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uTex;
uniform float uThreshold;
out vec4 outColor;
void main() {
  vec3 c = texture(uTex, vUv).rgb;
  float l = max(c.r, max(c.g, c.b));
  outColor = vec4(c * smoothstep(uThreshold, uThreshold + 0.35, l), 1.0);
}`;

  const FS_FINAL = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform float uBloomK;
uniform vec2 uRes;
uniform float uTime;
out vec4 outColor;
void main() {
  vec3 c = texture(uScene, vUv).rgb + texture(uBloom, vUv).rgb * uBloomK;
  outColor = vec4(c, 1.0);
}`;

  function compileShader(gl, type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(sh);
      gl.deleteShader(sh);
      throw new Error(`Shader compile failed: ${log}`);
    }
    return sh;
  }

  function makeProgram(gl, vs, fs) {
    const prog = gl.createProgram();
    const vShader = compileShader(gl, gl.VERTEX_SHADER, vs);
    const fShader = compileShader(gl, gl.FRAGMENT_SHADER, fs);
    gl.attachShader(prog, vShader);
    gl.attachShader(prog, fShader);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(prog));
    }
    const cache = new Map();
    const u = (name) => {
      if (!cache.has(name)) cache.set(name, gl.getUniformLocation(prog, name));
      return cache.get(name);
    };
    return { prog, u };
  }

  class WebGL2Renderer {
    constructor(canvas) {
      this.canvas = canvas;
      const gl = canvas.getContext('webgl2', {
        alpha: false,
        antialias: false,
        premultipliedAlpha: false,
        powerPreference: 'high-performance',
      });
      if (!gl) throw new Error('WebGL2 is not supported in this environment');
      this.gl = gl;
      this.floatRT = !!gl.getExtension('EXT_color_buffer_float');
      this.aniso = gl.getExtension('EXT_texture_filter_anisotropic');

      this.p = {
        part: makeProgram(gl, VS_PART, FS_PART),
        partShadow: makeProgram(gl, VS_PART, FS_PART_SHADOW),
        stick: makeProgram(gl, VS_STICK, FS_STICK),
        stickShadow: makeProgram(gl, VS_STICK, FS_STICK_SHADOW),
        bg: makeProgram(gl, VS_FULL, FS_BG),
        blur: makeProgram(gl, VS_FULL, FS_BLUR),
        bright: makeProgram(gl, VS_FULL, FS_BRIGHT),
        final: makeProgram(gl, VS_FULL, FS_FINAL),
      };

      this.quadVao = gl.createVertexArray();
      gl.bindVertexArray(this.quadVao);
      const qb = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, qb);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

      this.stickVao = gl.createVertexArray();
      gl.bindVertexArray(this.stickVao);
      this.stickBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.stickBuf);
      gl.bufferData(gl.ARRAY_BUFFER, 4096 * 4, gl.DYNAMIC_DRAW);
      const stride = 6 * 4;
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, stride, 0);
      gl.enableVertexAttribArray(1);
      gl.vertexAttribPointer(1, 2, gl.FLOAT, false, stride, 8);
      gl.enableVertexAttribArray(2);
      gl.vertexAttribPointer(2, 2, gl.FLOAT, false, stride, 16);

      this.emptyVao = gl.createVertexArray();
      gl.bindVertexArray(null);

      this.tex = {};
      this.rt = {};
      this.size = [0, 0];
    }

    async loadTexture(key, url) {
      const gl = this.gl;
      const img = new Image();
      img.src = url;
      await img.decode();
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      if (this.aniso) gl.texParameterf(gl.TEXTURE_2D, this.aniso.TEXTURE_MAX_ANISOTROPY_EXT, 4);
      this.tex[key] = { tex, w: img.naturalWidth, h: img.naturalHeight };
    }

    makeRT(w, h, float) {
      const gl = this.gl;
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      if (float) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
      else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      return { tex, fb, w, h };
    }

    resize(w, h) {
      if (w === this.size[0] && h === this.size[1]) return;
      const gl = this.gl;
      for (const rt of Object.values(this.rt)) {
        gl.deleteTexture(rt.tex);
        gl.deleteFramebuffer(rt.fb);
      }
      this.canvas.width = w;
      this.canvas.height = h;
      const hw = Math.max(1, w >> 1), hh = Math.max(1, h >> 1);
      const qw = Math.max(1, w >> 2), qh = Math.max(1, h >> 2);
      this.rt = {
        scene: this.makeRT(w, h, this.floatRT),
        shadow0: this.makeRT(hw, hh, false),
        shadow1: this.makeRT(hw, hh, false),
        shadowTmp: this.makeRT(hw, hh, false),
        bloomA: this.makeRT(qw, qh, this.floatRT),
        bloomB: this.makeRT(qw, qh, this.floatRT),
      };
      this.size = [w, h];
    }

    bindRT(rt) {
      const gl = this.gl;
      gl.bindFramebuffer(gl.FRAMEBUFFER, rt ? rt.fb : null);
      gl.viewport(0, 0, rt ? rt.w : this.size[0], rt ? rt.h : this.size[1]);
    }

    fullscreen(prog) {
      const gl = this.gl;
      gl.useProgram(prog.prog);
      gl.bindVertexArray(this.emptyVao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    bindTex(unit, tex) {
      const gl = this.gl;
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
    }

    blur(src, tmp, px) {
      const gl = this.gl;
      const { blur } = this.p;
      const step = Math.max(px / 4, 0.001);
      gl.useProgram(blur.prog);
      gl.uniform1i(blur.u('uTex'), 0);
      this.bindRT(tmp);
      this.bindTex(0, src.tex);
      gl.uniform2f(blur.u('uDir'), step / src.w, 0);
      this.fullscreen(blur);
      this.bindRT(src);
      this.bindTex(0, tmp.tex);
      gl.uniform2f(blur.u('uDir'), 0, step / src.h);
      this.fullscreen(blur);
    }

    setLight(prog, f) {
      const gl = this.gl;
      gl.uniform3f(prog.u('uLamp'), ...f.lamp);
      gl.uniform3f(prog.u('uEye'), ...f.eye);
      gl.uniform3f(prog.u('uLampColor'), ...f.lampColor);
      gl.uniform1f(prog.u('uIntensity'), f.intensity);
    }

    drawPart(prog, item, f, proj, lit) {
      const gl = this.gl;
      const t = this.tex[item.key];
      if (!t) return;
      const m = item.m;
      gl.uniform3f(prog.u('uM0'), m[0], m[2], m[4]);
      gl.uniform3f(prog.u('uM1'), m[1], m[3], m[5]);
      gl.uniform2f(prog.u('uSize'), t.w, t.h);
      gl.uniform4f(prog.u('uView'), f.view.x, f.view.y, f.view.w, f.view.h);
      gl.uniform4f(prog.u('uProj'), ...proj);
      this.bindTex(0, t.tex);
      gl.uniform1i(prog.u('uTex'), 0);
      if (lit) {
        gl.uniform2f(prog.u('uTexel'), 1 / t.w, 1 / t.h);
        gl.uniform2f(prog.u('uTilt'), ...(item.tilt ?? [0, 0]));
        gl.uniform1f(prog.u('uBump'), 5.5);
      } else {
        gl.uniform1f(prog.u('uTint'), 0.22);
      }
      gl.bindVertexArray(this.quadVao);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    drawStick(prog, item, f, proj, lit) {
      const gl = this.gl;
      const pts = item.pts;
      const data = [];
      let v = 0;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[Math.max(0, i - 1)].p, b = pts[Math.min(pts.length - 1, i + 1)].p;
        let dx = b[0] - a[0], dy = b[1] - a[1];
        const l = Math.hypot(dx, dy) || 1;
        dx /= l;
        dy /= l;
        const nx = -dy, ny = dx;
        if (i > 0) v += Math.hypot(pts[i].p[0] - pts[i - 1].p[0], pts[i].p[1] - pts[i - 1].p[1]);
        const w = pts[i].w;
        const pad = 1 + 1.5 / Math.max(w, 0.5);
        const [px, py] = pts[i].p;
        data.push(px - nx * w * pad, py - ny * w * pad, -pad, v, nx, ny);
        data.push(px + nx * w * pad, py + ny * w * pad, pad, v, nx, ny);
      }
      gl.bindVertexArray(this.stickVao);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.stickBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(data));
      gl.uniform4f(prog.u('uView'), f.view.x, f.view.y, f.view.w, f.view.h);
      gl.uniform4f(prog.u('uProj'), ...proj);
      if (lit) {
        const ties = new Float32Array(8);
        item.ties.slice(0, 4).forEach((t, i) => {
          ties[i * 2] = t[0];
          ties[i * 2 + 1] = t[1];
        });
        gl.uniform2fv(prog.u('uTies'), ties);
        gl.uniform1i(prog.u('uTieCount'), Math.min(4, item.ties.length));
        if (item.style === 'gapit') {
          gl.uniform3f(prog.u('uColorA'), 0.075, 0.045, 0.03);
          gl.uniform3f(prog.u('uColorB'), 0.42, 0.22, 0.08);
          gl.uniform1f(prog.u('uSeed'), 3.1);
        } else {
          gl.uniform3f(prog.u('uColorA'), 0.11, 0.065, 0.035);
          gl.uniform3f(prog.u('uColorB'), 0.46, 0.27, 0.11);
          gl.uniform1f(prog.u('uSeed'), 11.7);
        }
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, pts.length * 2);
    }

    drawItems(items, f, proj, lit) {
      const gl = this.gl;
      const partProg = lit ? this.p.part : this.p.partShadow;
      const stickProg = lit ? this.p.stick : this.p.stickShadow;
      for (const item of items) {
        const prog = item.kind === 'part' ? partProg : stickProg;
        gl.useProgram(prog.prog);
        if (lit) this.setLight(prog, f);
        gl.uniform1f(prog.u('uAlpha'), item.alpha ?? 1);
        if (item.kind === 'part') this.drawPart(prog, item, f, proj, lit);
        else this.drawStick(prog, item, f, proj, lit);
      }
    }

    render(f) {
      const gl = this.gl;
      const { rt, p } = this;
      const [W, H] = this.size;

      const layers = f.layers.slice(0, 2);
      const shadowRTs = [rt.shadow0, rt.shadow1];
      const strengths = [0, 0];
      const pxPerStage = rt.shadow0.w / f.view.w;

      // 1. Offscreen Shadows with Depth Blur
      layers.forEach((layer, i) => {
        const target = shadowRTs[i];
        this.bindRT(target);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        const proj = [f.lamp[0], f.lamp[1], layer.shadow.scale, layer.shadow.dy];
        this.drawItems(layer.items, f, proj, false);
        gl.disable(gl.BLEND);
        const px = layer.shadow.blur * pxPerStage;
        this.blur(target, rt.shadowTmp, px);
        if (px > 6) this.blur(target, rt.shadowTmp, px * 0.5);
        strengths[i] = layer.shadow.strength;
      });

      // 2. Lit Linen Kelir Background + Composited Soft Shadows
      this.bindRT(rt.scene);
      gl.useProgram(p.bg.prog);
      this.bindTex(0, this.tex.background.tex);
      this.bindTex(1, rt.shadow0.tex);
      this.bindTex(2, rt.shadow1.tex);
      gl.uniform1i(p.bg.u('uBg'), 0);
      gl.uniform1i(p.bg.u('uShadow0'), 1);
      gl.uniform1i(p.bg.u('uShadow1'), 2);
      gl.uniform4f(p.bg.u('uView'), f.view.x, f.view.y, f.view.w, f.view.h);
      gl.uniform2f(p.bg.u('uHot'), f.hot[0], f.hot[1]);
      gl.uniform1f(p.bg.u('uFlicker'), f.flicker);
      gl.uniform2f(p.bg.u('uShadowK'), strengths[0], strengths[1]);
      gl.uniform1f(p.bg.u('uTime'), f.time);
      this.fullscreen(p.bg);

      // 3. Lit Puppets with Prada Specular Sheen & Horn Rods
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      for (const layer of layers) this.drawItems(layer.items, f, [0, 0, 1, 0], true);
      gl.disable(gl.BLEND);

      // 4. Bloom from Blencong Highlights
      this.bindRT(rt.bloomA);
      gl.useProgram(p.bright.prog);
      this.bindTex(0, rt.scene.tex);
      gl.uniform1i(p.bright.u('uTex'), 0);
      gl.uniform1f(p.bright.u('uThreshold'), 1.05);
      this.fullscreen(p.bright);
      this.blur(rt.bloomA, rt.bloomB, 10);
      this.blur(rt.bloomA, rt.bloomB, 22);

      // 5. Final Grade, Vignette & Film Grain
      this.bindRT(null);
      gl.useProgram(p.final.prog);
      this.bindTex(0, rt.scene.tex);
      this.bindTex(1, rt.bloomA.tex);
      gl.uniform1i(p.final.u('uScene'), 0);
      gl.uniform1i(p.final.u('uBloom'), 1);
      gl.uniform1f(p.final.u('uBloomK'), 0.22);
      gl.uniform2f(p.final.u('uRes'), W, H);
      gl.uniform1f(p.final.u('uTime'), f.time);
      this.fullscreen(p.final);
    }
  }

  // ==========================================================================
  // 5. BEAT CLOCK & GAMELAN AUDIO SYNCHRONIZER
  // ==========================================================================
  class BeatClock {
    constructor(audioEl, fallbackPeriod = 0.68) {
      this.el = audioEl;
      this.beats = null;
      this.fallback = fallbackPeriod;
      this.mt = 0;
      this.pos = 0;
      this.period = fallbackPeriod;
    }

    async load(url) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.beats) && data.beats.length > 2) this.beats = data.beats;
        }
      } catch (err) {
        console.warn('Wayang Motion: Beat grid fallback to steady tempo', err);
      }
    }

    posAt(t) {
      const B = this.beats;
      if (!B) return t / this.fallback;
      const n = B.length;
      if (t <= B[0]) return (t - B[0]) / (B[1] - B[0]);
      if (t >= B[n - 1]) return n - 1 + (t - B[n - 1]) / (B[n - 1] - B[n - 2]);
      let lo = 0, hi = n - 1;
      while (hi - lo > 1) {
        const m = (lo + hi) >> 1;
        if (B[m] <= t) lo = m;
        else hi = m;
      }
      return lo + (t - B[lo]) / (B[hi] - B[lo]);
    }

    periodAt(t) {
      if (!this.beats) return this.fallback;
      const i = Math.max(1, Math.min(this.beats.length - 1, Math.floor(this.posAt(t)) + 1));
      return this.beats[i] - this.beats[i - 1];
    }

    get synced() {
      return !!this.beats && !this.el.paused && this.el.volume > 0.01;
    }

    tick(dt) {
      if (this.synced) {
        const ct = this.el.currentTime;
        this.mt += dt;
        if (Math.abs(ct - this.mt) > 0.15) this.mt = ct;
        else this.mt += (ct - this.mt) * 0.1;
        const pos = this.posAt(this.mt);
        this.period = this.periodAt(this.mt);
        let db = pos - this.pos;
        if (db < -0.5 || db > 4) db = dt / this.period;
        this.pos = pos;
        return { db: Math.max(0, db), pos, period: this.period, synced: true };
      }
      this.period = this.fallback;
      this.pos += dt / this.fallback;
      return { db: dt / this.fallback, pos: this.pos, period: this.fallback, synced: false };
    }
  }

  // ==========================================================================
  // 6. MULTI-HAND TRACKING CONTROLLER
  // ==========================================================================
  const WRIST = 0, THUMB_MCP = 2, THUMB_TIP = 4, INDEX_MCP = 5, INDEX_TIP = 8;
  const MIDDLE_MCP = 9, RING_MCP = 13, PINKY_MCP = 17, PINKY_TIP = 20;

  const FINGER_PAIRS = {
    'thumb-index': { a: THUMB_TIP, aBase: THUMB_MCP, b: INDEX_TIP, bBase: INDEX_MCP },
    'thumb-pinky': { a: THUMB_TIP, aBase: THUMB_MCP, b: PINKY_TIP, bBase: PINKY_MCP },
    'index-pinky': { a: INDEX_TIP, aBase: INDEX_MCP, b: PINKY_TIP, bBase: PINKY_MCP },
  };

  const LOST_MS = 600;
  const RECOVERY_GRACE_MS = 500;
  const PINKY_HOLD_MS = 280;
  const PINKY_REARM_MS = 350;

  function makeSlot() {
    const pos = () => new OneEuro(0.75, 4.0, 1.0);
    return {
      active: false,
      isRecovering: false,
      lastSeen: 0,
      lastTs: 0,
      rawPalm: null,
      vel: [0, 0],
      f: {
        px: pos(),
        py: pos(),
        ax: new OneEuro(0.9, 4.5, 1.0),
        ay: new OneEuro(0.9, 4.5, 1.0),
        bx: new OneEuro(0.9, 4.5, 1.0),
        by: new OneEuro(0.9, 4.5, 1.0),
        size: new OneEuro(0.5, 1.5, 1.0),
        roll: new OneEuro(0.8, 2.5, 1.0),
      },
      leftIsA: true,
      role: null,
      data: null,
      handedness: null,
      landmarks: null,
      pinky: false,
      pinkyOn: 0,
      pinkyOff: 0,
      pinkyArmed: true,
      danceTrigger: false,
    };
  }

  function resetSlot(s) {
    s.active = false;
    s.isRecovering = false;
    s.data = null;
    s.rawPalm = null;
    s.vel = [0, 0];
    s.role = null;
    s.handedness = null;
    s.landmarks = null;
    s.pinky = false;
    s.pinkyOn = 0;
    s.pinkyOff = 0;
    s.pinkyArmed = true;
    s.danceTrigger = false;
    for (const f of Object.values(s.f)) f.reset();
  }

  function analyzeHand(lms, aspect, pair) {
    const P = lms.map((l) => [(1 - l.x) * aspect, l.y]);
    const avg = (...ids) => [ids.reduce((s, i) => s + P[i][0], 0) / ids.length, ids.reduce((s, i) => s + P[i][1], 0) / ids.length];
    const d = (i, j) => Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1]);
    const reach = (mcp, pip, tip) => ({ tipPip: d(WRIST, tip) / (d(WRIST, pip) || 1e-4), tipMcp: d(WRIST, tip) / (d(WRIST, mcp) || 1e-4) });
    const index = reach(5, 6, 8), middle = reach(9, 10, 12), ring = reach(13, 14, 16), pinky = reach(17, 18, 20);

    const pinkySign =
      pinky.tipPip > 1.12 && pinky.tipMcp > 1.4 && index.tipPip < 1.02 && middle.tipPip < 1.02 && ring.tipPip < 1.12;

    return {
      pinkySign,
      palm: avg(WRIST, INDEX_MCP, MIDDLE_MCP, RING_MCP, PINKY_MCP),
      size: Math.max(d(WRIST, MIDDLE_MCP), d(INDEX_MCP, PINKY_MCP) * 1.3),
      roll: Math.atan2(P[MIDDLE_MCP][0] - P[WRIST][0], -(P[MIDDLE_MCP][1] - P[WRIST][1])),
      a: P[pair.a],
      b: P[pair.b],
      aBase: P[pair.aBase],
      bBase: P[pair.bBase],
    };
  }

  class HandController {
    constructor() {
      this.source = 'ready';
      this.settings = { fingers: 'thumb-index', bodyHand: 'right', characters: 'two' };
      this._puppetCount = 2;
      this.slots = [makeSlot(), makeSlot()];
      this.bodySlot = -1;
      this.calibs = {};
      this.mouse = { x: 960, y: 640, depth: 0, seen: false, dragging: false };
      this.status = { hands: 0, mode: 'ready', calibrating: false };
      this.prevCount = 0;
      this.home = [[740, 650], [1180, 650]];
      this.pendingDance = [false, false];
      this.demoDance = -1;
      this.aspect = 16 / 9;
      this.lastIngestTs = 0;
    }

    requestDance(i = null) {
      for (let j = 0; j < this.puppetCount; j++) if (i === null || i === j) this.pendingDance[j] = true;
    }

    get puppetCount() {
      return this._puppetCount ?? 2;
    }

    set puppetCount(val) {
      this._puppetCount = Math.max(1, Math.min(2, Number(val) || 1));
    }

    recalibrate() {
      this.calibs = {};
    }

    toStage(nx, ny, view) {
      const u = (nx - 0.12) / 0.76;
      const v = (ny - 0.1) / 0.8;
      return [view.x + view.w * (0.06 + 0.88 * u), view.y + view.h * (0.26 + 0.62 * v)];
    }

    ingest(landmarksList, handednessList, ts) {
      const now = ts || performance.now();
      const pair = FINGER_PAIRS[this.settings.fingers] || FINGER_PAIRS['thumb-index'];

      // Parse all detected hands (up to maxNumHands = 4)
      const detected = (landmarksList || []).map((lm, i) => {
        const handInfo = (handednessList && handednessList[i]) ? handednessList[i] : null;
        return {
          idx: i,
          lm,
          handedness: handInfo?.label || null,
          confidence: handInfo?.score || 0.5,
          h: analyzeHand(lm, this.aspect, pair),
        };
      });

      const assignments = new Map(); // handIndex -> slotIndex
      const usedSlots = new Set();
      const usedHands = new Set();

      // Priority 1: Match existing active slots or slots in recovery grace period to continuing hands
      const candidates = [];
      this.slots.forEach((s, si) => {
        if (!s.active && now - s.lastSeen > RECOVERY_GRACE_MS) return;
        detected.forEach((d, hi) => {
          let cost = 1e6;
          if (s.rawPalm) {
            // Motion prediction using slot velocity
            const dtPred = clamp((now - s.lastTs) / 1000, 0.01, 0.12);
            const predX = s.rawPalm[0] + (s.vel ? s.vel[0] * dtPred * 0.6 : 0);
            const predY = s.rawPalm[1] + (s.vel ? s.vel[1] * dtPred * 0.6 : 0);
            const dx = d.h.palm[0] - predX;
            const dy = d.h.palm[1] - predY;
            const dist = Math.hypot(dx, dy);

            // Gating radius: 0.70 normalized aspect space allows rapid hand movement
            if (dist < 0.70) {
              cost = dist;
              // Handedness consistency penalty
              if (s.handedness && d.handedness && s.handedness !== d.handedness) {
                cost += 0.20;
              }
              // Hand size consistency penalty
              if (s.data && s.data.size) {
                const sizeRatio = d.h.size / (s.data.size || 1);
                if (sizeRatio < 0.5 || sizeRatio > 2.0) cost += 0.20;
              }
              // Spatial continuity: Slot 0 (Wahyana) prefers left half; Slot 1 (Brajawisena) prefers right half
              const normX = d.h.palm[0] / this.aspect;
              if (si === 0 && normX > 0.65) cost += 0.15;
              if (si === 1 && normX < 0.35) cost += 0.15;
            }
          }
          if (cost < 0.75) {
            candidates.push({ hi, si, cost });
          }
        });
      });

      candidates.sort((a, b) => a.cost - b.cost);
      for (const c of candidates) {
        if (usedHands.has(c.hi) || usedSlots.has(c.si)) continue;
        assignments.set(c.hi, c.si);
        usedHands.add(c.hi);
        usedSlots.add(c.si);
      }

      // Priority 2: For any remaining unassigned slots that are completely inactive, assign available hands
      // Evaluate all (slot, hand) pairs globally so slot 0 does not greedily steal a hand on the right
      const newCandidates = [];
      this.slots.forEach((s, si) => {
        if (usedSlots.has(si)) return;
        if (s.active && now - s.lastSeen <= RECOVERY_GRACE_MS) return;

        const targetNormX = si === 0 ? 0.30 : 0.70;
        detected.forEach((d, hi) => {
          if (usedHands.has(hi)) return;
          const normX = d.h.palm[0] / this.aspect;
          let cost = Math.abs(normX - targetNormX);
          // Penalty if hand is placed on the opposite person's half
          if (si === 0 && normX > 0.52) cost += 0.40;
          if (si === 1 && normX < 0.48) cost += 0.40;
          newCandidates.push({ hi, si, cost });
        });
      });

      newCandidates.sort((a, b) => a.cost - b.cost);
      for (const c of newCandidates) {
        if (usedHands.has(c.hi) || usedSlots.has(c.si)) continue;
        assignments.set(c.hi, c.si);
        usedHands.add(c.hi);
        usedSlots.add(c.si);
      }

      // Update matched slots
      for (const [hi, si] of assignments.entries()) {
        const s = this.slots[si];
        const d = detected[hi];
        const h = d.h;
        const dt = s.active ? clamp((now - s.lastTs) / 1000, 0.005, 0.1) : 0.033;

        // Adaptive outlier rejection & plausible speed clamping (supports fast dalang action)
        let clampedPalmX = h.palm[0];
        let clampedPalmY = h.palm[1];
        if (s.rawPalm) {
          const maxSpeed = 10.0; // Normalized units per second
          const maxDisplacement = maxSpeed * Math.max(dt, 0.016);
          const dx = clampedPalmX - s.rawPalm[0];
          const dy = clampedPalmY - s.rawPalm[1];
          const dist = Math.hypot(dx, dy);
          if (dist > maxDisplacement) {
            clampedPalmX = s.rawPalm[0] + (dx / dist) * maxDisplacement;
            clampedPalmY = s.rawPalm[1] + (dy / dist) * maxDisplacement;
          }
          const vx = (clampedPalmX - s.rawPalm[0]) / Math.max(dt, 0.005);
          const vy = (clampedPalmY - s.rawPalm[1]) / Math.max(dt, 0.005);
          s.vel = [
            s.vel ? lerp(s.vel[0], vx, 0.35) : vx,
            s.vel ? lerp(s.vel[1], vy, 0.35) : vy,
          ];
        } else {
          s.vel = [0, 0];
        }

        s.rawPalm = [clampedPalmX, clampedPalmY];
        s.active = true;
        s.isRecovering = false;
        s.lastSeen = now;
        s.lastTs = now;
        s.handedness = d.handedness;
        s.landmarks = d.lm;

        s.pinky = h.pinkySign;
        if (h.pinkySign) {
          s.pinkyOn += dt * 1000;
          s.pinkyOff = 0;
          if (s.pinkyArmed && s.pinkyOn >= PINKY_HOLD_MS) {
            s.danceTrigger = true;
            s.pinkyArmed = false;
          }
        } else {
          s.pinkyOff += dt * 1000;
          if (s.pinkyOff >= PINKY_REARM_MS) {
            s.pinkyOn = 0;
            s.pinkyArmed = true;
          }
        }

        const f = s.f;
        const side = (h.bBase[0] - h.aBase[0]) / (h.size || 1e-4);
        if (side > 0.12) s.leftIsA = true;
        else if (side < -0.12) s.leftIsA = false;

        s.data = {
          palm: [f.px.filter(clampedPalmX, dt), f.py.filter(clampedPalmY, dt)],
          a: [f.ax.filter(h.a[0], dt), f.ay.filter(h.a[1], dt)],
          b: [f.bx.filter(h.b[0], dt), f.by.filter(h.b[1], dt)],
          size: f.size.filter(h.size, dt),
          roll: f.roll.filter(h.roll, dt),
        };
      }

      // Mark unassigned slots as recovering or expired
      this.slots.forEach((s, si) => {
        if (!usedSlots.has(si) && s.active) {
          const elapsed = now - s.lastSeen;
          if (elapsed > 1200) {
            resetSlot(s);
          } else {
            s.isRecovering = true;
            s.vel = [0, 0];
          }
        }
      });
    }

    activeSlots(now) {
      return this.slots
        .map((s, i) => ({ s, i }))
        .filter(({ s }) => s.active && s.data && (now - s.lastSeen <= RECOVERY_GRACE_MS || s.isRecovering));
    }

    depthFor(key, size) {
      let c = this.calibs[key];
      if (!c) c = this.calibs[key] = { base: null, samples: [] };
      if (c.base === null) {
        c.samples.push(size);
        if (c.samples.length >= 20) {
          const sorted = [...c.samples].sort((a, b) => a - b);
          c.base = sorted[sorted.length >> 1];
        }
        this.status.calibrating = true;
        return 0;
      }
      return clamp((size / c.base - 1) * 1.7, -0.35, 1.0);
    }

    handInput(slot, view, calibKey) {
      const d = slot.data;
      const aspect = this.aspect;
      const [x, y] = this.toStage(d.palm[0] / aspect, d.palm[1], view);
      const rel = (tip) => ({
        type: 'rel',
        dx: (tip[0] - d.palm[0]) / (d.size || 1e-4),
        dy: (tip[1] - d.palm[1]) / (d.size || 1e-4),
        rodX: this.toStage(tip[0] / aspect, tip[1], view)[0],
      });
      const A = rel(d.a), B = rel(d.b);
      const danceTrigger = slot.danceTrigger;
      slot.danceTrigger = false;
      return {
        active: true,
        body: { x, y },
        tilt: clamp(d.roll * 0.65, -0.45, 0.45),
        depth: this.depthFor(calibKey, d.size),
        arms: { left: slot.leftIsA ? A : B, right: slot.leftIsA ? B : A },
        danceTrigger,
      };
    }

    twoPuppetInput(active, view) {
      this.slots[0].role = 0;
      this.slots[1].role = 1;

      this.status.mode = active.length ? 'two puppets' : 'no hands';
      const out = [this.idleInput(0), this.idleInput(1)];

      for (const { s, i } of active) {
        if (s.data) {
          out[i] = this.handInput(s, view, `p${i}`);
        }
      }
      return out;
    }

    onePuppetInput(active, view) {
      const activeIdx = state.selectedCharacter === 'prabu-brajawisena' ? 1 : 0;
      if (!active.length) {
        this.status.mode = 'no hands';
        return [this.idleInput(activeIdx)];
      }

      if (this.bodySlot === -1 || !active.some((a) => a.i === this.bodySlot)) {
        this.bodySlot = active[0].i;
      }

      const bodySlotObj = this.slots[this.bodySlot];
      const input = this.handInput(bodySlotObj, view, 'one');

      if (active.length === 1) {
        this.status.mode = 'one hand';
      } else {
        const rodSlotObj = active.find((a) => a.i !== this.bodySlot)?.s;
        if (rodSlotObj && rodSlotObj.data) {
          const aspect = this.aspect;
          const abs = (tip) => {
            const [x, y] = this.toStage(tip[0] / aspect, tip[1], view);
            return { type: 'abs', x, y, rodX: x };
          };
          const A = abs(rodSlotObj.data.a), B = abs(rodSlotObj.data.b);
          input.arms = { left: rodSlotObj.leftIsA ? A : B, right: rodSlotObj.leftIsA ? B : A };
          input.danceTrigger = input.danceTrigger || rodSlotObj.danceTrigger;
          rodSlotObj.danceTrigger = false;
        }
      }
      return [input];
    }

    cameraInput(now, view) {
      const active = this.activeSlots(now);
      this.status.hands = active.length;
      this.status.calibrating = false;
      const out = this.puppetCount === 2 ? this.twoPuppetInput(active, view) : this.onePuppetInput(active, view);
      this.prevCount = active.length;
      return out;
    }

    readyInput(view) {
      return [
        {
          active: false,
          body: { x: this.home[0][0], y: this.home[0][1] },
          tilt: 0,
          depth: 0,
          arms: null,
          danceTrigger: false,
        },
        {
          active: false,
          body: { x: this.home[1][0], y: this.home[1][1] },
          tilt: 0,
          depth: 0,
          arms: null,
          danceTrigger: false,
        },
      ];
    }

    demoInput(t, view) {
      const cx = view.x + view.w / 2;
      const drift = Math.sin(t * 0.13) * view.w * 0.08;
      const floor = view.y + view.h * 0.6;
      const talk = (phase, amp) => ({
        left: { type: 'rel', dx: -0.95 + Math.sin(t * 1.7 + phase) * 0.35 * amp, dy: -0.25 + Math.sin(t * 1.1 + phase) * 0.8 * amp },
        right: { type: 'rel', dx: 0.55 + Math.sin(t * 1.3 + phase) * 0.3, dy: 0.45 + Math.sin(t * 0.9 + phase) * 0.55 },
      });
      const turn = Math.sin(t * 0.5);
      const m = (s) => ({ ...s, dx: -s.dx });
      const mirrorArms = (arms) => ({ left: m(arms.right), right: m(arms.left) });

      if (this.puppetCount === 1) {
        return [{
          active: true,
          body: { x: cx + drift * 0.4, y: floor + Math.sin(t * 0.9) * 16 },
          tilt: Math.sin(t * 0.55) * 0.05,
          depth: Math.max(0, Math.sin(t * 0.21 - 1.2)) * 0.5,
          arms: talk(1, 0.75),
        }];
      }

      return [
        {
          active: true,
          body: { x: view.x + view.w * 0.38 + drift * 0.35, y: floor + Math.sin(t * 0.9) * 12 },
          tilt: Math.sin(t * 0.55) * 0.04,
          depth: Math.max(0, Math.sin(t * 0.21 - 1.2)) * 0.35,
          arms: talk(1, turn < 0 ? 0.95 : 0.4),
        },
        {
          active: true,
          body: { x: view.x + view.w * 0.65 - drift * 0.35, y: floor + Math.cos(t * 0.85) * 12 },
          tilt: -Math.sin(t * 0.6) * 0.04,
          depth: Math.max(0, Math.cos(t * 0.23 - 0.8)) * 0.35,
          arms: mirrorArms(talk(2.2, turn > 0 ? 0.95 : 0.4)),
        },
      ];
    }

    idleInput(i = 0) {
      const homePos = this.home[i] || this.home[0] || [960, 650];
      return {
        active: true,
        body: {
          x: homePos[0],
          y: homePos[1],
        },
        tilt: 0,
        depth: 0,
        arms: null,
        danceTrigger: false,
      };
    }

    mouseInput(t) {
      const activeIdx = state.selectedCharacter === 'prabu-brajawisena' ? 1 : 0;
      const idle0 = this.idleInput(0);
      const idle1 = this.idleInput(1);
      if (this.puppetCount === 2) {
        if (activeIdx === 0) {
          return [
            this.mouse.seen ? { ...idle0, body: { x: this.mouse.x, y: this.mouse.y }, depth: this.mouse.depth } : idle0,
            idle1,
          ];
        } else {
          return [
            idle0,
            this.mouse.seen ? { ...idle1, body: { x: this.mouse.x, y: this.mouse.y }, depth: this.mouse.depth } : idle1,
          ];
        }
      }
      return [
        this.mouse.seen ? { ...(activeIdx === 1 ? idle1 : idle0), body: { x: this.mouse.x, y: this.mouse.y }, depth: this.mouse.depth } : { active: false },
      ];
    }

    update(t, view) {
      if (this.puppetCount === 1) {
        this.home = [
          [view.x + view.w * 0.5, view.y + view.h * 0.6],
          [view.x + view.w * 0.5, view.y + view.h * 0.6],
        ];
      } else {
        this.home = [
          [view.x + view.w * 0.38, view.y + view.h * 0.6],
          [view.x + view.w * 0.62, view.y + view.h * 0.6],
        ];
      }
      let inputs;
      if (this.source === 'camera') {
        inputs = this.cameraInput(performance.now(), view);
      } else if (this.source === 'mouse') {
        this.status.mode = 'mouse';
        inputs = this.mouseInput(t);
      } else {
        this.status.mode = 'ready';
        inputs = this.readyInput(view);
      }
      inputs.forEach((inp, i) => {
        if (this.pendingDance[i]) inp.danceTrigger = true;
      });
      this.pendingDance = [false, false];
      return inputs;
    }
  }

  // ==========================================================================
  // 7. 2D CANVAS HEADLESS / COMPATIBILITY RENDERER
  // ==========================================================================
  // Fallback for headless Playwright test runners where WebGL2 is not supported
  class Canvas2DFallbackRenderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.images = {};
    }

    async loadTexture(key, url) {
      const img = new Image();
      img.src = url;
      await img.decode();
      this.images[key] = img;
    }

    resize(w, h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }

    render(f) {
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;
      ctx.clearRect(0, 0, w, h);

      // 1. Background (Noticeably darker with deep warm brown & dark mahogany tones)
      if (this.images.background) {
        ctx.drawImage(this.images.background, 0, 0, w, h);
        ctx.fillStyle = 'rgba(28, 14, 6, 0.62)';
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.fillStyle = '#3a2214';
        ctx.fillRect(0, 0, w, h);
      }



      // 2. Render each puppet's items with depth-based soft shadows
      const scaleX = w / f.view.w;
      const scaleY = h / f.view.h;

      for (const layer of f.layers) {
        const depth = Math.max(0, layer.depth || 0);
        const blurRadius = Math.round(3 + 28 * clamp(depth, 0, 1.2));
        const shadowScale = 1.02 + 0.18 * depth;

        // Shadow Pass
        ctx.save();
        ctx.shadowColor = 'rgba(20, 8, 3, 0.75)';
        ctx.shadowBlur = blurRadius;
        ctx.shadowOffsetX = (lampX - w * 0.5) * 0.05 + 8 * shadowScale;
        ctx.shadowOffsetY = 14 + 24 * depth;
        for (const item of layer.items) {
          if (item.kind === 'part') {
            const img = this.images[item.key];
            if (!img) continue;
            ctx.save();
            ctx.transform(
              item.m[0] * scaleX, item.m[1] * scaleY,
              item.m[2] * scaleX, item.m[3] * scaleY,
              (item.m[4] - f.view.x) * scaleX,
              (item.m[5] - f.view.y) * scaleY
            );
            ctx.drawImage(img, 0, 0);
            ctx.restore();
          }
        }
        // Subtle selection aura for selected character
        if (layer.charId && layer.charId === state.selectedCharacter && layer.puppet) {
          const auraX = (layer.puppet.pos.x - f.view.x) * scaleX;
          const auraY = (layer.puppet.pos.y - 120 - f.view.y) * scaleY;
          const auraRadius = Math.max(70, 220 * scaleX * layer.puppet.scale);
          const auraGrad = ctx.createRadialGradient(auraX, auraY, 20, auraX, auraY, auraRadius);
          auraGrad.addColorStop(0, 'rgba(214, 174, 124, 0.28)');
          auraGrad.addColorStop(0.5, 'rgba(197, 164, 77, 0.12)');
          auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.save();
          ctx.fillStyle = auraGrad;
          ctx.beginPath();
          ctx.arc(auraX, auraY, auraRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Lit Puppet Pass
        for (const item of layer.items) {
          if (item.kind === 'part') {
            const img = this.images[item.key];
            if (!img) continue;
            ctx.save();
            ctx.transform(
              item.m[0] * scaleX, item.m[1] * scaleY,
              item.m[2] * scaleX, item.m[3] * scaleY,
              (item.m[4] - f.view.x) * scaleX,
              (item.m[5] - f.view.y) * scaleY
            );
            ctx.drawImage(img, 0, 0);
            ctx.restore();
          } else if (item.kind === 'stick') {
            const pts = item.pts;
            if (!pts || pts.length < 2) continue;
            ctx.save();
            ctx.strokeStyle = item.style === 'gapit' ? '#140602' : '#2b140a';
            ctx.lineWidth = Math.max(2, (pts[1]?.w || 4) * scaleX);
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo((pts[0].p[0] - f.view.x) * scaleX, (pts[0].p[1] - f.view.y) * scaleY);
            for (let i = 1; i < pts.length; i++) {
              ctx.lineTo((pts[i].p[0] - f.view.x) * scaleX, (pts[i].p[1] - f.view.y) * scaleY);
            }
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }
  }

  // ==========================================================================
  // 8. CONTROLLER & DOM WIREUP
  // ==========================================================================
  const $ = (id) => document.getElementById(id);

  const els = {
    canvas: $('kelir-canvas'),
    video: $('webcam-video'),
    previewCanvas: $('webcam-canvas'),
    pipBox: $('webcam-pip-card'),
    pipGuideText: $('pip-guide-text'),
    stageViewport: $('stage-viewport'),
    stageContainer: $('wayang-experience-container'),
    overlayIntro: $('overlay-intro'),
    overlayLoading: $('overlay-loading'),
    overlayError: $('overlay-error'),
    loadingStepText: $('loading-step-text'),
    errorMessageText: $('error-message-text'),
    errorTitle: $('error-title'),
    btnStart: $('btn-start-motion'),
    btnStartInteractive: $('btn-start-interactive'),
    btnStartInteractiveIntro: $('btn-start-interactive-intro'),
    btnStop: $('btn-stop-camera'),
    btnRetry: $('btn-retry-camera'),
    btnReset: $('btn-reset-puppets'),
    btnFullscreen: $('btn-toggle-fullscreen'),
    btnMinimizePip: $('btn-minimize-pip'),
    btnClosePip: $('btn-close-pip'),
    previewPopout: $('preview-popout'),
    soundToggle: $('sound-toggle'),
    statusPill: $('status'),
    statusDot: $('status-dot'),
    statusText: $('status-text'),
    trackingStatusText: $('tracking-status-text'),
    handCountBadge: $('hand-count-badge'),
    toast: $('toast'),
    fullscreenHudHelper: $('fullscreen-hud-helper'),
    puppetBadgeWahyana: $('puppet-badge-wahyana'),
    puppetBadgeBrajawisena: $('puppet-badge-brajawisena'),
    puppetBadgeLeft: $('puppet-badge-left'),
    puppetBadgeRight: $('puppet-badge-right'),
    puppetBadgeCenter: $('puppet-badge-center'),
    badgeWahyanaRole: $('badge-wahyana-role'),
    badgeWahyanaName: $('badge-wahyana-name'),
    badgeBrajawisenaRole: $('badge-brajawisena-role'),
    badgeBrajawisenaName: $('badge-brajawisena-name'),
    badgeLeftRole: $('badge-left-role'),
    badgeLeftName: $('badge-left-name'),
    badgeRightRole: $('badge-right-role'),
    badgeRightName: $('badge-right-name'),
    debogLabelLeft: $('debog-label-left'),
    debogLabelRight: $('debog-label-right'),
    mobileOrientationModal: $('mobile-orientation-modal'),
    orientationModalTitle: $('orientation-modal-title'),
    orientationModalDesc: $('orientation-modal-desc'),
    orientationHintNote: $('orientation-hint-note'),
    btnOrientationContinue: $('btn-orientation-continue'),
    // On-Stage Character Selector & Badges
    stageCharSelector: $('stage-char-selector'),
    btnSelectWahyana: $('btn-select-wahyana'),
    btnSelectBrajawisena: $('btn-select-brajawisena'),
    btnDuelToggle: $('btn-duel-toggle'),
    duelStatusLabel: $('duel-status-label'),
    btnOpenCharInfo: $('btn-open-char-info'),
    btnReelInfo: $('btn-reel-info'),
    // Character Information & Voice Narration Modal
    charModal: $('character-info-modal'),
    charModalCard: $('character-info-card'),
    btnCloseCharModal: $('btn-close-char-modal'),
    modalTabWahyana: $('modal-tab-wahyana'),
    modalTabBrajawisena: $('modal-tab-brajawisena'),
    charModalSideTag: $('char-modal-side-tag'),
    charModalImg: $('char-modal-img'),
    charModalRole: $('char-modal-role'),
    charModalName: $('char-modal-name'),
    charModalEpithet: $('char-modal-epithet'),
    charModalIntro: $('char-modal-intro'),
    charModalStory: $('char-modal-story'),
    charModalPersonality: $('char-modal-personality'),
    charModalMoral: $('char-modal-moral'),
    charModalSources: $('char-modal-sources'),
    charAudioBox: $('char-audio-box'),
    btnAudioPrimary: $('btn-audio-primary'),
    audioPrimaryIcon: $('audio-primary-icon'),
    audioPrimaryText: $('audio-primary-text'),
    btnAudioStop: $('btn-audio-stop'),
    audioStatusLabel: $('audio-status-label'),
    audioProgressWrap: $('audio-progress-wrap'),
    audioProgressBar: $('audio-progress-bar'),
    audioProgressFill: $('audio-progress-fill'),
    audioTimeCurr: $('audio-time-curr'),
    audioTimeTotal: $('audio-time-total'),
    audioErrorMsg: $('audio-error-msg'),
    audioErrorText: $('audio-error-text'),
    btnRetryNarration: $('btn-retry-narration'),
  };

  if (!els.canvas) {
    console.error('Wayang Motion: Canvas #kelir-canvas not found.');
    return;
  }

  const pctx = els.previewCanvas?.getContext('2d');
  const HAND_EDGES = [
    [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12],
    [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17],
  ];

  // Initialize Both Stage Puppets: Prabu Wahyana & Prabu Brajawisena (Opponent)
  // Wahyana (left) looks right (+1 towards center); Brajawisena (right) looks left (-1 towards center)
  const puppets = [
    new Puppet({ x: 729.6, y: 648, lookDir: 1, id: 'prabu-wahyana', partPrefix: '' }),
    new Puppet({ x: 1190.4, y: 648, lookDir: -1, id: 'prabu-brajawisena', partPrefix: 'braja_' })
  ];
  const controller = new HandController();
  controller.puppetCount = 2; // Duel stage interaction default
  const audioEl = new Audio(resolveWmAsset('assets/audio/backsound.mp3'));
  audioEl.loop = true;
  audioEl.preload = 'none';
  audioEl.volume = 0.6;
  const beatClock = new BeatClock(audioEl);
  beatClock.load(resolveWmAsset('assets/audio/backsound-beats.json'));

  let renderer = null;
  let isWebglActive = false;

  async function initRenderer() {
    try {
      renderer = new WebGL2Renderer(els.canvas);
      isWebglActive = true;
      await Promise.all([
        renderer.loadTexture('background', resolveWmAsset('assets/images/wayang-motion/wayang-stage-reference.jpg')),
        ...Object.entries(PARTS).map(([key, part]) => renderer.loadTexture(key, part.src)),
      ]);
    } catch (err) {
      console.warn('WebGL2 hardware pipeline unavailable, falling back to Canvas 2D engine:', err);
      renderer = new Canvas2DFallbackRenderer(els.canvas);
      isWebglActive = false;
      await Promise.all([
        renderer.loadTexture('background', resolveWmAsset('assets/images/wayang-motion/wayang-stage-reference.jpg')),
        ...Object.entries(PARTS).map(([key, part]) => renderer.loadTexture(key, part.src)),
      ]);
    }
  }

  // ==========================================================================
  // MOBILE ORIENTATION & ENTRY FLOW CONTROLLER
  // ==========================================================================
  let hasAcknowledgedOrientation = false;
  let portraitReminderGiven = false;

  function isMobileOrTablet() {
    const ua = navigator.userAgent || '';
    const isMobileOrTabletUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Tablet|Silk/i.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const minDim = Math.min(window.screen?.width || window.innerWidth, window.screen?.height || window.innerHeight);
    
    // Any touch device where the smaller dimension is <= 1024px is a mobile phone or tablet
    const isTouchDeviceScreen = isTouch && (minDim <= 1024 || window.innerWidth <= 1024);

    return isMobileOrTabletUA || isTouchDeviceScreen;
  }

  function isLandscapeOrientation() {
    if (screen.orientation && typeof screen.orientation.type === 'string') {
      return screen.orientation.type.includes('landscape');
    }
    if (typeof window.orientation !== 'undefined') {
      return Math.abs(window.orientation) === 90;
    }
    return window.innerWidth > window.innerHeight;
  }

  function updateMobileOrientationFlow() {
    const isMobileTablet = isMobileOrTablet();
    const isLandscape = isLandscapeOrientation();

    if (!isMobileTablet) {
      // Desktop / Laptop behavior:
      // Skip mobile orientation screen, show ready-to-start screen directly (camera stays idle until user clicks)
      if (els.mobileOrientationModal) els.mobileOrientationModal.classList.add('hidden');
      if (!state.isActive && !state.isCameraRunning && !state.isStartingCamera) {
        if (els.overlayIntro) els.overlayIntro.classList.remove('hidden', 'gone');
      }
      return;
    }

    // Mobile phone and tablet behavior:
    if (!hasAcknowledgedOrientation) {
      // Step 1: Initial visit on mobile/tablet - show single orientation guidance screen
      if (els.mobileOrientationModal) els.mobileOrientationModal.classList.remove('hidden');
      if (els.overlayIntro) els.overlayIntro.classList.add('hidden', 'gone');

      if (isLandscape) {
        if (els.orientationModalTitle) els.orientationModalTitle.textContent = 'Orientasi Siap';
        if (els.orientationModalDesc) {
          els.orientationModalDesc.textContent = 'Perangkat Anda sudah dalam posisi horizontal. Ketuk Lanjutkan untuk memulai.';
        }
        if (els.orientationHintNote) els.orientationHintNote.style.display = 'none';
      } else {
        if (els.orientationModalTitle) els.orientationModalTitle.textContent = 'Miringkan Perangkat Anda';
        if (portraitReminderGiven) {
          if (els.orientationModalDesc) {
            els.orientationModalDesc.textContent = 'Panggung wayang dirancang untuk posisi horizontal. Silakan miringkan HP atau tablet Anda.';
          }
          if (els.orientationHintNote) els.orientationHintNote.style.display = 'block';
        } else {
          if (els.orientationModalDesc) {
            els.orientationModalDesc.textContent = 'Untuk menikmati pengalaman Wayang Motion, miringkan HP atau tablet Anda ke posisi horizontal.';
          }
          if (els.orientationHintNote) els.orientationHintNote.style.display = 'none';
        }
      }
      return;
    }

    // Step 2: Visitor acknowledged orientation and entered ready-to-start screen
    if (els.mobileOrientationModal) els.mobileOrientationModal.classList.add('hidden');
    if (!state.isActive && !state.isCameraRunning && !state.isStartingCamera) {
      if (els.overlayIntro) els.overlayIntro.classList.remove('hidden', 'gone');
    }
  }

  function handleOrientationContinue() {
    const isLandscape = isLandscapeOrientation();

    if (isLandscape) {
      // Device is horizontal: advance to ready screen
      hasAcknowledgedOrientation = true;
      updateMobileOrientationFlow();
      resizeStage();
      return;
    }

    // Device is still vertical (portrait):
    if (!portraitReminderGiven) {
      // First tap in portrait: prompt to tilt with a non-blocking note for locked screens
      portraitReminderGiven = true;
      updateMobileOrientationFlow();
      return;
    }

    // Second tap in portrait: user cannot or does not want to rotate (e.g. rotation lock active)
    // Never trap the visitor indefinitely; advance to ready screen
    hasAcknowledgedOrientation = true;
    updateMobileOrientationFlow();
    resizeStage();
    showToast('Melanjutkan ke panggung wayang');
  }

  // View state calculation
  let view = { x: 0, y: 0, w: STAGE_W, h: STAGE_H };
  function resizeStage() {
    const isFs = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      state.isFullscreen ||
      state.isFullscreenFallback
    );
    let w, h;
    if (isFs) {
      w = window.innerWidth;
      h = window.innerHeight;
    } else {
      const rect = els.stageViewport ? els.stageViewport.getBoundingClientRect() : { width: 1440, height: 640 };
      // Allow flexible mobile dimensions without clipping to desktop-only 640x480 minimum
      w = Math.max(320, Math.round(rect.width || window.innerWidth || 1440));
      h = Math.max(220, Math.round(rect.height || 480));
    }
    renderer?.resize(w, h);
    const aspect = w / h;
    if (aspect > STAGE_W / STAGE_H) {
      const vh = STAGE_W / aspect;
      view = { x: 0, y: (STAGE_H - vh) * 0.5, w: STAGE_W, h: vh };
    } else {
      const vw = STAGE_H * aspect;
      view = { x: (STAGE_W - vw) * 0.5, y: 0, w: vw, h: STAGE_H };
    }

    // Synchronize camera landmark preview canvas and aspect ratio with current video stream dimensions
    if (els.video && els.video.videoWidth > 0 && els.video.videoHeight > 0) {
      controller.aspect = els.video.videoWidth / els.video.videoHeight;
      if (els.previewCanvas) {
        if (els.previewCanvas.width !== els.video.videoWidth || els.previewCanvas.height !== els.video.videoHeight) {
          els.previewCanvas.width = els.video.videoWidth;
          els.previewCanvas.height = els.video.videoHeight;
        }
      }
    }
  }
  window.addEventListener('resize', () => {
    resizeStage();
    updateMobileOrientationFlow();
  });

  // Runtime State
  const state = {
    isReady: false,
    isActive: false,
    isCameraRunning: false,
    isStartingCamera: false,
    cameraFrameCallbackId: null,
    isFullscreen: false,
    isFullscreenFallback: false,
    shadowMode: false,
    characterMode: 'heritage',
    selectedCharacter: 'prabu-wahyana',
    handsInstance: null,
    cameraInstance: null,
    mediaStream: null,
  };

  // Toast System
  let toastTimer = null;
  function showToast(text, duration = 2600) {
    if (!els.toast) return;
    els.toast.textContent = text;
    els.toast.classList.remove('hidden');
    els.toast.classList.add('show', 'visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      if (els.toast) {
        els.toast.classList.remove('show', 'visible');
        els.toast.classList.add('hidden');
      }
    }, duration);
  }

  // Fullscreen Management
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

    if (els.btnFullscreen) {
      const icon = els.btnFullscreen.querySelector('i');
      const text = els.btnFullscreen.querySelector('span');
      if (isFs) {
        if (icon) icon.className = 'bi bi-fullscreen-exit';
        if (text) text.textContent = 'Keluar Layar Penuh';
        els.btnFullscreen.setAttribute('aria-pressed', 'true');
        els.btnFullscreen.setAttribute('aria-label', 'Keluar Layar Penuh');
        els.btnFullscreen.setAttribute('title', 'Keluar Layar Penuh (ESC)');
      } else {
        if (icon) icon.className = 'bi bi-arrows-fullscreen';
        if (text) text.textContent = 'Layar Penuh';
        els.btnFullscreen.setAttribute('aria-pressed', 'false');
        els.btnFullscreen.setAttribute('aria-label', 'Layar Penuh');
        els.btnFullscreen.setAttribute('title', 'Tampilkan panggung kelir layar penuh (Fullscreen)');
      }
    }

    if (els.fullscreenHudHelper) {
      if (isFs) {
        els.fullscreenHudHelper.classList.remove('hidden');
        setTimeout(() => { if (els.fullscreenHudHelper) els.fullscreenHudHelper.classList.add('hidden'); }, 5000);
      } else {
        els.fullscreenHudHelper.classList.add('hidden');
      }
    }

    requestAnimationFrame(() => {
      resizeStage();
      setTimeout(resizeStage, 80);
      setTimeout(resizeStage, 250);
    });
  }

  function enterFullscreen() {
    const container = els.stageContainer || document.documentElement;
    if (container.requestFullscreen) {
      container.requestFullscreen().catch(() => {
        state.isFullscreenFallback = true;
        updateFullscreenLayout(true);
      });
    } else if (container.webkitRequestFullscreen) {
      try {
        container.webkitRequestFullscreen();
      } catch (e) {
        state.isFullscreenFallback = true;
        updateFullscreenLayout(true);
      }
    } else {
      state.isFullscreenFallback = true;
      updateFullscreenLayout(true);
    }
  }

  function exitFullscreen() {
    const isNativeFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
    if (isNativeFs) {
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {
            state.isFullscreen = false;
            state.isFullscreenFallback = false;
            updateFullscreenLayout(false);
          });
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      } catch (e) {
        state.isFullscreen = false;
        state.isFullscreenFallback = false;
        updateFullscreenLayout(false);
      }
    } else {
      state.isFullscreen = false;
      state.isFullscreenFallback = false;
      updateFullscreenLayout(false);
    }
  }

  function toggleFullscreen() {
    const isFs = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      state.isFullscreen ||
      state.isFullscreenFallback
    );
    if (!isFs) enterFullscreen();
    else exitFullscreen();
  }

  function onFullscreenChange() {
    const isNativeFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
    if (!isNativeFs) {
      state.isFullscreenFallback = false;
    }
    const isFs = isNativeFs || state.isFullscreenFallback;
    updateFullscreenLayout(isFs);
  }

  document.addEventListener('fullscreenchange', onFullscreenChange);
  document.addEventListener('webkitfullscreenchange', onFullscreenChange);

  // Facing Mode
  function applyFacing() {
    const two = controller.puppetCount === 2;
    const mode = els.optFacing ? els.optFacing.value : 'target';
    for (const p of puppets) p.facingMode = mode === 'target' && !two ? 'manual' : mode;
  }

  function turnPuppet(i = null) {
    const targetIdx = (typeof i === 'number') ? i : (state.selectedCharacter === 'prabu-brajawisena' ? 1 : 0);
    if (!puppets[targetIdx]) return;
    if (els.optFacing && els.optFacing.value !== 'manual') {
      els.optFacing.value = 'manual';
      applyFacing();
    }
    puppets[targetIdx].turn();
    if (els.charModal && !els.charModal.classList.contains('hidden') && typeof syncModalOrientation === 'function') {
      syncModalOrientation(puppets[targetIdx], state.selectedCharacter);
    }
  }

  // Audio Playback
  let userExplicitlyMuted = false;

  function syncSoundUi() {
    if (!els.soundToggle) return;
    const isPlaying = !audioEl.paused && !audioEl.muted;
    els.soundToggle.setAttribute('aria-pressed', String(isPlaying));
    els.soundToggle.classList.toggle('playing', isPlaying);
    els.soundToggle.setAttribute('aria-label', isPlaying ? 'Bisukan musik gamelan' : 'Putar musik gamelan');
    els.soundToggle.setAttribute('title', isPlaying ? 'Bisukan Musik Gamelan (M)' : 'Putar Musik Gamelan (M)');
    const onIcon = els.soundToggle.querySelector('.icon-sound-on');
    const offIcon = els.soundToggle.querySelector('.icon-sound-off');
    if (onIcon) onIcon.style.display = isPlaying ? 'block' : 'none';
    if (offIcon) offIcon.style.display = isPlaying ? 'none' : 'block';
  }

  audioEl.addEventListener('play', syncSoundUi);
  audioEl.addEventListener('pause', syncSoundUi);
  audioEl.addEventListener('volumechange', syncSoundUi);
  syncSoundUi();

  function toggleMusic() {
    if (audioEl.paused) {
      audioEl.muted = false;
      userExplicitlyMuted = false;
      const playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          syncSoundUi();
          showToast('Musik Gamelan Dimainkan');
        }).catch((err) => {
          console.warn('Audio playback error:', err);
          syncSoundUi();
          showToast('Ketuk layar untuk mengizinkan audio');
        });
      } else {
        syncSoundUi();
      }
    } else if (audioEl.muted) {
      audioEl.muted = false;
      userExplicitlyMuted = false;
      syncSoundUi();
      showToast('Musik Gamelan Aktif');
    } else {
      audioEl.muted = true;
      userExplicitlyMuted = true;
      syncSoundUi();
      showToast('Musik Gamelan Dibisukan');
    }
  }

  // Reset Puppets Position (Both Wahyana and Brajawisena to stage home)
  function resetPuppetsPosition() {
    if (puppets[0]) {
      puppets[0].defaultLookDir = 1;
      puppets[0].lookDir = 1;
      puppets[0].facing = 1;
      puppets[0].defaultFacing = 1;
      puppets[0].pos.snap(view.x + view.w * 0.38, view.y + view.h * 0.6);
      puppets[0].bodyTarget = [view.x + view.w * 0.38, view.y + view.h * 0.6];
      puppets[0].flip = { from: 1, to: 1, t: 1 };
      puppets[0].flipX = puppets[0].rawFacing * 1;
      puppets[0].tilt.snap(0);
      puppets[0].depth.snap(0);
      puppets[0].dance = null;
      puppets[0].danceOffset = [0, 0];
      puppets[0].danceTilt = 0;
      puppets[0].walkPhase = 0;
      puppets[0].turnTimer = 0;
      puppets[0].surfaceTilt = [0, 0];
      puppets[0].prevVel = [0, 0];
      puppets[0].B = puppets[0].bodyMatrix(0);
      if (puppets[0].arms) {
        puppets[0].arms.L.initRestPose(puppets[0].B);
        puppets[0].arms.R.initRestPose(puppets[0].B);
      }
    }
    if (puppets[1]) {
      puppets[1].defaultLookDir = -1;
      puppets[1].lookDir = -1;
      puppets[1].facing = -1;
      puppets[1].defaultFacing = -1;
      puppets[1].pos.snap(view.x + view.w * 0.62, view.y + view.h * 0.6);
      puppets[1].bodyTarget = [view.x + view.w * 0.62, view.y + view.h * 0.6];
      puppets[1].flip = { from: -1, to: -1, t: 1 };
      puppets[1].flipX = puppets[1].rawFacing * (-1);
      puppets[1].tilt.snap(0);
      puppets[1].depth.snap(0);
      puppets[1].dance = null;
      puppets[1].danceOffset = [0, 0];
      puppets[1].danceTilt = 0;
      puppets[1].walkPhase = 0;
      puppets[1].turnTimer = 0;
      puppets[1].surfaceTilt = [0, 0];
      puppets[1].prevVel = [0, 0];
      puppets[1].B = puppets[1].bodyMatrix(0);
      if (puppets[1].arms) {
        puppets[1].arms.L.initRestPose(puppets[1].B);
        puppets[1].arms.R.initRestPose(puppets[1].B);
      }
    }
    if (controller && typeof controller.recalibrate === 'function') {
      controller.recalibrate();
    }
    const currentSelected = state.selectedCharacter === 'prabu-brajawisena' ? puppets[1] : puppets[0];
    if (els.charModal && !els.charModal.classList.contains('hidden') && typeof syncModalOrientation === 'function') {
      syncModalOrientation(currentSelected, state.selectedCharacter);
    }
    showToast('Posisi kedua wayang di panggung dikalibrasi ulang');
  }

  // ==========================================================================
  // CHARACTER REGISTRY & INDONESIAN VOICE NARRATION CONTROLLER
  // ==========================================================================
  const WAYANG_CHARACTERS = {
    'prabu-wahyana': {
      id: 'prabu-wahyana',
      name: 'Prabu Wahyana',
      title: 'Raja Luhur Penjaga Marwah Praja',
      roleBadge: 'Tokoh Utama Kelir',
      role: 'Prabu Ageng Karaton',
      puppetIndex: 0,
      image: 'assets/images/wayang-motion/wayang-wahyana.webp',
      audioUrl: 'assets/audio/narration-prabu-wahyana.mp3',
      intro: 'Prabu Wahyana adalah raja agung yang berwibawa dalam khazanah pewayangan Jawa, memimpin praja dengan ketegasan prinsip, keluhuran budi, dan keberanian membela kebenaran serta kedaulatan rakyatnya.',
      story: 'Dalam lakon wayang kulit purwa Jawa Tengah, figur Prabu Wahyana merepresentasikan kepemimpinan ksatria yang kokoh berdaulat. Ditempa dalam kearifan tradisi pedalangan, ia mengarungi berbagai pergolakan panggung kelir dengan keteguhan hati, menjunjung marwah kerajaan, dan senantiasa mendahulukan ketenteraman kawula alit.',
      personality: 'Berwibawa, bijaksana, tangguh, berani mengambil keputusan sulit, menjunjung tinggi keadilan, setia pada darma kepemimpinan, dan pantang surut dalam menghadapi mara bahaya.',
      moralLesson: 'Kepemimpinan sejati bukanlah tentang kekuasaan mutlak, melainkan pengabdian suci untuk menegakkan keadilan, menjaga martabat negeri, dan melindungi harkat sesama manusia dengan hati yang ikhlas.',
      narration: 'Namaku Prabu Wahyana, penguasa praja yang menjunjung tinggi keluhuran budi dan keadilan. Dalam panggung kelir kehidupan, kekuasaan adalah amanah luhur untuk mengayomi sesama, bukan untuk meninggikan diri. Kisahku mengajarkan bahwa keberanian berpadu keteguhan prinsip adalah perisai paling sejati dalam menjaga martabat tanah air dan menegakkan darma kebenaran.',
      sources: 'Serat Pedalangan Wayang Kulit Purwa Jawa Tengah & Tradisi Seni Tutur Nusantara'
    },
    'prabu-brajawisena': {
      id: 'prabu-brajawisena',
      name: 'Prabu Brajawisena',
      title: 'Raja Ksatria Perkasa Sabrang (Lawan Tanding Orisinal)',
      roleBadge: 'Tokoh Lawan Tanding',
      role: 'Prabu Sabrang Wirayudha (Kreasi Orisinal)',
      puppetIndex: 1,
      image: 'assets/images/wayang-motion/wayang-brajawisena.webp',
      audioUrl: 'assets/audio/narration-brajawisena.mp3',
      intro: 'Prabu Brajawisena adalah raja ksatria perkasa berwatak gagah dan bertekad baja dari seberang samudra, hadir sebagai lawan tanding tangguh bagi Prabu Wahyana dalam lakon tanding kehormatan praja.',
      story: 'Dalam lakon panggung kelir (tokoh kreasi orisinal bertradisi wayang kulit purwa sabrang), Prabu Brajawisena digambarkan memimpin bala tentara dengan disiplin perang yang tak tergoyahkan. Mahkota prada keemasan, badong sayap ksatria, dan sorot matanya yang tajam melambangkan tekad pantang menyerah sebelum ujian watak dan kebenaran terbukti di hadapan sang Dalang.',
      personality: 'Tegas, pantang gentar, menjunjung tinggi harga diri dan kejujuran laga, berjiwa ksatria sejati yang menghormati keunggulan lawan, serta pantang berkhianat.',
      moralLesson: 'Kekuatan lahiriah dan keberanian tanpa kompromi hanyalah kehampaan bila tidak dibimbing oleh kerendahan hati. Lawan tanding dalam kehidupan hadir bukan semata untuk dihancurkan, melainkan untuk menguji sejauh mana kita mampu menjaga keluhuran budi pekerti di tengah badai perselisihan.',
      narration: 'Akulah Prabu Brajawisena! Raja ksatria yang pantang surut selangkah jua dalam menuntut kebenaran. Pedang dan gada ksatria tidak pernah diayunkan demi angkara murka, melainkan demi membuktikan keteguhan janji dan kehormatan tanah pusaka. Hadapilah tantanganku dengan keluhuran budi, karena ksatria sejati diuji bukan saat ia menang, melainkan saat ia mampu menghormati lawannya di atas panggung kehidupan!',
      sources: 'Kreasi Orisinal Terinspirasi Tipologi Wayang Sabrang Purwa & Ragam Sungging Tradisi Jawa'
    }
  };
  WAYANG_CHARACTERS.wahyana = WAYANG_CHARACTERS['prabu-wahyana'];
  WAYANG_CHARACTERS.brajawisena = WAYANG_CHARACTERS['prabu-brajawisena'];

  for (const id in WAYANG_CHARACTERS) {
    if (WAYANG_CHARACTERS[id].image) WAYANG_CHARACTERS[id].image = resolveWmAsset(WAYANG_CHARACTERS[id].image);
    if (WAYANG_CHARACTERS[id].audioUrl) WAYANG_CHARACTERS[id].audioUrl = resolveWmAsset(WAYANG_CHARACTERS[id].audioUrl);
  }

  // Connect stage puppet instances with character registry & asset reference
  if (puppets[0]) {
    puppets[0].id = 'prabu-wahyana';
    puppets[0].character = WAYANG_CHARACTERS['prabu-wahyana'];
    puppets[0].image = WAYANG_CHARACTERS['prabu-wahyana'].image;
    puppets[0].defaultFacing = 1;
    puppets[0].defaultLookDir = 1;
    WAYANG_CHARACTERS['prabu-wahyana'].puppet = puppets[0];
  }
  if (puppets[1]) {
    puppets[1].id = 'prabu-brajawisena';
    puppets[1].character = WAYANG_CHARACTERS['prabu-brajawisena'];
    puppets[1].image = WAYANG_CHARACTERS['prabu-brajawisena'].image;
    puppets[1].defaultFacing = -1;
    puppets[1].defaultLookDir = -1;
    WAYANG_CHARACTERS['prabu-brajawisena'].puppet = puppets[1];
  }

  function getStageCharacter(query) {
    if (!query) return WAYANG_CHARACTERS[state.selectedCharacter] || WAYANG_CHARACTERS['prabu-wahyana'];
    if (typeof query === 'number') {
      return puppets[query]?.character || WAYANG_CHARACTERS['prabu-wahyana'];
    }
    if (typeof query === 'object' && query instanceof Puppet) {
      return query.character || WAYANG_CHARACTERS[query.id] || WAYANG_CHARACTERS['prabu-wahyana'];
    }
    const id = String(query).toLowerCase();
    return WAYANG_CHARACTERS[id] || WAYANG_CHARACTERS['prabu-wahyana'];
  }

  // Synchronize explanation panel orientation with stage character orientation
  function syncModalOrientation(puppet, charId) {
    if (!els.charModalImg) return;
    const p = puppet || (charId === 'prabu-brajawisena' ? puppets[1] : puppets[0]);
    const currentLook = p ? (p.lookDir ?? p.facing) : 1;
    const defaultLook = p ? (p.defaultLookDir ?? p.defaultFacing ?? 1) : 1;
    const isMirroredOnStage = currentLook !== defaultLook;
    els.charModalImg.style.transform = isMirroredOnStage ? 'scaleX(-1)' : 'none';
  }

  class CharacterNarrationManager {
    constructor() {
      this.currentAudio = null;
      this.currentSpeech = null;
      this.mode = 'idle'; // 'idle' | 'playing' | 'paused' | 'error'
      this.activeCharId = null;
      this.engine = 'none'; // 'audio' | 'speech'
      this.synthVoice = null;
      this.speechStartTime = 0;
      this.speechDurationEst = 28;
      this.speechTimer = null;

      // Detect Indonesian voice if SpeechSynthesis is available
      if ('speechSynthesis' in window) {
        const updateVoices = () => {
          const voices = window.speechSynthesis.getVoices();
          this.synthVoice = voices.find(v => (v.lang && (v.lang.startsWith('id') || v.lang.includes('ID'))) || (v.name && v.name.toLowerCase().includes('indonesia'))) || null;
        };
        updateVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = updateVoices;
        }
      }
    }

    formatTime(sec) {
      if (isNaN(sec) || sec < 0) sec = 0;
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    setUiState(mode, labelText) {
      this.mode = mode;
      if (els.btnAudioPrimary && els.audioPrimaryText && els.audioPrimaryIcon) {
        if (mode === 'playing') {
          els.btnAudioPrimary.classList.add('playing');
          els.audioPrimaryIcon.className = 'bi bi-pause-circle-fill';
          els.audioPrimaryText.textContent = 'Jeda Kisah';
          if (els.btnAudioStop) els.btnAudioStop.classList.remove('hidden');
          if (els.audioProgressWrap) els.audioProgressWrap.classList.remove('hidden');
        } else if (mode === 'paused') {
          els.btnAudioPrimary.classList.remove('playing');
          els.audioPrimaryIcon.className = 'bi bi-play-circle-fill';
          els.audioPrimaryText.textContent = 'Lanjutkan Kisah';
          if (els.btnAudioStop) els.btnAudioStop.classList.remove('hidden');
          if (els.audioProgressWrap) els.audioProgressWrap.classList.remove('hidden');
        } else {
          // Idle or error
          els.btnAudioPrimary.classList.remove('playing');
          els.audioPrimaryIcon.className = 'bi bi-play-circle-fill';
          els.audioPrimaryText.textContent = 'Dengarkan Kisahku';
          if (els.btnAudioStop) els.btnAudioStop.classList.add('hidden');
          if (els.audioProgressWrap) els.audioProgressWrap.classList.add('hidden');
          if (els.audioProgressFill) els.audioProgressFill.style.width = '0%';
        }
      }
      if (els.audioStatusLabel && labelText) {
        els.audioStatusLabel.textContent = labelText;
      }
    }

    play(charId) {
      const char = WAYANG_CHARACTERS[charId];
      if (!char) return;

      // If resuming paused character
      if (this.mode === 'paused' && this.activeCharId === charId) {
        this.resume();
        return;
      }

      this.stop();
      this.activeCharId = charId;
      if (els.audioErrorMsg) els.audioErrorMsg.classList.add('hidden');

      // Auto-duck background gamelan audio volume if currently playing
      if (audioEl && !audioEl.paused) {
        audioEl.volume = 0.12;
      }

      // Try HTML5 Audio file first
      try {
        const audio = new Audio(char.audioUrl);
        audio.preload = 'auto';
        this.currentAudio = audio;
        this.engine = 'audio';

        audio.addEventListener('loadedmetadata', () => {
          if (els.audioTimeTotal) els.audioTimeTotal.textContent = this.formatTime(audio.duration);
        });

        audio.addEventListener('timeupdate', () => {
          if (!audio.duration) return;
          const pct = (audio.currentTime / audio.duration) * 100;
          if (els.audioProgressFill) els.audioProgressFill.style.width = `${pct}%`;
          if (els.audioTimeCurr) els.audioTimeCurr.textContent = this.formatTime(audio.currentTime);
          if (els.audioTimeTotal) els.audioTimeTotal.textContent = this.formatTime(audio.duration);
        });

        audio.addEventListener('ended', () => {
          this.stop();
          showToast(`Kisah ${char.name} selesai`);
        });

        audio.addEventListener('error', () => {
          console.warn('Audio file playback failed, falling back to browser speech synthesis...');
          this.fallbackSpeechSynthesis(char);
        });

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.setUiState('playing', `Memutar narasi ${char.name} (Audio Asli)`);
            })
            .catch((err) => {
              console.warn('Audio play promise rejected, falling back to speech synthesis:', err);
              this.fallbackSpeechSynthesis(char);
            });
        }
      } catch (err) {
        console.warn('Audio construction error, falling back to speech synthesis:', err);
        this.fallbackSpeechSynthesis(char);
      }
    }

    fallbackSpeechSynthesis(char) {
      if (!('speechSynthesis' in window)) {
        this.setUiState('error', 'Audio narasi tidak didukung di peramban ini.');
        if (els.audioErrorMsg) {
          els.audioErrorMsg.classList.remove('hidden');
          if (els.audioErrorText) els.audioErrorText.textContent = 'Peramban tidak mendukung pemutaran suara.';
        }
        return;
      }

      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(char.narration);
        utterance.lang = 'id-ID';
        if (this.synthVoice) utterance.voice = this.synthVoice;
        utterance.rate = 0.95;
        utterance.pitch = 1.0;

        this.engine = 'speech';
        this.currentSpeech = utterance;
        this.speechStartTime = performance.now();
        this.speechDurationEst = 28;

        if (els.audioTimeTotal) els.audioTimeTotal.textContent = this.formatTime(this.speechDurationEst);
        if (els.audioTimeCurr) els.audioTimeCurr.textContent = '0:00';
        if (els.audioProgressFill) els.audioProgressFill.style.width = '0%';

        utterance.onstart = () => {
          this.setUiState('playing', `Memutar narasi ${char.name} (Suara Peramban)`);
          clearInterval(this.speechTimer);
          this.speechTimer = setInterval(() => {
            if (this.mode !== 'playing') return;
            const elapsed = (performance.now() - this.speechStartTime) / 1000;
            const pct = Math.min(100, (elapsed / this.speechDurationEst) * 100);
            if (els.audioProgressFill) els.audioProgressFill.style.width = `${pct}%`;
            if (els.audioTimeCurr) els.audioTimeCurr.textContent = this.formatTime(elapsed);
          }, 200);
        };

        utterance.onend = () => {
          clearInterval(this.speechTimer);
          this.stop();
          showToast(`Kisah ${char.name} selesai`);
        };

        utterance.onerror = (e) => {
          clearInterval(this.speechTimer);
          console.warn('SpeechSynthesis error:', e);
          this.setUiState('error', 'Gagal memutar narasi suara.');
          if (els.audioErrorMsg) {
            els.audioErrorMsg.classList.remove('hidden');
            if (els.audioErrorText) els.audioErrorText.textContent = 'Gagal memutar narasi suara.';
          }
        };

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.error('SpeechSynthesis exception:', e);
        this.setUiState('error', 'Gagal memutar narasi suara.');
        if (els.audioErrorMsg) {
          els.audioErrorMsg.classList.remove('hidden');
        }
      }
    }

    pause() {
      if (this.mode !== 'playing') return;
      if (this.engine === 'audio' && this.currentAudio) {
        this.currentAudio.pause();
      } else if (this.engine === 'speech' && 'speechSynthesis' in window) {
        window.speechSynthesis.pause();
        clearInterval(this.speechTimer);
      }
      this.setUiState('paused', 'Narasi dijeda · Tekan Lanjutkan untuk mendengar');
      // Restore gamelan volume when narration is paused
      if (audioEl) audioEl.volume = 0.6;
    }

    resume() {
      if (this.mode !== 'paused') return;
      if (audioEl && !audioEl.paused) audioEl.volume = 0.12;

      if (this.engine === 'audio' && this.currentAudio) {
        this.currentAudio.play().then(() => {
          this.setUiState('playing', 'Melanjutkan narasi suara...');
        }).catch(() => {
          this.stop();
        });
      } else if (this.engine === 'speech' && 'speechSynthesis' in window) {
        window.speechSynthesis.resume();
        this.setUiState('playing', 'Melanjutkan narasi suara...');
      }
    }

    stop() {
      if (this.currentAudio) {
        try {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
        } catch (e) {}
        this.currentAudio = null;
      }
      if ('speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch (e) {}
        this.currentSpeech = null;
      }
      clearInterval(this.speechTimer);
      this.setUiState('idle', 'Dengarkan kisah langsung dalam bahasa Indonesia');
      // Restore gamelan volume
      if (audioEl) audioEl.volume = 0.6;
    }
  }

  const narrationManager = new CharacterNarrationManager();

  // Toggle Duel / Single Mode
  function toggleDuelMode() {
    if (controller.puppetCount === 2) {
      controller.puppetCount = 1;
      state.characterMode = 'single';
      if (els.btnDuelToggle) {
        els.btnDuelToggle.classList.remove('active');
        els.btnDuelToggle.setAttribute('aria-pressed', 'false');
      }
      if (els.duelStatusLabel) {
        els.duelStatusLabel.textContent = 'Mode Tunggal';
      }
      showToast('Mode Tunggal Aktif (1 Wayang di Panggung)');
    } else {
      controller.puppetCount = 2;
      state.characterMode = 'duel';
      if (els.btnDuelToggle) {
        els.btnDuelToggle.classList.add('active');
        els.btnDuelToggle.setAttribute('aria-pressed', 'true');
      }
      if (els.duelStatusLabel) {
        els.duelStatusLabel.textContent = 'Lakon Tanding Kelir';
      }
      showToast('Lakon Tanding Aktif: Prabu Wahyana & Prabu Brajawisena');
    }
  }

  // Character Selection & Modal Logic
  function selectCharacter(charOrPuppet, openPopup = true) {
    let charId = typeof charOrPuppet === 'string' ? charOrPuppet : (charOrPuppet?.id || charOrPuppet?.charId);
    let stagePuppet = (typeof charOrPuppet === 'object' && charOrPuppet instanceof Puppet) ? charOrPuppet : null;

    if (!stagePuppet) {
      stagePuppet = (charId === 'prabu-brajawisena' || charId === 'brajawisena') ? puppets[1] : puppets[0];
    }

    const char = (stagePuppet && stagePuppet.character) || WAYANG_CHARACTERS[charId] || WAYANG_CHARACTERS['prabu-wahyana'];
    if (!char) return;
    charId = char.id;

    state.selectedCharacter = charId;
    const isWahyana = charId === 'prabu-wahyana';

    // 1. Update on-stage character selector buttons
    if (els.btnSelectWahyana && els.btnSelectBrajawisena) {
      els.btnSelectWahyana.classList.toggle('active', isWahyana);
      els.btnSelectWahyana.setAttribute('aria-checked', String(isWahyana));
      els.btnSelectBrajawisena.classList.toggle('active', !isWahyana);
      els.btnSelectBrajawisena.setAttribute('aria-checked', String(!isWahyana));
    }

    // 2. Update bottom stage badges
    if (els.puppetBadgeWahyana) {
      els.puppetBadgeWahyana.classList.toggle('selected', isWahyana);
    }
    if (els.puppetBadgeBrajawisena) {
      els.puppetBadgeBrajawisena.classList.toggle('selected', !isWahyana);
    }
    if (els.puppetBadgeCenter) els.puppetBadgeCenter.classList.add('selected');

    // 3. Update modal quick-switcher tabs
    if (els.modalTabWahyana && els.modalTabBrajawisena) {
      els.modalTabWahyana.classList.toggle('active', isWahyana);
      els.modalTabWahyana.setAttribute('aria-selected', String(isWahyana));
      els.modalTabBrajawisena.classList.toggle('active', !isWahyana);
      els.modalTabBrajawisena.setAttribute('aria-selected', String(!isWahyana));
    }

    // 4. Populate modal fields directly from the stage character data source
    if (els.charModalName) els.charModalName.textContent = char.name;
    if (els.charModalEpithet) els.charModalEpithet.textContent = char.title;
    if (els.charModalSideTag) {
      els.charModalSideTag.textContent = char.roleBadge;
      els.charModalSideTag.classList.toggle('tag-opponent', !isWahyana);
    }
    if (els.charModalRole) els.charModalRole.textContent = char.role || char.roleBadge;

    // Reuse existing character image and asset path from the stage
    const charImageSrc = char.image || stagePuppet?.image || (isWahyana ? resolveWmAsset('assets/images/wayang-motion/wayang-wahyana.webp') : resolveWmAsset('assets/images/wayang-motion/wayang-brajawisena.webp'));
    if (els.charModalImg) {
      if (els.charModalImg.getAttribute('src') !== charImageSrc) {
        els.charModalImg.src = charImageSrc;
      }
      els.charModalImg.alt = char.name;
      syncModalOrientation(stagePuppet, charId);
    }

    if (els.charModalIntro) els.charModalIntro.textContent = char.intro;
    if (els.charModalStory) els.charModalStory.textContent = char.story;
    if (els.charModalPersonality) els.charModalPersonality.textContent = char.personality;
    if (els.charModalMoral) els.charModalMoral.textContent = char.moralLesson;
    if (els.charModalSources) els.charModalSources.textContent = char.sources;

    // Reset audio status if switching to a different character
    if (narrationManager.activeCharId && narrationManager.activeCharId !== charId) {
      narrationManager.stop();
    }
    if (narrationManager.mode === 'idle') {
      narrationManager.setUiState('idle', `Dengarkan kisah ${char.name} langsung dalam bahasa Indonesia`);
    }

    // 5. If openPopup requested, show modal
    if (openPopup && els.charModal) {
      els.charModal.classList.remove('hidden');
      if (els.btnOpenCharInfo) els.btnOpenCharInfo.setAttribute('aria-expanded', 'true');
    }
  }

  function closeCharacterModal() {
    if (els.charModal) els.charModal.classList.add('hidden');
    if (els.btnOpenCharInfo) els.btnOpenCharInfo.setAttribute('aria-expanded', 'false');
    narrationManager.stop();
  }

  // Direct canvas hit test for puppet clicking / tapping
  function handleCanvasSelection(clientX, clientY) {
    if (!els.canvas) return;
    const rect = els.canvas.getBoundingClientRect();
    const cx = clientX - rect.left;
    const cy = clientY - rect.top;
    if (cx < 0 || cy < 0 || cx > rect.width || cy > rect.height) return;

    const stageX = view.x + (cx / rect.width) * view.w;
    const stageY = view.y + (cy / rect.height) * view.h;

    let clickedPuppet = null;
    let minDist = Infinity;

    puppets.forEach((p) => {
      const dx = stageX - p.pos.x;
      const dy = stageY - (p.pos.y - 120);
      const normDist = Math.hypot(dx / 240, dy / 380);
      if (normDist <= 1.35 && normDist < minDist) {
        minDist = normDist;
        clickedPuppet = p;
      }
    });

    if (clickedPuppet) {
      selectCharacter(clickedPuppet, true);
      const charName = clickedPuppet.character?.name || WAYANG_CHARACTERS[clickedPuppet.id]?.name || 'Prabu Wahyana';
      showToast(`Tokoh terpilih: ${charName}`);
    }
  }

  // HUD Update
  function updateHud() {
    const { source, status } = controller;
    let text = '', trackingText = '', cls = '';
    if (source === 'camera') {
      if (status.hands === 0) {
        text = 'Mencari Tangan di Depan Kamera...';
        trackingText = 'Mencari Tangan di Depan Kamera...';
        cls = 'warn';
      } else {
        text = controller.puppetCount === 2
          ? (status.hands === 2 ? 'Dua Wayang · Terdeteksi 2 Tangan' : 'Satu Tangan Terdeteksi')
          : 'Satu Wayang Aktif';
        if (status.calibrating) text += ' · Kalibrasi Jarak';
        trackingText = text;
        cls = 'live';
      }
      if (els.handCountBadge) {
        els.handCountBadge.textContent = `${status.hands} Tangan`;
        els.handCountBadge.style.display = 'inline-block';
      }
    } else if (source === 'mouse') {
      text = 'Mode Interaktif Mouse / Kursor (Simulasi)';
      trackingText = 'Mode Interaktif Kursor Dalang (Simulasi)';
      if (els.handCountBadge) els.handCountBadge.style.display = 'none';
    } else {
      text = 'Siap Dimainkan · Panggung Siaga';
      trackingText = 'Panggung Siaga';
      if (els.handCountBadge) els.handCountBadge.style.display = 'none';
    }

    if (els.statusText) els.statusText.textContent = text;
    if (els.trackingStatusText) els.trackingStatusText.textContent = trackingText;
    if (els.statusPill) els.statusPill.className = `pill ${cls}`;
    if (els.statusDot) {
      els.statusDot.className = cls === 'live' ? 'dot dot-active' : (cls === 'warn' ? 'dot dot-tracking' : 'dot');
    }
  }

  // Draw Camera Skeleton overlay on PiP Canvas
  function drawCameraPreview() {
    if (!pctx || !els.previewCanvas || !els.video || els.video.readyState < 2) return;
    const W = els.previewCanvas.width;
    const H = els.previewCanvas.height;

    // Clear canvas so the hardware-mirrored <video> shows through cleanly
    pctx.clearRect(0, 0, W, H);

    // Warm cinematic dalang ambient scrim
    pctx.fillStyle = 'rgba(20, 10, 4, 0.22)';
    pctx.fillRect(0, 0, W, H);

    let anyHandActive = false;

    controller.slots.forEach((slot) => {
      if (!slot.active || !slot.landmarks) return;
      anyHandActive = true;

      // Both #webcam-video and #webcam-canvas have CSS transform: scaleX(-1),
      // so drawing at l.x * W ensures pixel-perfect alignment with the mirrored webcam underneath
      const P = slot.landmarks.map((l) => [l.x * W, l.y * H]);
      pctx.strokeStyle = slot.role === 1 ? 'rgba(150, 210, 255, 0.95)' : 'rgba(242, 199, 107, 0.95)';
      pctx.lineWidth = 1.8;
      pctx.beginPath();
      for (const [a, b] of HAND_EDGES) {
        pctx.moveTo(...P[a]);
        pctx.lineTo(...P[b]);
      }
      pctx.stroke();

      const pair = { 'thumb-index': [4, 8], 'thumb-pinky': [4, 20], 'index-pinky': [8, 20] }[controller.settings.fingers] || [4, 8];
      pctx.fillStyle = '#ff6b4a';
      for (const t of pair) {
        pctx.beginPath();
        pctx.arc(...P[t], 3.5, 0, Math.PI * 2);
        pctx.fill();
      }

      if (slot.pinky) {
        pctx.strokeStyle = '#ffe28a';
        pctx.lineWidth = 2.5;
        pctx.beginPath();
        pctx.arc(...P[20], 7, 0, Math.PI * 2);
        pctx.stroke();
      }
    });

    if (els.pipGuideText) {
      els.pipGuideText.style.opacity = anyHandActive ? '0' : '1';
    }
  }

  // ==========================================================================
  // 9. ANIMATION LOOP & PHYSICS UPDATE
  // ==========================================================================
  let lastTime = performance.now() / 1000;
  const PHYS_DT = 1 / 120;
  let rafId = null;

  function tick(nowMs) {
    if (document.hidden) {
      rafId = null;
      return;
    }
    const t = nowMs / 1000;
    const dt = clamp(t - lastTime, 0, 1 / 15);
    lastTime = t;

    const inputs = controller.update(t, view);
    let active;
    if (controller.puppetCount === 1) {
      const activeIdx = state.selectedCharacter === 'prabu-brajawisena' ? 1 : 0;
      active = [puppets[activeIdx]];
    } else {
      active = puppets.slice(0, 2);
    }

    if (active.length === 2) {
      active[0].faceTargetX = active[1].pos.x;
      active[1].faceTargetX = active[0].pos.x;
    }

    const beat = beatClock.tick(dt);
    const steps = Math.max(1, Math.ceil(dt / PHYS_DT));
    const rhythm = { db: beat.db / steps, pos: beat.pos, period: beat.period };

    for (let i = 0; i < steps; i++) {
      active.forEach((p, j) => {
        p.update(
          dt / steps,
          i === 0 ? (inputs[j] ?? { active: false }) : { ...(inputs[j] ?? { active: false }), danceTrigger: false },
          view,
          rhythm
        );
      });
    }

    active.forEach((p, j) => {
      if (p.danceStarted) {
        p.danceStarted = false;
        const charName = p.id === 'prabu-brajawisena' ? 'Prabu Brajawisena' : 'Prabu Wahyana';
        showToast(active.length === 2 ? `${charName} · Tari Kiprahan Aktif (Beat Gamelan)` : 'Tari Kiprahan Aktif (Beat Gamelan)');
      }
    });

    // Dynamic Shadow Calculation: depth dictates scale, blur, and opacity
    const layers = active
      .map((p, pIdx) => {
        const depth = Math.max(0, p.depth.x);
        return {
          depth: p.depth.x,
          puppet: p,
          charId: p.id || 'prabu-wahyana',
          items: p.frame(view),
          shadow: {
            scale: 1.03 + 0.22 * depth,
            dy: 8 + 36 * depth,
            blur: 3 + 32 * clamp(p.depth.x + 0.08, 0, 1.2),
            strength: state.shadowMode ? 0.95 : (0.82 - 0.22 * clamp(depth, 0, 1)),
          },
        };
      })
      .sort((a, b) => a.depth - b.depth);

    // Blencong oil flame flicker & gentle sway
    const flicker = 1.0 + 0.03 * Math.sin(t * 7.3) + 0.02 * Math.sin(t * 13.7 + 1.1) + (noise1(t * 6.5) - 0.5) * 0.07;
    const sway = (noise1(t * 1.2 + 10) - 0.5) * 26;

    const frame = {
      view,
      layers,
      time: t,
      lamp: [STAGE_W / 2 + sway, -560, 1300],
      eye: [STAGE_W / 2, STAGE_H * 0.55, 2300],
      lampColor: [1.0, 0.8, 0.56],
      intensity: 1.08 * flicker,
      flicker,
      hot: [STAGE_W / 2 + sway * 0.7, 440],
    };

    if (renderer) {
      renderer.render(frame);
    }

    if (controller.source === 'camera' && els.pipBox && !els.pipBox.classList.contains('hidden')) {
      drawCameraPreview();
    }

    updateHud();
    rafId = requestAnimationFrame(tick);
  }

  // ==========================================================================
  // 10. MEDIAPIPE HANDS CAMERA PIPELINE
  // ==========================================================================

  // Map camera exceptions into user-friendly Indonesian messages
  function formatCameraErrorMessage(err) {
    const errorName = err?.name || '';
    const message = err?.message || '';

    if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
      return {
        title: 'Kamera belum dapat diakses.',
        desc: 'Izin akses kamera belum diberikan. Buka pengaturan izin peramban atau ketuk ikon gembok pada bilah alamat untuk mengizinkan kamera, lalu ketuk "Coba Lagi".',
      };
    }

    if (errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError') {
      return {
        title: 'Kamera belum dapat diakses.',
        desc: 'Tidak ada perangkat kamera yang terdeteksi pada perangkat Anda. Pastikan kamera terpasang dan dapat digunakan.',
      };
    }

    if (errorName === 'NotReadableError' || errorName === 'TrackStartError') {
      return {
        title: 'Kamera belum dapat diakses.',
        desc: 'Kamera Anda sedang digunakan aplikasi lain. Tutup aplikasi yang menggunakan kamera, lalu ketuk "Coba Lagi".',
      };
    }

    if (errorName === 'OverconstrainedError' || errorName === 'ConstraintNotSatisfiedError') {
      return {
        title: 'Kamera belum dapat diakses.',
        desc: 'Konfigurasi kamera perangkat Anda belum kompatibel dengan pengaturan video yang diminta.',
      };
    }

    if (errorName === 'SecurityError' || message.includes('HTTPS') || message.includes('insecure')) {
      return {
        title: 'Kamera belum dapat diakses.',
        desc: 'Akses kamera memerlukan sambungan aman (HTTPS). Pastikan situs dibuka melalui HTTPS atau jaringan lokal aman.',
      };
    }

    return {
      title: 'Kamera belum dapat diakses.',
      desc: 'Pastikan izin kamera sudah diberikan dan kamera tidak sedang digunakan aplikasi lain.',
    };
  }

  // Multi-tier camera constraint acquisition with progressive graceful fallback
  async function acquireCameraStream() {
    // 1. Verify Browser Support & Secure Context
    const isLocal = window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname.endsWith('.local') ||
                    window.location.hostname.startsWith('192.168.') ||
                    window.location.hostname.startsWith('10.') ||
                    window.location.hostname.startsWith('172.');

    if (!window.isSecureContext && !isLocal && (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)) {
      const secErr = new Error('Akses kamera memerlukan konteks aman (HTTPS). Pastikan website dibuka via HTTPS.');
      secErr.name = 'SecurityError';
      throw secErr;
    }

    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
      const unsupErr = new Error('Peramban Anda tidak mendukung akses webcam (API getUserMedia tidak tersedia).');
      unsupErr.name = 'NotSupportedError';
      throw unsupErr;
    }

    const constraintTiers = [
      // Tier 1: Ideal 720p 30fps user-facing webcam (phones, tablets, supported webcams)
      {
        video: {
          facingMode: { ideal: 'user' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30, max: 60 },
        },
        audio: false,
      },
      // Tier 2: 720p generic (for laptops & desktops where webcam driver has no facingMode)
      {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30, max: 60 },
        },
        audio: false,
      },
      // Tier 3: Standard 480p user-facing webcam
      {
        video: {
          facingMode: { ideal: 'user' },
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 },
        },
        audio: false,
      },
      // Tier 4: Standard 480p generic
      {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 },
        },
        audio: false,
      },
      // Tier 5: Most permissive fallback (any available video device)
      {
        video: true,
        audio: false,
      },
    ];

    let lastError = null;
    for (const constraints of constraintTiers) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (stream && stream.getVideoTracks().length > 0) {
          return stream;
        }
      } catch (err) {
        lastError = err;
        // If permission was explicitly denied or security blocked, do not retry lower tiers
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.name === 'SecurityError') {
          throw err;
        }
        console.warn('Wayang Motion: Constraint tier failed, stepping down...', constraints, err);
      }
    }

    throw lastError || new Error('Tidak dapat menemukan konfigurasi kamera yang kompatibel.');
  }

  // Ensure MediaPipe Hands library is ready
  async function ensureMediaPipeHandsLoaded() {
    if (window.Hands) return true;

    if (!document.querySelector('script[src*="@mediapipe/hands"]')) {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands.js';
      s.crossOrigin = 'anonymous';
      document.head.appendChild(s);
    }

    for (let i = 0; i < 50; i++) {
      if (window.Hands) return true;
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    return !!window.Hands;
  }

  let isSendingFrame = false;
  let lastProcessedVideoTime = -1;

  function startVideoFrameProcessing() {
    stopVideoFrameProcessing();

    function scheduleFrame() {
      if (!state.isActive || !state.isCameraRunning) return;

      if (els.video && 'requestVideoFrameCallback' in els.video) {
        state.cameraFrameCallbackId = els.video.requestVideoFrameCallback(async () => {
          await onVideoFrameReady();
          scheduleFrame();
        });
      } else {
        state.cameraFrameCallbackId = requestAnimationFrame(async () => {
          await onVideoFrameReady();
          scheduleFrame();
        });
      }
    }

    let lastSentTimestamp = 0;

    async function onVideoFrameReady() {
      if (!state.isActive || !state.isCameraRunning || !els.video || els.video.paused || els.video.ended) {
        return;
      }
      if (els.video.readyState < 2) return;
      if (!els.video.videoWidth || !els.video.videoHeight) return;
      if (isSendingFrame) return;

      const now = performance.now();
      // Throttle MediaPipe processing to smooth ~30fps (32ms interval) to maintain high framerate and prevent queue pileup
      if (now - lastSentTimestamp < 32) return;
      lastSentTimestamp = now;

      isSendingFrame = true;
      try {
        if (state.handsInstance) {
          await state.handsInstance.send({ image: els.video });
        }
      } catch (sendErr) {
        console.debug('MediaPipe send frame error:', sendErr);
      } finally {
        isSendingFrame = false;
      }
    }

    scheduleFrame();
  }

  function stopVideoFrameProcessing() {
    if (state.cameraFrameCallbackId) {
      if (els.video && 'cancelVideoFrameCallback' in els.video && typeof els.video.cancelVideoFrameCallback === 'function') {
        try { els.video.cancelVideoFrameCallback(state.cameraFrameCallbackId); } catch (e) {}
      } else {
        try { cancelAnimationFrame(state.cameraFrameCallbackId); } catch (e) {}
      }
      state.cameraFrameCallbackId = null;
    }
    isSendingFrame = false;
    lastProcessedVideoTime = -1;
  }

  async function startWebcam() {
    // Prevent duplicate concurrent startup
    if (state.isStartingCamera) return;
    if (state.isCameraRunning) {
      showToast('Kamera sudah aktif');
      return;
    }

    state.isStartingCamera = true;

    // Update UI overlays
    if (els.overlayIntro) els.overlayIntro.classList.add('hidden', 'gone');
    if (els.overlayError) els.overlayError.classList.add('hidden');
    if (els.overlayLoading) els.overlayLoading.classList.remove('hidden');
    if (els.loadingStepText) els.loadingStepText.textContent = 'Meminta izin & menghubungkan kamera webcam...';

    // Clean up any lingering stream before starting
    stopVideoFrameProcessing();
    if (state.mediaStream) {
      try {
        state.mediaStream.getTracks().forEach((track) => track.stop());
      } catch (e) {}
      state.mediaStream = null;
    }
    if (els.video) {
      try { els.video.pause(); } catch (e) {}
      els.video.srcObject = null;
    }

    try {
      // 1. Acquire camera stream with progressive fallbacks
      const stream = await acquireCameraStream();
      state.mediaStream = stream;

      // Handle track disconnection (e.g. unplugging external USB camera)
      stream.getVideoTracks().forEach((track) => {
        track.onended = () => {
          console.warn('Wayang Motion: Video track ended.');
          if (state.isCameraRunning) {
            stopWebcam();
            showToast('Koneksi kamera terputus');
          }
        };
      });

      // 2. Configure video element properly for inline autoplay
      if (els.video) {
        els.video.autoplay = true;
        els.video.muted = true;
        els.video.playsInline = true;
        els.video.setAttribute('playsinline', '');
        els.video.setAttribute('webkit-playsinline', '');
        els.video.setAttribute('muted', '');
        els.video.srcObject = stream;

        // Immediately invoke play() right after setting srcObject
        try {
          const playPromise = els.video.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch((playErr) => {
              console.warn('Wayang Motion: Initial video.play() caught:', playErr);
            });
          }
        } catch (playErr) {
          console.warn('Wayang Motion: video.play() sync warning:', playErr);
        }

        // 3. Wait for video metadata & first playable frame
        if (els.loadingStepText) els.loadingStepText.textContent = 'Menyiapkan aliran video dalang...';

        await new Promise((resolve, reject) => {
          let resolved = false;
          let checkInterval = null;

          const onReady = () => {
            if (resolved) return;
            resolved = true;
            cleanup();
            resolve();
          };

          const onError = (e) => {
            if (resolved) return;
            resolved = true;
            cleanup();
            reject(new Error('Gagal memuat aliran video kamera.'));
          };

          const timer = setTimeout(() => {
            if (resolved) return;
            resolved = true;
            cleanup();
            if (els.video && (els.video.readyState >= 1 || (els.video.videoWidth > 0 && els.video.videoHeight > 0))) {
              resolve();
            } else {
              reject(new Error('Batas waktu inisialisasi video terlampaui (kamera tidak merespons).'));
            }
          }, 8000);

          function cleanup() {
            clearTimeout(timer);
            if (checkInterval) clearInterval(checkInterval);
            if (els.video) {
              els.video.removeEventListener('loadedmetadata', onReady);
              els.video.removeEventListener('loadeddata', onReady);
              els.video.removeEventListener('canplay', onReady);
              els.video.removeEventListener('playing', onReady);
              els.video.removeEventListener('timeupdate', onReady);
              els.video.removeEventListener('error', onError);
            }
          }

          if (els.video.readyState >= 2 || (els.video.videoWidth > 0 && els.video.videoHeight > 0)) {
            cleanup();
            resolve();
          } else {
            els.video.addEventListener('loadedmetadata', onReady, { once: true });
            els.video.addEventListener('loadeddata', onReady, { once: true });
            els.video.addEventListener('canplay', onReady, { once: true });
            els.video.addEventListener('playing', onReady, { once: true });
            els.video.addEventListener('timeupdate', onReady, { once: true });
            els.video.addEventListener('error', onError, { once: true });

            checkInterval = setInterval(() => {
              if (els.video && (els.video.readyState >= 2 || (els.video.videoWidth > 0 && els.video.videoHeight > 0))) {
                onReady();
              }
            }, 50);
          }
        });

        // Ensure video is playing
        try {
          await els.video.play();
        } catch (playErr) {
          console.warn('Wayang Motion: video.play() final check:', playErr);
        }

        // Synchronize preview canvas resolution and aspect ratio with webcam video frame
        if (els.video && els.video.videoWidth > 0 && els.video.videoHeight > 0) {
          controller.aspect = els.video.videoWidth / els.video.videoHeight;
          if (els.previewCanvas) {
            els.previewCanvas.width = els.video.videoWidth;
            els.previewCanvas.height = els.video.videoHeight;
          }
        }
      }

      // 4. Ensure MediaPipe Hands library is ready
      if (els.loadingStepText) els.loadingStepText.textContent = 'Memuat model kecerdasan buatan MediaPipe Hands...';
      const isHandsLoaded = await ensureMediaPipeHandsLoaded();
      if (!isHandsLoaded) {
        throw new Error('Pustaka MediaPipe Hands tidak dapat dimuat. Periksa koneksi internet Anda.');
      }

      // Initialize or reuse MediaPipe Hands instance with pinned version
      if (!state.handsInstance && window.Hands) {
        const hands = new window.Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`,
        });
        hands.setOptions({
          maxNumHands: 4,
          modelComplexity: 1,
          minDetectionConfidence: 0.55,
          minTrackingConfidence: 0.5,
        });

        hands.onResults((results) => {
          if (!state.isActive || !state.isCameraRunning) return;
          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            controller.ingest(results.multiHandLandmarks, results.multiHandedness, performance.now());
          } else {
            controller.ingest([], [], performance.now());
          }
        });

        if (typeof hands.initialize === 'function') {
          if (els.loadingStepText) els.loadingStepText.textContent = 'Menyiapkan graf visi kecerdasan buatan...';
          try {
            await Promise.race([
              hands.initialize(),
              new Promise((resolve) => setTimeout(resolve, 12000)),
            ]);
          } catch (initErr) {
            console.warn('Hands initialize race note:', initErr);
          }
        }

        state.handsInstance = hands;
      }

      // 5. Activate experience state FIRST so scheduleFrame sees isActive = true and isCameraRunning = true
      state.isActive = true;
      state.isCameraRunning = true;
      controller.source = 'camera';
      controller.recalibrate();
      updateHud();

      // Dismiss loading overlay immediately and display camera controls
      if (els.overlayLoading) els.overlayLoading.classList.add('hidden');
      if (els.btnStop) els.btnStop.style.display = 'inline-flex';

      // Ensure PiP preview box is visible
      if (els.pipBox) {
        els.pipBox.classList.remove('hidden');
      }

      // 6. Start dedicated video frame processing loop now that state is active
      startVideoFrameProcessing();

      showToast('Kamera dalang terhubung! Gerakkan tangan Anda di depan webcam');
    } catch (err) {
      console.error('Wayang Motion: Camera access error:', err);
      // Clean up failed stream if any
      if (state.mediaStream) {
        try {
          state.mediaStream.getTracks().forEach((track) => track.stop());
        } catch (e) {}
        state.mediaStream = null;
      }
      if (els.video) {
        try { els.video.pause(); } catch (e) {}
        els.video.srcObject = null;
      }

      if (els.overlayLoading) els.overlayLoading.classList.add('hidden');
      if (els.overlayError) {
        const info = formatCameraErrorMessage(err);
        if (els.errorTitle) els.errorTitle.textContent = info.title;
        if (els.errorMessageText) els.errorMessageText.textContent = info.desc;
        els.overlayError.classList.remove('hidden');
      }
    } finally {
      state.isStartingCamera = false;
    }
  }

  function stopWebcam() {
    state.isActive = false;
    state.isCameraRunning = false;
    state.isStartingCamera = false;
    controller.source = 'ready';
    controller.slots.forEach((s) => resetSlot(s));
    updateHud();

    // 1. Stop frame processing
    stopVideoFrameProcessing();

    // 2. Stop camera stream tracks cleanly
    if (state.mediaStream) {
      state.mediaStream.getTracks().forEach((track) => {
        try {
          track.enabled = false;
          track.stop();
        } catch (e) {}
      });
      state.mediaStream = null;
    }

    // 3. Detach video srcObject
    if (els.video) {
      try { els.video.pause(); } catch (e) {}
      els.video.srcObject = null;
    }

    // 4. Clear landmark canvas & reset guides
    if (pctx && els.previewCanvas) {
      pctx.clearRect(0, 0, els.previewCanvas.width, els.previewCanvas.height);
    }
    if (els.pipGuideText) {
      els.pipGuideText.style.opacity = '1';
    }

    // 5. Reset puppets to stationary resting pose
    resetPuppetsPosition();

    // 6. Update UI
    if (els.btnStop) els.btnStop.style.display = 'none';
    if (els.pipBox) els.pipBox.classList.add('hidden');
    if (els.overlayIntro) els.overlayIntro.classList.remove('hidden', 'gone');
    if (els.overlayError) els.overlayError.classList.add('hidden');
    if (els.overlayLoading) els.overlayLoading.classList.add('hidden');
    updateMobileOrientationFlow();

    showToast('Sesi kamera selesai · Panggung siaga');
  }

  function startInteractiveMode() {
    // If camera was running, stop it first
    if (state.isCameraRunning) {
      stopVideoFrameProcessing();
      if (state.mediaStream) {
        state.mediaStream.getTracks().forEach((track) => {
          try { track.stop(); } catch (e) {}
        });
        state.mediaStream = null;
      }
      if (els.video) {
        try { els.video.pause(); } catch (e) {}
        els.video.srcObject = null;
      }
      state.isCameraRunning = false;
    }

    state.isActive = true;
    controller.source = 'mouse';
    controller.mouse.seen = true;
    updateHud();
    if (els.pipBox) els.pipBox.classList.add('hidden');
    if (els.overlayIntro) els.overlayIntro.classList.add('hidden', 'gone');
    if (els.mobileOrientationModal) els.mobileOrientationModal.classList.add('hidden');
    if (els.overlayError) els.overlayError.classList.add('hidden');
    if (els.overlayLoading) els.overlayLoading.classList.add('hidden');
    if (els.btnStop) els.btnStop.style.display = 'inline-flex';
    showToast('Mode Mouse Aktif · Geser kursor untuk memainkan wayang');
  }

  // ==========================================================================
  // 11. EVENT LISTENERS & HOTKEYS
  // ==========================================================================
  // Mouse & Pointer interaction on canvas
  els.canvas.addEventListener('pointermove', (e) => {
    const rect = els.canvas.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / (rect.width || 1);
    const ny = (e.clientY - rect.top) / (rect.height || 1);
    controller.mouse.x = view.x + nx * view.w;
    controller.mouse.y = view.y + ny * view.h;
    controller.mouse.seen = true;
  });

  els.canvas.addEventListener('pointerdown', (e) => {
    controller.mouse.dragging = true;
    const rect = els.canvas.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / (rect.width || 1);
    const ny = (e.clientY - rect.top) / (rect.height || 1);
    controller.mouse.x = view.x + nx * view.w;
    controller.mouse.y = view.y + ny * view.h;
    controller.mouse.seen = true;
  });

  window.addEventListener('pointerup', () => {
    controller.mouse.dragging = false;
  });

  els.canvas.addEventListener('wheel', (e) => {
    controller.mouse.depth = clamp(controller.mouse.depth - e.deltaY * 0.0015, -0.3, 1.0);
    e.preventDefault();
  }, { passive: false });

  // Buttons & Floating Controls
  els.btnStart?.addEventListener('click', startWebcam);
  els.btnStop?.addEventListener('click', stopWebcam);
  els.btnRetry?.addEventListener('click', startWebcam);
  els.btnStartInteractive?.addEventListener('click', startInteractiveMode);
  els.btnStartInteractiveIntro?.addEventListener('click', startInteractiveMode);
  els.btnReset?.addEventListener('click', resetPuppetsPosition);

  // Mobile Orientation Flow Handlers
  els.btnOrientationContinue?.addEventListener('click', handleOrientationContinue);

  // Listen to mobile orientation changes
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      updateMobileOrientationFlow();
      resizeStage();
    }, 150);
  });
  if (screen.orientation && typeof screen.orientation.addEventListener === 'function') {
    screen.orientation.addEventListener('change', () => {
      setTimeout(() => {
        updateMobileOrientationFlow();
        resizeStage();
      }, 150);
    });
  }

  els.btnFullscreen?.addEventListener('click', toggleFullscreen);

  els.soundToggle?.addEventListener('click', toggleMusic);

  els.btnTogglePip?.addEventListener('click', () => {
    if (!els.pipBox) return;
    const isHidden = els.pipBox.classList.contains('hidden');
    els.pipBox.classList.toggle('hidden', !isHidden);
    showToast(isHidden ? 'Kamera dalang ditampilkan' : 'Kamera dalang disembunyikan');
  });
  els.btnMinimizePip?.addEventListener('click', () => {
    els.pipBox?.classList.toggle('minimized');
  });
  els.btnClosePip?.addEventListener('click', () => {
    els.pipBox?.classList.add('hidden');
  });

  async function toggleVideoPip() {
    if (!els.video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        showToast('Jendela pop-out kamera ditutup');
      } else if (document.pictureInPictureEnabled && els.video.readyState >= 2) {
        await els.video.requestPictureInPicture();
        showToast('Jendela pop-out kamera aktif');
      } else if (els.pipBox) {
        els.pipBox.classList.toggle('minimized');
      }
    } catch (e) {
      console.debug('Picture-in-picture fallback:', e);
      if (els.pipBox) {
        els.pipBox.classList.toggle('minimized');
      }
    }
  }

  els.previewPopout?.addEventListener('click', toggleVideoPip);

  // Direct Canvas Selection & Click/Touch Hit-Testing
  let touchStartData = null;
  els.canvas.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      touchStartData = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: performance.now() };
    }
  }, { passive: true });

  els.canvas.addEventListener('touchend', (e) => {
    if (!touchStartData) return;
    const dt = performance.now() - touchStartData.t;
    if (dt < 350 && e.changedTouches && e.changedTouches[0]) {
      const dx = Math.abs(e.changedTouches[0].clientX - touchStartData.x);
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartData.y);
      if (dx < 16 && dy < 16) {
        handleCanvasSelection(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      }
    }
    touchStartData = null;
  });

  els.canvas.addEventListener('click', (e) => {
    handleCanvasSelection(e.clientX, e.clientY);
  });

  // Stage Badges & Actions
  els.puppetBadgeWahyana?.addEventListener('click', () => selectCharacter('prabu-wahyana', true));
  els.puppetBadgeBrajawisena?.addEventListener('click', () => selectCharacter('prabu-brajawisena', true));
  els.btnSelectWahyana?.addEventListener('click', () => selectCharacter('prabu-wahyana', false));
  els.btnSelectBrajawisena?.addEventListener('click', () => selectCharacter('prabu-brajawisena', false));
  els.btnDuelToggle?.addEventListener('click', toggleDuelMode);
  els.modalTabWahyana?.addEventListener('click', () => selectCharacter('prabu-wahyana', false));
  els.modalTabBrajawisena?.addEventListener('click', () => selectCharacter('prabu-brajawisena', false));

  els.puppetBadgeLeft?.addEventListener('click', () => selectCharacter('prabu-wahyana', true));
  els.puppetBadgeRight?.addEventListener('click', () => selectCharacter('prabu-brajawisena', true));
  els.btnReelInfo?.addEventListener('click', () => {
    selectCharacter(state.selectedCharacter || 'prabu-wahyana', true);
  });
  els.btnOpenCharInfo?.addEventListener('click', () => {
    if (els.charModal && !els.charModal.classList.contains('hidden')) {
      closeCharacterModal();
    } else {
      selectCharacter(state.selectedCharacter || 'prabu-wahyana', true);
    }
  });

  // Character Modal Close
  els.btnCloseCharModal?.addEventListener('click', closeCharacterModal);
  els.charModal?.addEventListener('click', (e) => {
    if (e.target === els.charModal) closeCharacterModal();
  });

  // Audio Narration Player Controls
  els.btnAudioPrimary?.addEventListener('click', () => {
    if (narrationManager.mode === 'playing') {
      narrationManager.pause();
    } else if (narrationManager.mode === 'paused') {
      narrationManager.resume();
    } else {
      narrationManager.play(state.selectedCharacter || 'prabu-wahyana');
    }
  });

  els.btnAudioStop?.addEventListener('click', () => {
    narrationManager.stop();
  });

  els.btnRetryNarration?.addEventListener('click', () => {
    narrationManager.play(state.selectedCharacter || 'prabu-wahyana');
  });

  // Hotkeys
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (els.charModal && !els.charModal.classList.contains('hidden')) {
        closeCharacterModal();
        return;
      }
      if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
      }
      if (state.isFullscreen || state.isFullscreenFallback || document.fullscreenElement || document.webkitFullscreenElement) {
        exitFullscreen();
        return;
      }
      return;
    }

    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

    const key = e.key.toUpperCase();
    if (key === 'I') {
      if (els.charModal && !els.charModal.classList.contains('hidden')) {
        closeCharacterModal();
      } else {
        selectCharacter(state.selectedCharacter || 'prabu-wahyana', true);
      }
    } else if (key === 'D') {
      controller.requestDance();
      showToast('Tari Kiprahan Aktif (Beat Gamelan)');
    } else if (key === 'F' || key === 'G') {
      turnPuppet();
      showToast('Arah hadap wayang dibalik');
    } else if (key === 'H') {
      document.body.classList.toggle('ui-hidden');
      const isHidden = document.body.classList.contains('ui-hidden');
      showToast(isHidden ? 'Antarmuka disembunyikan' : 'Antarmuka ditampilkan');
    } else if (key === 'C') {
      resetPuppetsPosition();
      controller.recalibrate();
      showToast('Posisi wayang & kalibrasi kedalaman diatur ulang');
    } else if (key === 'M') {
      toggleMusic();
    } else if (key === 'V') {
      if (els.pipBox) {
        els.pipBox.classList.toggle('hidden');
      }
    } else if (key === 'P') {
      toggleVideoPip();
    }
  });

  // Autoplay music gesture listener (respects user explicit mute)
  const startMusicOnInteraction = (e) => {
    if (userExplicitlyMuted) return;
    if (e.target?.closest?.('#sound-toggle') || e.key?.toLowerCase() === 'm') return;
    audioEl.play().then(() => {
      syncSoundUi();
      window.removeEventListener('pointerdown', startMusicOnInteraction, true);
      window.removeEventListener('keydown', startMusicOnInteraction, true);
    }).catch(() => {});
  };
  window.addEventListener('pointerdown', startMusicOnInteraction, true);
  window.addEventListener('keydown', startMusicOnInteraction, true);

  // Safe camera stream cleanup on page navigation / exit
  window.addEventListener('beforeunload', stopWebcam);
  window.addEventListener('pagehide', stopWebcam);

  // Background tab optimization: pause RAF & camera inference when hidden to save CPU/battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      stopVideoFrameProcessing();
    } else {
      lastTime = performance.now() / 1000;
      if (!rafId) {
        rafId = requestAnimationFrame(tick);
      }
      if (state.isActive && state.isCameraRunning) {
        startVideoFrameProcessing();
      }
    }
  });

  // Initialize and Launch
  if (els.pipBox) {
    els.pipBox.classList.add('hidden');
  }
  initRenderer().then(() => {
    resizeStage();
    updateMobileOrientationFlow();
    resetPuppetsPosition();
    const shouldKeepModalOpen = els.charModal && !els.charModal.classList.contains('hidden');
    selectCharacter(puppets[0] || 'prabu-wahyana', shouldKeepModalOpen);
    state.isReady = true;
    rafId = requestAnimationFrame(tick);
  });

  window.wayang = {
    state,
    puppets,
    controller,
    beatClock,
    renderer,
    audio: audioEl,
    selectCharacter,
    narrationManager,
    characters: WAYANG_CHARACTERS,
    getStageCharacter,
  };
})();

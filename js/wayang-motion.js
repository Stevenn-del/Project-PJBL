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
  const rot180 = (p, size) => [size[0] - p[0], size[1] - p[1]];

  const LEFT = {
    upper: { src: 'assets/images/reference-rig/upper-arm-l.webp', size: [231, 89], prox: [211, 44], dist: [22, 28] },
    fore:  { src: 'assets/images/reference-rig/forearm-l.webp',   size: [195, 109], prox: [172, 58], dist: [13, 53] },
    hand:  { src: 'assets/images/reference-rig/hand-l.webp',      size: [108, 124], prox: [91.7, 67.5], grip: [52, 76] },
  };

  const mirrorPiece = (p, src) => {
    const out = { src, size: p.size };
    for (const k of ['prox', 'dist', 'grip']) if (p[k]) out[k] = rot180(p[k], p.size);
    return out;
  };

  const PARTS = {
    body:   { src: 'assets/images/reference-rig/body.webp', size: [706, 1377] },
    upperL: LEFT.upper,
    foreL:  LEFT.fore,
    handL:  LEFT.hand,
    upperR: mirrorPiece(LEFT.upper, 'assets/images/reference-rig/upper-arm-r.webp'),
    foreR:  mirrorPiece(LEFT.fore,  'assets/images/reference-rig/forearm-r.webp'),
    handR:  mirrorPiece(LEFT.hand,  'assets/images/reference-rig/hand-r.webp'),
  };

  const BODY_RIG = {
    anchor: [345, 760],
    shoulder: { L: [247.5, 432.5], R: [442.5, 432.5] },
    stickTop: [346, 318],
    stickFoot: [346, 1334],
    ties: [470, 1010, 1262],
  };

  const REST_POSE = { L: [-150, 250], R: [70, 330] };

  class Arm {
    constructor(side) {
      this.side = side;
      this.upper = PARTS['upper' + side];
      this.fore = PARTS['fore' + side];
      this.hand = PARTS['hand' + side];
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
    constructor({ x = 960, y = 650, facing = 1 } = {}) {
      this.baseScale = 0.53;
      this.scale = this.baseScale;
      this.home = [x, y];
      this.pos = new Spring2(x, y, 240, 0.62);
      this.bodyTarget = [x, y];
      this.tilt = new Spring(0, 60, 0.45);
      this.depth = new Spring(0, 28, 1.0);
      this.facing = facing; // 1 = looks left, -1 = mirrored (looks right)
      this.flip = { from: facing, to: facing, t: 1 };
      this.flipX = facing;
      this.facingMode = 'target';
      this.faceTargetX = null;
      this.turnTimer = 0;
      this.walkPhase = 0;
      this.arms = { L: new Arm('L'), R: new Arm('R') };
      this.B = Affine.identity();
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
      this.flip = { from: this.facing, to: -this.facing, t: 0 };
      this.facing = -this.facing;
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

      const fwd = -this.facing;
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
          wantTurn = speed > 240 && Math.sign(vx) === this.facing;
        } else if (this.facingMode === 'target' && this.faceTargetX !== null) {
          const dx = this.faceTargetX - this.pos.x;
          wantTurn = Math.abs(dx) > 60 && Math.sign(dx) === this.facing;
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
        this.flipX = this.flip.from * Math.cos(Math.PI * easeInOut(this.flip.t));
      } else {
        this.flipX = this.facing;
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

      const armItems = (side) => [
        { kind: 'part', id: 'upper' + side, key: 'upper' + side, m: poses[side].upperM, tilt },
        { kind: 'part', id: 'fore' + side,  key: 'fore' + side,  m: poses[side].foreM,  tilt },
        { kind: 'part', id: 'hand' + side,  key: 'hand' + side,  m: poses[side].handM,  tilt },
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

      const back = this.flipX >= 0 ? 'R' : 'L';
      const front = back === 'R' ? 'L' : 'R';
      const items = [
        ...armItems(back),
        { kind: 'part', id: 'body', key: 'body', m: B, tilt },
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
  vec2 stage = vec2(uView.x + vUv.x * uView.z, uView.y + (1.0 - vUv.y) * uView.w);
  vec2 buv = stage / vec2(${STAGE_W.toFixed(1)}, ${STAGE_H.toFixed(1)});
  vec3 bg = texture(uBg, clamp(buv, vec2(0.0), vec2(1.0))).rgb;

  vec2 d = (stage - uHot) / vec2(1250.0, 820.0);
  float glow = exp(-dot(d, d) * 1.7);
  vec3 lit = bg * (0.64 + 0.36 * glow) * uFlicker;
  lit += vec3(1.0, 0.62, 0.28) * glow * 0.05 * uFlicker;

  float smoke = vnoise(stage * 0.004 + vec2(uTime * 0.05, -uTime * 0.03)) * vnoise(stage * 0.009 - vec2(uTime * 0.04, 0.0));
  lit += vec3(1.0, 0.8, 0.55) * smoke * glow * 0.035;

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
  vec2 q = vUv - 0.5;
  q.x *= uRes.x / uRes.y;
  float vig = smoothstep(1.15, 0.28, length(q * vec2(0.85, 1.05)));
  c *= mix(0.38, 1.0, vig);
  c = c / (1.0 + 0.16 * c) * 1.12;
  c = pow(max(c, 0.0), vec3(1.0, 1.02, 1.08));
  float g = fract(sin(dot(floor(vUv * uRes) + fract(uTime * 7.13) * 91.7, vec2(12.9898, 78.233))) * 43758.5453);
  c += (g - 0.5) * 0.02;
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

  const LOST_MS = 320;
  const PINKY_HOLD_MS = 280;
  const PINKY_REARM_MS = 350;

  function makeSlot() {
    const pos = () => new OneEuro(1.6, 9, 1.0);
    return {
      active: false,
      lastSeen: 0,
      lastTs: 0,
      rawPalm: null,
      f: { px: pos(), py: pos(), ax: pos(), ay: pos(), bx: pos(), by: pos(), size: new OneEuro(0.7, 1.5), roll: new OneEuro(1.2, 2.5) },
      leftIsA: true,
      role: null,
      data: null,
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
    s.data = null;
    s.rawPalm = null;
    s.role = null;
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
      this.source = 'demo';
      this.settings = { fingers: 'thumb-index', bodyHand: 'right', characters: 'two' };
      this.slots = [makeSlot(), makeSlot()];
      this.bodySlot = -1;
      this.calibs = {};
      this.mouse = { x: 960, y: 640, depth: 0, seen: false, dragging: false };
      this.status = { hands: 0, mode: 'demo', calibrating: false };
      this.prevCount = 0;
      this.home = [[640, 650], [1280, 650]];
      this.pendingDance = [false, false];
      this.demoDance = -1;
      this.aspect = 16 / 9;
    }

    requestDance(i = null) {
      for (let j = 0; j < this.puppetCount; j++) if (i === null || i === j) this.pendingDance[j] = true;
    }

    get puppetCount() {
      return this.settings.characters === 'two' ? 2 : 1;
    }

    recalibrate() {
      this.calibs = {};
    }

    toStage(nx, ny, view) {
      const u = (nx - 0.12) / 0.76;
      const v = (ny - 0.1) / 0.8;
      return [view.x + view.w * (0.06 + 0.88 * u), view.y + view.h * (0.26 + 0.62 * v)];
    }

    ingest(landmarksList, ts) {
      const pair = FINGER_PAIRS[this.settings.fingers] || FINGER_PAIRS['thumb-index'];
      const hands = landmarksList.map((lm) => ({ lm, h: analyzeHand(lm, this.aspect, pair) }));

      const used = new Set();
      const assign = new Map();
      const dist = (s, h) => (s.rawPalm ? Math.hypot(s.rawPalm[0] - h.palm[0], s.rawPalm[1] - h.palm[1]) : 1e9);
      const pairs = [];
      hands.forEach((hd, hi) => this.slots.forEach((s, si) => pairs.push({ hi, si, d: s.active ? dist(s, hd.h) : 1e6 + si })));
      pairs.sort((p, q) => p.d - q.d);
      for (const p of pairs) {
        if (assign.has(p.hi) || used.has(p.si)) continue;
        assign.set(p.hi, p.si);
        used.add(p.si);
      }

      for (const [hi, si] of assign) {
        const s = this.slots[si];
        const { h, lm } = hands[hi];
        const dt = s.active ? clamp((ts - s.lastTs) / 1000, 1 / 240, 0.2) : 1 / 30;

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
        s.active = true;
        s.lastSeen = ts;
        s.lastTs = ts;
        s.rawPalm = h.palm;
        s.landmarks = lm;

        const f = s.f;
        const side = (h.bBase[0] - h.aBase[0]) / (h.size || 1e-4);
        if (side > 0.12) s.leftIsA = true;
        else if (side < -0.12) s.leftIsA = false;

        s.data = {
          palm: [f.px.filter(h.palm[0], dt), f.py.filter(h.palm[1], dt)],
          a: [f.ax.filter(h.a[0], dt), f.ay.filter(h.a[1], dt)],
          b: [f.bx.filter(h.b[0], dt), f.by.filter(h.b[1], dt)],
          size: f.size.filter(h.size, dt),
          roll: f.roll.filter(h.roll, dt),
        };
      }
      for (const s of this.slots) {
        if (s.active && ts - s.lastSeen > LOST_MS) resetSlot(s);
      }
    }

    activeSlots(now) {
      return this.slots.map((s, i) => ({ s, i })).filter(({ s }) => s.active && s.data && now - s.lastSeen <= LOST_MS);
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
      const fresh = active.length === 2 && (this.prevCount < 2 || active[0].s.role === active[1].s.role || active.some((a) => a.s.role === null));
      if (fresh) {
        const [p, q] = active;
        const pLeft = p.s.data.palm[0] < q.s.data.palm[0];
        p.s.role = pLeft ? 0 : 1;
        q.s.role = pLeft ? 1 : 0;
      } else if (active.length === 1 && active[0].s.role === null) {
        const s = active[0].s;
        s.role = s.data.palm[0] / this.aspect < 0.5 ? 0 : 1;
      }
      this.status.mode = active.length ? 'two puppets' : 'no hands';
      const out = [{ active: false }, { active: false }];
      for (const { s } of active) out[s.role] = this.handInput(s, view, `p${s.role}`);
      return out;
    }

    onePuppetInput(active, view) {
      if (!active.length) {
        this.bodySlot = -1;
        this.status.mode = 'no hands';
        return [{ active: false }];
      }
      if (active.length === 1) {
        this.bodySlot = active[0].i;
      } else if (!active.some((a) => a.i === this.bodySlot) || this.prevCount < 2) {
        const [p, q] = active;
        const pRight = p.s.data.palm[0] > q.s.data.palm[0];
        const wantRight = this.settings.bodyHand === 'right';
        this.bodySlot = pRight === wantRight ? p.i : q.i;
      }
      const input = this.handInput(this.slots[this.bodySlot], view, 'one');
      if (active.length === 1) {
        this.status.mode = 'one hand';
      } else {
        const aspect = this.aspect;
        const rod = active.find((a) => a.i !== this.bodySlot).s;
        const abs = (tip) => {
          const [x, y] = this.toStage(tip[0] / aspect, tip[1], view);
          return { type: 'abs', x, y, rodX: x };
        };
        const A = abs(rod.data.a), B = abs(rod.data.b);
        input.arms = { left: rod.leftIsA ? A : B, right: rod.leftIsA ? B : A };
        input.danceTrigger = input.danceTrigger || rod.danceTrigger;
        rod.danceTrigger = false;
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

    demoInput(t, view) {
      const cx = view.x + view.w / 2;
      const drift = Math.sin(t * 0.13) * view.w * 0.08;
      const gap = view.w * (0.36 + 0.14 * Math.sin(t * 0.42));
      const floor = view.y + view.h * 0.6;
      const talk = (phase, amp) => ({
        left: { type: 'rel', dx: -0.95 + Math.sin(t * 1.7 + phase) * 0.35 * amp, dy: -0.25 + Math.sin(t * 1.1 + phase) * 0.8 * amp },
        right: { type: 'rel', dx: 0.55 + Math.sin(t * 1.3 + phase) * 0.3, dy: 0.45 + Math.sin(t * 0.9 + phase) * 0.55 },
      });
      const turn = Math.sin(t * 0.5);
      const m = (s) => ({ ...s, dx: -s.dx });
      const mirrorArms = (arms) => ({ left: m(arms.right), right: m(arms.left) });

      const inputs = [
        {
          active: true,
          body: { x: cx + drift - gap / 2, y: floor + Math.sin(t * 0.9) * 18 },
          tilt: Math.sin(t * 0.55) * 0.06,
          depth: Math.max(0, Math.sin(t * 0.21 - 1.2)) * 0.6,
          arms: mirrorArms(talk(0, turn > 0 ? 1 : 0.35)),
        },
        {
          active: true,
          body: { x: cx + drift + gap / 2, y: floor + Math.sin(t * 0.8 + 2) * 18 },
          tilt: Math.sin(t * 0.47 + 1) * 0.06,
          depth: Math.max(0, Math.sin(t * 0.19 + 1.5)) * 0.6,
          arms: talk(2, turn < 0 ? 1 : 0.35),
        },
      ];

      const n = Math.floor((t - 6) / 24);
      if (n >= 0 && n !== this.demoDance) {
        this.demoDance = n;
        inputs[n % this.puppetCount].danceTrigger = true;
      }
      return inputs.slice(0, this.puppetCount);
    }

    idleInput(t, i) {
      return {
        active: true,
        body: { x: this.home[i][0], y: this.home[i][1] + Math.sin(t * 0.8 + i) * 6 },
        tilt: 0,
        depth: 0,
        arms: {
          left: { type: 'rel', dx: -0.7 + Math.sin(t * 0.9 + i) * 0.15, dy: 0.55 + Math.sin(t * 0.6) * 0.2 },
          right: { type: 'rel', dx: 0.35 + Math.sin(t * 0.8 + 1 + i) * 0.12, dy: 0.85 + Math.sin(t * 0.5) * 0.1 },
        },
      };
    }

    mouseInput(t) {
      const idle0 = this.idleInput(t, 0);
      const first = this.mouse.seen
        ? { ...idle0, body: { x: this.mouse.x, y: this.mouse.y }, depth: this.mouse.depth }
        : { active: false };
      return this.puppetCount === 2 ? [first, this.idleInput(t, 1)] : [first];
    }

    update(t, view) {
      this.home = [
        [view.x + view.w * 0.3, view.y + view.h * 0.6],
        [view.x + view.w * 0.7, view.y + view.h * 0.6],
      ];
      let inputs;
      if (this.source === 'camera') {
        inputs = this.cameraInput(performance.now(), view);
      } else if (this.source === 'mouse') {
        this.status.mode = 'mouse';
        inputs = this.mouseInput(t);
      } else {
        this.status.mode = 'demo';
        inputs = this.demoInput(t, view);
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

      // 1. Background
      if (this.images.background) {
        ctx.drawImage(this.images.background, 0, 0, w, h);
      } else {
        ctx.fillStyle = '#F5EADB';
        ctx.fillRect(0, 0, w, h);
      }

      // Blencong Hotspot Glow
      const lampX = w * 0.5;
      const lampY = h * 0.20;
      const lampRadius = Math.max(w, h) * 0.62 * f.flicker;
      const lampGrad = ctx.createRadialGradient(lampX, lampY, 30, lampX, lampY, lampRadius);
      lampGrad.addColorStop(0, 'rgba(255, 248, 225, 0.5)');
      lampGrad.addColorStop(0.4, 'rgba(240, 195, 110, 0.2)');
      lampGrad.addColorStop(1, 'rgba(65, 24, 7, 0.0)');
      ctx.fillStyle = lampGrad;
      ctx.fillRect(0, 0, w, h);

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
        ctx.restore();

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
    btnShadow: $('btn-toggle-shadow'),
    btnFullscreen: $('btn-toggle-fullscreen'),
    btnGuide: $('btn-open-guide'),
    btnCloseGuide: $('btn-close-guide'),
    btnUnderstoodGuide: $('btn-understood-guide'),
    guideModal: $('guide-modal'),
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
    puppetBadgeLeft: $('puppet-badge-left'),
    puppetBadgeRight: $('puppet-badge-right'),
    puppetBadgeCenter: $('puppet-badge-center'),
    badgeLeftRole: $('badge-left-role'),
    badgeLeftName: $('badge-left-name'),
    badgeRightRole: $('badge-right-role'),
    badgeRightName: $('badge-right-name'),
    debogLabelLeft: $('debog-label-left'),
    debogLabelRight: $('debog-label-right'),
    landscapeSuggestion: $('landscape-suggestion'),
    btnDismissLandscape: $('btn-dismiss-landscape'),
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

  // Initialize Dual Puppets Facing Center
  const puppets = [new Puppet({ x: 640, facing: -1 }), new Puppet({ x: 1280, facing: 1 })];
  const controller = new HandController();
  const audioEl = new Audio('assets/audio/backsound.mp3');
  audioEl.loop = true;
  audioEl.preload = 'none';
  audioEl.volume = 0.6;
  const beatClock = new BeatClock(audioEl);
  beatClock.load('assets/audio/backsound-beats.json');

  let renderer = null;
  let isWebglActive = false;

  async function initRenderer() {
    try {
      renderer = new WebGL2Renderer(els.canvas);
      isWebglActive = true;
      await Promise.all([
        renderer.loadTexture('background', 'assets/images/reference-rig/background.webp'),
        ...Object.entries(PARTS).map(([key, part]) => renderer.loadTexture(key, part.src)),
      ]);
    } catch (err) {
      console.warn('WebGL2 hardware pipeline unavailable, falling back to Canvas 2D engine:', err);
      renderer = new Canvas2DFallbackRenderer(els.canvas);
      isWebglActive = false;
      await Promise.all([
        renderer.loadTexture('background', 'assets/images/reference-rig/background.webp'),
        ...Object.entries(PARTS).map(([key, part]) => renderer.loadTexture(key, part.src)),
      ]);
    }
  }

  // View state calculation
  let view = { x: 0, y: 0, w: STAGE_W, h: STAGE_H };
  function resizeStage() {
    const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || state.isFullscreen || state.isFullscreenFallback);
    let w, h;
    if (isFs) {
      w = window.innerWidth;
      h = window.innerHeight;
    } else {
      const rect = els.stageViewport ? els.stageViewport.getBoundingClientRect() : { width: 1440, height: 640 };
      w = Math.max(640, Math.round(rect.width || 1440));
      h = Math.max(480, Math.round(rect.height || 640));
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
  }
  window.addEventListener('resize', resizeStage);

  // Runtime State
  const state = {
    isActive: false,
    isCameraRunning: false,
    isStartingCamera: false,
    cameraFrameCallbackId: null,
    isFullscreen: false,
    isFullscreenFallback: false,
    shadowMode: false,
    characterMode: 'reference',
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
      } else {
        if (icon) icon.className = 'bi bi-arrows-fullscreen';
        if (text) text.textContent = 'Layar Penuh';
        els.btnFullscreen.setAttribute('aria-pressed', 'false');
        els.btnFullscreen.setAttribute('aria-label', 'Layar Penuh');
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

    resizeStage();
  }

  function enterFullscreen() {
    const container = els.stageContainer || document.documentElement;
    updateFullscreenLayout(true);
    if (container.requestFullscreen) {
      container.requestFullscreen().catch(() => {
        state.isFullscreenFallback = true;
        updateFullscreenLayout(true);
      });
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
    } else {
      state.isFullscreenFallback = true;
      updateFullscreenLayout(true);
    }
  }

  function exitFullscreen() {
    state.isFullscreenFallback = false;
    updateFullscreenLayout(false);
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      }
    } catch (e) {}
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

  document.addEventListener('fullscreenchange', () => {
    const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || state.isFullscreenFallback);
    updateFullscreenLayout(isFs);
  });
  document.addEventListener('webkitfullscreenchange', () => {
    const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || state.isFullscreenFallback);
    updateFullscreenLayout(isFs);
  });

  // Facing Mode
  function applyFacing() {
    const two = controller.puppetCount === 2;
    const mode = els.optFacing ? els.optFacing.value : 'target';
    for (const p of puppets) p.facingMode = mode === 'target' && !two ? 'manual' : mode;
  }

  function turnPuppet(i) {
    if (i >= controller.puppetCount) return;
    if (els.optFacing && els.optFacing.value !== 'manual') {
      els.optFacing.value = 'manual';
      applyFacing();
    }
    puppets[i].turn();
  }

  // Audio Playback
  function syncSoundUi() {
    if (!els.soundToggle) return;
    const isMuted = audioEl.muted || audioEl.paused;
    els.soundToggle.setAttribute('aria-pressed', String(!isMuted));
    els.soundToggle.classList.toggle('playing', !isMuted);
    const onIcon = els.soundToggle.querySelector('.icon-sound-on');
    const offIcon = els.soundToggle.querySelector('.icon-sound-off');
    if (onIcon) onIcon.style.display = isMuted ? 'none' : 'block';
    if (offIcon) offIcon.style.display = isMuted ? 'block' : 'none';
  }

  function toggleMusic() {
    if (audioEl.paused) {
      audioEl.play().then(() => {
        audioEl.muted = false;
        syncSoundUi();
        showToast('Musik Gamelan Dimainkan');
      }).catch(() => {});
    } else {
      audioEl.muted = !audioEl.muted;
      syncSoundUi();
      showToast(audioEl.muted ? 'Musik Gamelan Dibisukan' : 'Musik Gamelan Aktif');
    }
  }

  // Reset Puppets Position
  function resetPuppetsPosition() {
    puppets[0].pos.snap(view.x + view.w * 0.3, view.y + view.h * 0.6);
    puppets[1].pos.snap(view.x + view.w * 0.7, view.y + view.h * 0.6);
    puppets[0].facing = -1;
    puppets[1].facing = 1;
    showToast('Posisi wayang dikalibrasi ulang');
  }

  // Character Selector Logic
  function updateCharacterBadges(mode) {
    state.characterMode = mode;
    if (mode === 'reference') {
      if (els.badgeLeftRole) els.badgeLeftRole.textContent = 'Wayang Kulit Tradisional';
      if (els.badgeLeftName) els.badgeLeftName.textContent = 'Tokoh Utama Referensi';
      if (els.badgeRightRole) els.badgeRightRole.textContent = 'Wayang Kulit Tradisional';
      if (els.badgeRightName) els.badgeRightName.textContent = 'Tokoh Utama Referensi';
      if (els.puppetBadgeCenter) {
        els.puppetBadgeCenter.innerHTML = '<span class="reel-style-pill"><i class="bi bi-stars"></i> Dua Wayang · Satu Per Tangan</span>';
      }
    } else {
      if (els.badgeLeftRole) els.badgeLeftRole.textContent = 'Ksatria Pringgandani';
      if (els.badgeLeftName) els.badgeLeftName.textContent = 'Raden Gatotkaca';
      if (els.badgeRightRole) els.badgeRightRole.textContent = 'Ksatria Madukara';
      if (els.badgeRightName) els.badgeRightName.textContent = 'Raden Arjuna';
      if (els.puppetBadgeCenter) {
        els.puppetBadgeCenter.innerHTML = '<span class="reel-style-pill"><i class="bi bi-shield-shaded"></i> Raden Gatotkaca &amp; Arjuna</span>';
      }
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
    const active = puppets.slice(0, controller.puppetCount);

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
        showToast(active.length === 2 ? `${j === 0 ? 'Wayang Kiri' : 'Wayang Kanan'} · Tari Kiprahan Aktif (Beat Gamelan)` : 'Tari Kiprahan Aktif (Beat Gamelan)');
      }
    });

    // Dynamic Shadow Calculation: depth dictates scale, blur, and opacity
    const layers = active
      .map((p) => {
        const depth = Math.max(0, p.depth.x);
        return {
          depth: p.depth.x,
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
        title: 'Izin Akses Kamera Ditolak',
        desc: 'Peramban tidak memiliki izin untuk mengakses webcam Anda. Silakan klik ikon perizinan/kamera di bilah alamat peramban (URL bar) untuk mengizinkan akses webcam, lalu klik tombol "Coba Hubungkan Lagi".',
      };
    }

    if (errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError') {
      return {
        title: 'Kamera Tidak Ditemukan',
        desc: 'Tidak ada perangkat kamera yang terdeteksi pada komputer atau laptop Anda. Pastikan webcam terpasang dan tidak dinonaktifkan di pengaturan sistem operasi.',
      };
    }

    if (errorName === 'NotReadableError' || errorName === 'TrackStartError') {
      return {
        title: 'Kamera Sedang Digunakan Aplikasi Lain',
        desc: 'Kamera Anda kemungkinan sedang digunakan oleh aplikasi lain (seperti Zoom, Google Meet, Microsoft Teams) atau tab peramban lain. Tutup aplikasi tersebut lalu coba hubungkan kembali.',
      };
    }

    if (errorName === 'OverconstrainedError' || errorName === 'ConstraintNotSatisfiedError') {
      return {
        title: 'Resolusi Kamera Tidak Kompatibel',
        desc: 'Perangkat keras webcam tidak mendukung resolusi yang diminta. Sistem telah mencoba opsi resolusi alternatif namun belum berhasil.',
      };
    }

    if (errorName === 'SecurityError' || message.includes('HTTPS') || message.includes('insecure')) {
      return {
        title: 'Koneksi Aman (HTTPS) Diperlukan',
        desc: 'Kebijakan keamanan peramban mewajibkan koneksi HTTPS untuk membuka kamera. Pastikan situs diakses melalui alamat HTTPS yang aman atau localhost.',
      };
    }

    return {
      title: 'Kamera Tidak Dapat Dihubungkan',
      desc: `Terjadi kendala saat menghubungkan kamera (${errorName || 'Error'}: ${message || 'Gagal memulai aliran video'}). Anda dapat mencoba menghubungkan kembali atau bermain menggunakan mode mouse.`,
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
      // Tier 1: Ideal 720p 30fps user-facing webcam (phones / supported webcams)
      {
        video: {
          facingMode: 'user',
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
          facingMode: 'user',
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

        // Synchronize preview canvas resolution with webcam video frame
        if (els.previewCanvas && els.video && els.video.videoWidth > 0) {
          els.previewCanvas.width = els.video.videoWidth;
          els.previewCanvas.height = els.video.videoHeight;
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
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.55,
          minTrackingConfidence: 0.5,
        });

        hands.onResults((results) => {
          if (!state.isActive || !state.isCameraRunning) return;
          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            controller.ingest(results.multiHandLandmarks, performance.now());
          } else {
            controller.ingest([], performance.now());
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
    controller.source = 'demo';
    controller.slots.forEach((s) => { s.active = false; s.landmarks = null; });
    updateHud();

    // 1. Stop frame processing
    stopVideoFrameProcessing();

    // 2. Stop camera stream tracks cleanly
    if (state.mediaStream) {
      state.mediaStream.getTracks().forEach((track) => {
        try { track.stop(); } catch (e) {}
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

    // 5. Update UI
    if (els.btnStop) els.btnStop.style.display = 'none';
    if (els.overlayIntro) els.overlayIntro.classList.remove('hidden', 'gone');
    if (els.overlayError) els.overlayError.classList.add('hidden');
    if (els.overlayLoading) els.overlayLoading.classList.add('hidden');

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
    if (els.overlayIntro) els.overlayIntro.classList.add('hidden', 'gone');
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

  els.btnShadow?.addEventListener('click', () => {
    state.shadowMode = !state.shadowMode;
    els.stageViewport?.classList.toggle('shadow-mode', state.shadowMode);
    els.btnShadow.classList.toggle('active', state.shadowMode);
    showToast(state.shadowMode ? 'Mode Bayangan Siluet Kelir Aktif' : 'Mode Warna Asli Aktif');
  });

  els.btnFullscreen?.addEventListener('click', toggleFullscreen);

  els.soundToggle?.addEventListener('click', toggleMusic);

  els.settingsToggle?.addEventListener('click', () => {
    if (els.settingsDrawer?.hidden) openSettings();
    else closeSettings();
  });
  els.btnCloseSettings?.addEventListener('click', closeSettings);

  els.btnGuide?.addEventListener('click', () => {
    if (els.guideModal) els.guideModal.classList.add('open');
  });
  els.btnCloseGuide?.addEventListener('click', () => {
    if (els.guideModal) els.guideModal.classList.remove('open');
  });
  els.btnUnderstoodGuide?.addEventListener('click', () => {
    if (els.guideModal) els.guideModal.classList.remove('open');
  });

  els.btnDismissLandscape?.addEventListener('click', () => {
    if (els.landscapeSuggestion) els.landscapeSuggestion.style.display = 'none';
  });

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

  // Hotkeys
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
      }
      if (els.guideModal && els.guideModal.classList.contains('open')) {
        els.guideModal.classList.remove('open');
      } else if (state.isFullscreen || state.isFullscreenFallback || document.fullscreenElement) {
        exitFullscreen();
      }
      return;
    }

    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

    const key = e.key.toUpperCase();
    if (key === 'D') {
      controller.requestDance();
      showToast('Tari Kiprahan Aktif (Beat Gamelan)');
    } else if (key === 'F') {
      turnPuppet(0);
      showToast('Arah hadap wayang kiri dibalik');
    } else if (key === 'G') {
      turnPuppet(1);
      showToast('Arah hadap wayang kanan dibalik');
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

  // Autoplay music gesture listener
  const startMusicOnInteraction = (e) => {
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
  initRenderer().then(() => {
    resizeStage();
    rafId = requestAnimationFrame(tick);
  });

  window.wayang = { puppets, controller, beatClock, renderer, audio: audioEl };
})();

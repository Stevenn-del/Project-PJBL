# Implementation Plan: Mobile Wayang Motion Experience Optimization

## Overview
Optimize the existing Wayang Motion feature in Karsakala to deliver a seamless, high-taste mobile experience while preserving the desktop experience and all existing 3D kinematics, dual-puppet controls, MediaPipe hand tracking, audio, and shadow mechanics. The enhancement introduces an orientation guidance modal for mobile phones, dynamic landscape detection with non-blocking portrait fallbacks, a dedicated pre-camera Ready-to-Start screen, robust Indonesian camera error handling, and effective viewport utilization on mobile landscape without auto-starting camera permissions.

## Architecture Decisions
1. **Pure Vanilla JS + Bootstrap 5 + CSS Architecture**: Maintain the existing stack without any external libraries or dependencies.
2. **Strict Camera Consent Gate**: Absolute ban on webcam initialization, MediaPipe loading, or camera permission requests on page load or during orientation flow. Camera acquisition is triggered ONLY upon explicit user click on "Mulai Wayang Motion".
3. **Karsakala Visual Heritage**: Adhere to Karsakala's design system tokens (Deep Black `#080808`, Antique Gold `#C5A44D`, Subtle Burgundy `#741D2B`, Warm Ivory `#F4EFE4`, Inria Serif & Poppins typography).
4. **Antislop Principles & Copywriting Rules**: Strictly forbid em dashes (`—`) in UI copy (per R-02). Use commas, colons, or parentheses. Ensure touch targets >= 44x44px (per R-03), WCAG AA 4.5:1 contrast (per R-25), and full keyboard/touch accessibility (per R-32).
5. **Non-Blocking Mobile Orientation Flow**: Orientation modal provides clear horizontal rotation guidance with an interactive "Lanjutkan" button. If the user remains in portrait, a prompt encourages rotation while offering a "Tetap di Mode Potret" fallback to prevent user traps. Rotation listeners (`orientationchange`, `resize`, `matchMedia`) automatically advance the UI when rotated.
6. **Unified Ready-to-Start Screen**: Serve desktop and mobile users with a unified, high-aesthetics Ready-to-Start screen ("Siap Memasuki Panggung Wayang?") before camera access, explaining hand-tracking privacy and providing clear action buttons ("Mulai Wayang Motion" and secondary actions).

## Task List

### Phase 1: Structure & Markup (HTML)
- [ ] Task 1: Add Mobile Orientation Modal and Rotation Prompt markup to `wayang-motion.html`
- [ ] Task 2: Refactor `#overlay-intro` into the dedicated Ready-to-Start screen in `wayang-motion.html` with explicit "Mulai Wayang Motion" button, Dalang instruction, and back buttons

### Checkpoint: Markup Verification
- [ ] Verify semantic HTML, accessibility attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`), and antislop copy check (zero em dashes)

### Phase 2: Styling & Mobile Layout (CSS)
- [ ] Task 3: Style Mobile Orientation Modal & Rotation Prompt in `css/wayang-motion.css` using Karsakala's palette (Deep Black, Burgundy, Antique Gold, Warm Ivory)
- [ ] Task 4: Implement mobile landscape optimizations for `.stage-viewport-wrapper`, `#kelir-canvas`, `.stage-floating-actions`, `#webcam-pip-card`, and controls
- [ ] Task 5: Style the Ready-to-Start screen for desktop, tablet, and mobile responsiveness with touch targets >= 44px

### Checkpoint: Styling Verification
- [ ] Verify responsive breakpoints (mobile portrait <= 820px, mobile landscape, tablet, desktop)
- [ ] Verify WCAG AA contrast and absence of layout thrashing or unwanted page scrolling in active landscape

### Phase 3: Controller & Flow Logic (JavaScript)
- [ ] Task 6: Implement device detection, orientation listeners, and modal state management in `js/wayang-motion.js`
- [ ] Task 7: Wire up the Ready-to-Start screen, ensuring camera and MediaPipe remain strictly uninitialized until "Mulai Wayang Motion" is clicked
- [ ] Task 8: Enhance `resizeStage()`, mobile landscape canvas scaling, and stream cleanup when exiting or stopping

### Checkpoint: Core Integration & Verification
- [ ] Verify orientation change transitions (portrait -> landscape -> portrait)
- [ ] Verify camera permission error states and retry behavior
- [ ] Verify desktop and tablet flows remain completely functional

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| User has orientation lock on mobile phone | High | Provide a clear "Tetap di Mode Potret" fallback button so user is never trapped |
| Premature camera permission request on load | Critical | Audit all load listeners; guarantee `acquireCameraStream()` and `startWebcam()` are only invoked on `#btn-start-motion` click |
| Canvas aspect ratio distortion on mobile landscape | Medium | Adjust `resizeStage()` to use actual bounding client rect of viewport without desktop-only 640x480 minimum clamp |
| Accidental horizontal scroll or viewport overflow | Medium | Add `overflow: hidden` on stage container during active play; test across small screen dimensions |

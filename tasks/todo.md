# Tasks: Wayang Motion Public Exhibition Experience

- [x] Task 1: Add Mobile & Tablet Orientation Modal ("Miringkan Perangkat Anda") and Rotation Prompt markup to `wayang-motion.html`
- [x] Task 2: Configure dedicated Ready Screen ("Siap Memasuki Panggung Wayang?") with privacy camera gate ("Mulai Wayang Motion") in `wayang-motion.html`
- [x] Task 3: Implement visitor-friendly error handling ("Kamera belum dapat diakses.", "Coba Lagi") in `wayang-motion.html` and `js/wayang-motion.js`
- [x] Task 4: Add iOS Safari compatibility attributes (`playsinline`, `webkit-playsinline`, `muted`) in `wayang-motion.html` and `js/wayang-motion.js`
- [x] Task 5: Style Orientation Modal and responsive rotation prompts in `css/wayang-motion.css` using Karsakala heritage aesthetics
- [x] Task 6: Implement responsive landscape/portrait stage viewport and minimum 44x44px touch targets in `css/wayang-motion.css`
- [x] Task 7: Implement device detection (`isMobileOrTablet`) covering phones, iPads, Android tablets, and desktops in `js/wayang-motion.js`
- [x] Task 8: Implement progressive camera constraint fallbacks (`facingMode: { ideal: 'user' }` -> generic -> 480p -> `video: true`)
- [x] Task 9: Implement resource cleanup on session stop, page unload (`beforeunload`), and app switch (`pagehide`)
- [x] Task 10: Run verification suites (`verify_wayang_motion.cjs` and `test_orientation_and_camera_flow.cjs`) verifying 100% PASS

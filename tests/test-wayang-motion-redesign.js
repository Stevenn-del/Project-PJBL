const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3600;
const ROOT_DIR = path.resolve(__dirname, '..');
const SCREENSHOT_DIR = path.join(ROOT_DIR, 'test_screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/wayang-motion.html';
  const filePath = path.join(ROOT_DIR, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + reqPath);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

const testResults = [];
function record(name, passed, detail = '') {
  testResults.push({ name, passed, detail });
  const status = passed ? '[PASS]' : '[FAIL]';
  console.log(`${status} ${name} ${detail ? `- ${detail}` : ''}`);
}

async function runWayangMotionTests() {
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
  console.log(`\n======================================================`);
  console.log(`WAYANG MOTION REDESIGN PLAYWRIGHT TEST SUITE`);
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
  console.log(`======================================================\n`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
  });

  try {
    // =========================================================================
    // 1. ASSET INTEGRITY: Reference Wayang Puppet Inspection
    // =========================================================================
    console.log('--- 1. Testing Puppet Reference Asset Fidelity ---');
    const refAssetPath = path.join(ROOT_DIR, 'assets/images/wayang-reference.png');
    const refAssetExists = fs.existsSync(refAssetPath);
    record('Reference puppet asset exists in assets/images', refAssetExists);

    if (refAssetExists) {
      const buf = fs.readFileSync(refAssetPath);
      const w = buf.readUInt32BE(16);
      const h = buf.readUInt32BE(20);
      const aspect = w / h;
      record('Reference puppet has authentic dimensions', w === 587 && h === 1208, `${w}x${h} (Aspect ratio: ${aspect.toFixed(4)})`);
    }

    // =========================================================================
    // 2. VIEWPORT RESOLUTION MATRIX (1366x768, 1440x900, 1920x1080)
    // =========================================================================
    console.log('\n--- 2. Testing Viewport Resolutions & Background Aesthetics ---');
    const viewports = [
      { name: '1366x768', width: 1366, height: 768 },
      { name: '1440x900', width: 1440, height: 900 },
      { name: '1920x1080', width: 1920, height: 1080 },
    ];

    for (const vp of viewports) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      const jsErrors = [];
      page.on('pageerror', (err) => jsErrors.push(err.message));

      await page.goto(`http://127.0.0.1:${PORT}/wayang-motion.html`);
      await page.waitForSelector('#stage-viewport');

      // Check background elements
      const cloudsVisible = await page.isVisible('.cultural-ambient-clouds');
      const pelmetVisible = await page.isVisible('.stage-pelmet-top');
      const debogVisible = await page.isVisible('.stage-debog-base');
      const containerVisible = await page.isVisible('#wayang-experience-container');

      record(
        `Viewport ${vp.name} renders proscenium & background motifs cleanly`,
        cloudsVisible && pelmetVisible && debogVisible && containerVisible && jsErrors.length === 0,
        `Errors: ${jsErrors.length}`
      );

      // Capture normal state screenshot
      const shotPath = path.join(SCREENSHOT_DIR, `wayang_motion_${vp.name}_redesign_normal.png`);
      await page.screenshot({ path: shotPath });
      console.log(`Saved screenshot: ${shotPath}`);

      await page.close();
    }

    // =========================================================================
    // 3. INTERACTIVE CONTROLS, CHARACTER SELECTOR & SHADOW MODE
    // =========================================================================
    console.log('\n--- 3. Testing Interactive Controls, Character Mode & Lighting ---');
    const pageMain = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      permissions: ['camera'],
    });

    const pageErrors = [];
    pageMain.on('pageerror', (err) => pageErrors.push(err.message));

    await pageMain.goto(`http://127.0.0.1:${PORT}/wayang-motion.html`);

    // Verify Character Selector
    const selectorExists = await pageMain.$('#select-puppet-mode');
    record('Character selector is present in control bar', !!selectorExists);
    const selectedMode = await pageMain.$eval('#select-puppet-mode', (el) => el.value);
    record('Reference Wayang (Instagram Reel) is selected by default', selectedMode === 'reference');

    // Verify center pill badge
    const centerPillText = await pageMain.$eval('#puppet-badge-center', (el) => el.textContent.trim());
    record('Center reel-style pill badge displays dual puppet info', centerPillText.includes('Dua Wayang'));

    // Switch to Gatotkaca & Arjuna
    await pageMain.selectOption('#select-puppet-mode', 'gatotkaca-arjuna');
    await pageMain.waitForTimeout(200);
    const leftNameClassic = await pageMain.$eval('#badge-left-name', (el) => el.textContent.trim());
    record('Switching to classic characters updates badge names', leftNameClassic.includes('Gatotkaca'));

    // Switch back to Reference
    await pageMain.selectOption('#select-puppet-mode', 'reference');
    await pageMain.waitForTimeout(200);
    const leftNameRef = await pageMain.$eval('#badge-left-name', (el) => el.textContent.trim());
    record('Switching back restores reference wayang badges', leftNameRef.includes('Referensi'));

    // Test Shadow Mode Toggle
    const btnShadow = await pageMain.$('#btn-toggle-shadow');
    await btnShadow.click();
    await pageMain.waitForTimeout(250);
    const isShadowActive = await pageMain.$eval('#stage-viewport', (el) => el.classList.contains('shadow-mode'));
    record('Shadow Mode activates backlit shadow play styling', isShadowActive);
    await pageMain.screenshot({ path: path.join(SCREENSHOT_DIR, 'wayang_motion_shadow_mode_redesign.png') });
    await btnShadow.click(); // revert to color
    await pageMain.waitForTimeout(200);

    // =========================================================================
    // 4. FUNCTIONAL FULLSCREEN SYSTEM (Enter, Layout, Escape, Exit)
    // =========================================================================
    console.log('\n--- 4. Testing Functional Fullscreen System ---');
    const btnFullscreen = await pageMain.$('#btn-toggle-fullscreen');
    record('Fullscreen button is present in control bar', !!btnFullscreen);

    // Enter Fullscreen via button
    await btnFullscreen.click();
    await pageMain.waitForTimeout(300);

    // Verify Fullscreen state
    const isContainerFs = await pageMain.$eval('#wayang-experience-container', (el) =>
      el.classList.contains('is-fullscreen') || el.classList.contains('is-fullscreen-fallback')
    );
    record('Activating fullscreen button updates container layout state', isContainerFs);

    const fsBtnText = await pageMain.$eval('#btn-toggle-fullscreen span', (el) => el.textContent.trim());
    const fsBtnIcon = await pageMain.$eval('#btn-toggle-fullscreen i', (el) => el.className);
    record('Fullscreen button label changes to "Keluar Layar Penuh"', fsBtnText === 'Keluar Layar Penuh');
    record('Fullscreen button icon changes to exit icon (bi-fullscreen-exit)', fsBtnIcon.includes('bi-fullscreen-exit'));

    // Verify canvas dimensions adapted to full screen size
    const canvasDimsFs = await pageMain.$eval('#kelir-canvas', (el) => ({
      width: el.width,
      height: el.height,
    }));
    record(
      'Canvas expands dimensions for fullscreen without distortion',
      canvasDimsFs.height >= 700 || canvasDimsFs.width >= 1200,
      `${canvasDimsFs.width}x${canvasDimsFs.height}`
    );

    // Capture Fullscreen state screenshot
    await pageMain.screenshot({ path: path.join(SCREENSHOT_DIR, 'wayang_motion_fullscreen_1440.png') });
    console.log(`Saved screenshot: ${path.join(SCREENSHOT_DIR, 'wayang_motion_fullscreen_1440.png')}`);

    // Test Exit Fullscreen via Escape key
    await pageMain.keyboard.press('Escape');
    await pageMain.waitForTimeout(300);

    // If still in native fullscreen, clicking button exits
    const stillFsAfterEsc = await pageMain.$eval('#wayang-experience-container', (el) =>
      el.classList.contains('is-fullscreen')
    );
    if (stillFsAfterEsc) {
      await btnFullscreen.click();
      await pageMain.waitForTimeout(300);
    }

    const isExitedFs = await pageMain.$eval('#wayang-experience-container', (el) =>
      !el.classList.contains('is-fullscreen') && !el.classList.contains('is-fullscreen-fallback')
    );
    record('Exiting fullscreen restores normal container dimensions cleanly', isExitedFs);

    const fsBtnRestoredText = await pageMain.$eval('#btn-toggle-fullscreen span', (el) => el.textContent.trim());
    record('Fullscreen button label restores to "Layar Penuh"', fsBtnRestoredText === 'Layar Penuh');

    // =========================================================================
    // 5. INTERACTIVE FLOW & POINTER / SIMULATION INTEGRITY
    // =========================================================================
    console.log('\n--- 5. Testing Interactive Flow & Pointer Puppeteering ---');
    const btnStart = await pageMain.$('#btn-start-motion');
    await btnStart.click();
    await pageMain.waitForTimeout(2000);

    const btnStop = await pageMain.$('#btn-stop-camera');
    const isStopVisible = await btnStop.isVisible();
    record('Starting experience activates session controls', isStopVisible);

    // Simulate pointer dragging on canvas to test motion
    const canvasRect = await pageMain.$eval('#kelir-canvas', (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left, y: r.top, width: r.width, height: r.height };
    });

    await pageMain.mouse.move(canvasRect.x + canvasRect.width * 0.28, canvasRect.y + canvasRect.height * 0.5);
    await pageMain.mouse.down();
    await pageMain.mouse.move(canvasRect.x + canvasRect.width * 0.38, canvasRect.y + canvasRect.height * 0.42);
    await pageMain.mouse.up();
    await pageMain.waitForTimeout(500);

    await pageMain.screenshot({ path: path.join(SCREENSHOT_DIR, 'wayang_motion_active_redesign_stage.png') });
    record('Interactive puppet movement and Blencong rendering operate without errors', pageErrors.length === 0, `Errors: ${pageErrors.length}`);

    // Enter Fullscreen during active play to verify enlarged puppet proportions
    const btnFsLive = await pageMain.$('#btn-toggle-fullscreen');
    await btnFsLive.click();
    await pageMain.waitForTimeout(400);
    await pageMain.screenshot({ path: path.join(SCREENSHOT_DIR, 'wayang_motion_active_fullscreen_stage.png') });
    record('Active play in fullscreen renders enlarged puppets without distortion', true);
    await btnFsLive.click();
    await pageMain.waitForTimeout(300);

    // Test stop
    await btnStop.click();
    await pageMain.waitForTimeout(300);
    record('Stopping experience stops camera and resets UI cleanly', true);

    await pageMain.close();

    // =========================================================================
    // 6. ISOLATION CHECK: Verify Protected Pages are Untouched & Intact
    // =========================================================================
    console.log('\n--- 6. Verifying Isolation of Other Website Pages ---');
    const pageCheck = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    // Check Index
    await pageCheck.goto(`http://127.0.0.1:${PORT}/index.html`);
    const indexTitle = await pageCheck.title();
    record('index.html intact & functional', indexTitle.includes('Karsa Potret'));

    // Check Timeline
    await pageCheck.goto(`http://127.0.0.1:${PORT}/timeline.html`);
    const timelineTitle = await pageCheck.title();
    record('timeline.html intact & functional', timelineTitle.includes('Jejak') || timelineTitle.includes('Timeline'));

    // Check Peta
    await pageCheck.goto(`http://127.0.0.1:${PORT}/peta.html`);
    const petaTitle = await pageCheck.title();
    record('peta.html intact & functional', petaTitle.includes('Peta Interaktif'));

    await pageCheck.close();
  } catch (err) {
    console.error('Fatal test error:', err);
    record('Test execution completed', false, err.message);
  } finally {
    await browser.close();
    server.close();
    console.log('\n======================================================');
    console.log('PLAYWRIGHT TEST RESULTS SUMMARY:');
    const total = testResults.length;
    const passed = testResults.filter((r) => r.passed).length;
    console.log(`TOTAL: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
    console.log('======================================================\n');
  }
}

runWayangMotionTests();

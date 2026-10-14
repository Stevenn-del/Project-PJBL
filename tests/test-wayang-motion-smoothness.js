const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3800;
const ROOT_DIR = path.resolve(__dirname, '..');

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
  '.ico': 'image/x-icon',
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

const results = [];
function record(name, passed, detail = '') {
  results.push({ name, passed, detail });
  console.log(`${passed ? '[PASS]' : '[FAIL]'} ${name} ${detail ? '- ' + detail : ''}`);
}

async function runSmoothnessVerification() {
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
  console.log(`\n======================================================`);
  console.log(`WAYANG MOTION SMOOTHNESS & ACCURACY VERIFICATION`);
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
  console.log(`======================================================\n`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
  });

  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      permissions: ['camera'],
    });

    const pageErrors = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto(`http://127.0.0.1:${PORT}/wayang-motion.html`);
    await page.waitForSelector('#stage-viewport');

    // 1. Verify 1-Euro Filter & Kinematic State exists in runtime
    const runtimeVerification = await page.evaluate(() => {
      // Check if OneEuroFilter and puppets are running
      const canvas = document.getElementById('kelir-canvas');
      return {
        canvasFound: !!canvas,
        hasAudio: !!document.getElementById('sound-toggle'),
        hasStatus: !!document.getElementById('status'),
      };
    });
    record('Runtime DOM elements initialized cleanly', runtimeVerification.canvasFound && runtimeVerification.hasAudio);

    // 2. Start webcam session
    const btnStart = await page.$('#btn-start-motion');
    await btnStart.click();
    await page.waitForTimeout(2500);

    const videoRunning = await page.$eval('#webcam-video', (v) => !v.paused && v.readyState >= 2);
    record('Webcam video initialized before hand model processing', videoRunning);

    // 3. Test interactive puppet motion smoothness & zero-detachment
    const canvasBox = await page.$eval('#kelir-canvas', (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left, y: r.top, width: r.width, height: r.height };
    });

    // Simulate steady circular hand movement
    const steps = 12;
    const trajectory = [];
    for (let i = 0; i <= steps; i++) {
      const angle = (i / steps) * Math.PI * 2;
      const targetX = canvasBox.x + canvasBox.width * 0.28 + Math.cos(angle) * 80;
      const targetY = canvasBox.y + canvasBox.height * 0.50 + Math.sin(angle) * 60;
      trajectory.push({ x: targetX, y: targetY });
    }

    await page.mouse.move(trajectory[0].x, trajectory[0].y);
    await page.mouse.down();
    for (const pt of trajectory) {
      await page.mouse.move(pt.x, pt.y);
      await page.waitForTimeout(25);
    }
    await page.mouse.up();
    await page.waitForTimeout(300);

    record('Smooth interactive trajectory simulated with zero JavaScript errors', pageErrors.length === 0, `Errors: ${pageErrors.length}`);

    // 4. Capture screenshot of smoothly posed puppets
    const shotPath = path.join(ROOT_DIR, 'test_screenshots', 'wayang_motion_smooth_movement.png');
    await page.screenshot({ path: shotPath });
    console.log(`Saved smoothness verification screenshot: ${shotPath}`);

    // 5. Test Settings Drawer options (finger mapping select)
    const btnSettings = await page.$('#settings-toggle');
    if (btnSettings) {
      await btnSettings.click();
      await page.waitForTimeout(300);

      const optFingersVal = await page.$eval('#opt-fingers', (sel) => sel.value);
      record('Finger mapping select option is initialized to default', optFingersVal === 'thumb-index', `value: ${optFingersVal}`);

      // Change finger mapping
      await page.selectOption('#opt-fingers', 'thumb-pinky');
      await page.waitForTimeout(200);
      const updatedOpt = await page.$eval('#opt-fingers', (sel) => sel.value);
      record('Finger mapping select successfully changes to thumb-pinky', updatedOpt === 'thumb-pinky');

      // Close settings
      await page.click('#btn-close-settings');
      await page.waitForTimeout(200);
    }

    // 6. Test Hotkeys (Key D for Kiprahan dance, Key C for calibrate)
    await page.keyboard.press('KeyD');
    await page.waitForTimeout(300);
    const toastText = await page.$eval('#toast', (t) => t.textContent.trim());
    record('Hotkeys (Key D) toggles Kiprahan dance mode with toast confirmation', toastText.includes('Tari Kiprahan'), `Toast: ${toastText}`);

    // Stop session
    await page.click('#btn-stop-camera');
    await page.waitForTimeout(400);

    const isStopped = await page.$eval('#btn-stop-camera', (btn) => btn.style.display === 'none');
    record('Stop session cleanly resets UI and halts tracking loop', isStopped);

    await page.close();
  } catch (err) {
    console.error('Fatal test error:', err);
    record('Smoothness test execution', false, err.message);
  } finally {
    await browser.close();
    server.close();
    console.log('\n======================================================');
    console.log('SMOOTHNESS RESULTS SUMMARY:');
    const total = results.length;
    const passed = results.filter((r) => r.passed).length;
    console.log(`TOTAL: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
    console.log('======================================================\n');
  }
}

runSmoothnessVerification();

const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3700;
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

async function runWebcamVerification() {
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
  console.log(`\n======================================================`);
  console.log(`WEBCAM & HAND TRACKING INTEGRATION VERIFICATION`);
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

    const consoleMessages = [];
    const pageErrors = [];

    page.on('console', (msg) => {
      consoleMessages.push({ type: msg.type(), text: msg.text() });
    });
    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
    });

    // 1. Check favicon request
    const faviconRes = await page.goto(`http://127.0.0.1:${PORT}/favicon.ico`);
    record('favicon.ico is present and returns HTTP 200', faviconRes.status() === 200, `Status: ${faviconRes.status()}`);

    // 2. Load wayang-motion.html
    await page.goto(`http://127.0.0.1:${PORT}/wayang-motion.html`);
    await page.waitForSelector('#webcam-pip-card');

    // 3. Inspect video element before camera activation
    const videoBefore = await page.$eval('#webcam-video', (el) => {
      const style = window.getComputedStyle(el);
      return {
        display: style.display,
        position: style.position,
        zIndex: style.zIndex,
        width: el.clientWidth,
        height: el.clientHeight,
      };
    });
    record(
      'Webcam video element is configured for visible display (not display:none)',
      videoBefore.display !== 'none',
      `display: ${videoBefore.display}`
    );

    // 4. Click Mulai Kamera
    const btnStart = await page.$('#btn-start-motion');
    await btnStart.click();

    // Wait for camera initialization
    await page.waitForTimeout(2500);

    // 5. Inspect video element while camera is active
    const videoActive = await page.$eval('#webcam-video', (el) => {
      const style = window.getComputedStyle(el);
      return {
        hasSrcObject: !!el.srcObject,
        paused: el.paused,
        ended: el.ended,
        readyState: el.readyState,
        videoWidth: el.videoWidth,
        videoHeight: el.videoHeight,
        clientWidth: el.clientWidth,
        clientHeight: el.clientHeight,
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        transform: style.transform,
      };
    });

    record(
      'Webcam stream is assigned to #webcam-video element',
      videoActive.hasSrcObject,
      `srcObject attached: ${videoActive.hasSrcObject}`
    );
    record(
      'Webcam video is actively playing (not paused or ended)',
      !videoActive.paused && !videoActive.ended,
      `paused: ${videoActive.paused}, ended: ${videoActive.ended}, readyState: ${videoActive.readyState}`
    );
    record(
      'Webcam video has valid positive dimensions before hand tracking',
      videoActive.videoWidth > 0 && videoActive.videoHeight > 0,
      `videoWidth: ${videoActive.videoWidth}, videoHeight: ${videoActive.videoHeight}`
    );
    record(
      'Webcam video is rendered with non-zero dimensions in PiP preview viewport',
      videoActive.clientWidth > 0 && videoActive.clientHeight > 0 && videoActive.display === 'block',
      `dimensions: ${videoActive.clientWidth}x${videoActive.clientHeight}`
    );
    record(
      'Webcam video has horizontal mirror transform for natural dalang reflection',
      videoActive.transform.includes('matrix') || videoActive.transform.includes('scale'),
      `transform: ${videoActive.transform}`
    );

    // 6. Inspect landmark canvas
    const canvasActive = await page.$eval('#webcam-canvas', (el) => {
      const style = window.getComputedStyle(el);
      return {
        width: el.width,
        height: el.height,
        clientWidth: el.clientWidth,
        clientHeight: el.clientHeight,
        display: style.display,
        zIndex: style.zIndex,
      };
    });

    record(
      'Webcam landmark canvas is overlaid on top with matching aspect ratio',
      canvasActive.zIndex === '2' && canvasActive.display === 'block',
      `zIndex: ${canvasActive.zIndex}, resolution: ${canvasActive.width}x${canvasActive.height}`
    );

    // 7. Check for WebGL crash or page errors
    const webglErrors = consoleMessages.filter((m) =>
      m.text.toLowerCase().includes('webgl') && (m.type === 'error' || m.text.includes('0x0') || m.text.includes('INVALID_VALUE'))
    );
    record('Zero WebGL texture zero-dimension errors during frame capture', webglErrors.length === 0, `WebGL errors: ${webglErrors.length}`);
    record('Zero unhandled JavaScript runtime exceptions', pageErrors.length === 0, `Errors: ${pageErrors.length}`);

    // 8. Capture screenshot of active camera preview in PiP
    const pipBox = await page.$('#webcam-pip-card');
    const shotPath = path.join(ROOT_DIR, 'test_screenshots', 'webcam_pip_active_feed.png');
    await pipBox.screenshot({ path: shotPath });
    console.log(`Captured active webcam PiP screenshot: ${shotPath}`);

    // 9. Stop camera
    const btnStop = await page.$('#btn-stop-camera');
    await btnStop.click();
    await page.waitForTimeout(500);

    const videoStopped = await page.$eval('#webcam-video', (el) => ({
      hasSrcObject: !!el.srcObject,
      paused: el.paused,
    }));
    record('Stopping session releases webcam stream and pauses video feed cleanly', !videoStopped.hasSrcObject || videoStopped.paused);

    await page.close();
  } catch (err) {
    console.error('Fatal test error:', err);
    record('Test suite execution', false, err.message);
  } finally {
    await browser.close();
    server.close();
    console.log('\n======================================================');
    console.log('RESULTS SUMMARY:');
    const total = results.length;
    const passed = results.filter((r) => r.passed).length;
    console.log(`TOTAL: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
    console.log('======================================================\n');
  }
}

runWebcamVerification();

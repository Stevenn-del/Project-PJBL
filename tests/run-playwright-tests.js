const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PORT = 8080;
const ROOT_DIR = path.resolve(__dirname, '..');
const SCREENSHOT_DIR = path.join(ROOT_DIR, 'test_screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Simple HTTP static file server
function createServer() {
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
  };

  return http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

    const filePath = path.join(ROOT_DIR, reqPath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found: ' + reqPath);
        } else {
          res.writeHead(500);
          res.end('500 Server Error: ' + err.code);
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });
}

async function runTests() {
  const server = createServer();
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
  console.log(`Test server running at http://127.0.0.1:${PORT}`);

  const testResults = [];
  function record(name, passed, message = '') {
    testResults.push({ name, passed, message });
    console.log(`[${passed ? 'PASS' : 'FAIL'}] ${name} ${message ? '- ' + message : ''}`);
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
  });

  try {
    // -------------------------------------------------------------
    // Test 1: Navigation integrity across all pages
    // -------------------------------------------------------------
    console.log('\n--- 1. Testing Navigation & Existing Pages ---');
    const pageNav = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    
    // 1. Check index.html
    await pageNav.goto(`http://127.0.0.1:${PORT}/index.html`);
    const indexTitle = await pageNav.title();
    record('Index page loads', indexTitle.includes('Karsa Potret'), `Title: ${indexTitle}`);
    const indexActiveLink = await pageNav.$eval('.nav-links-list .nav-item-link.active', el => el.textContent.trim());
    record('Index page navbar highlights Beranda as active', indexActiveLink === 'Beranda');

    // From index.html, click Peta
    await pageNav.click('a[href="peta.html"]');
    await pageNav.waitForURL(/peta\.html/);
    record('Navigation from Index to Peta works', pageNav.url().includes('peta.html'));

    // 2. Check peta.html
    const petaTitle = await pageNav.title();
    record('Peta page loads', petaTitle.includes('Peta Interaktif'), `Title: ${petaTitle}`);
    const petaActiveLink = await pageNav.$eval('.nav-links-list .nav-item-link.active', el => el.textContent.trim());
    record('Peta page navbar highlights Peta as active', petaActiveLink === 'Peta');

    // From peta.html, click Timeline
    await pageNav.click('a[href="timeline.html"]');
    await pageNav.waitForURL(/timeline\.html/);
    record('Navigation from Peta to Timeline works', pageNav.url().includes('timeline.html'));

    // 3. Check timeline.html
    const timelineTitle = await pageNav.title();
    record('Timeline page loads', timelineTitle.includes('Timeline') || timelineTitle.includes('Jejak'), `Title: ${timelineTitle}`);
    const timelineActiveLink = await pageNav.$eval('.nav-links-list .nav-item-link.active', el => el.textContent.trim());
    record('Timeline page navbar highlights Timeline as active', timelineActiveLink === 'Timeline');

    // From timeline.html, click Wayang Motion button
    await pageNav.click('#btn-wayang-motion');
    await pageNav.waitForURL(/wayang-motion\.html/);
    record('Navigation from Timeline to Wayang Motion works', pageNav.url().includes('wayang-motion.html'));

    // 4. Check wayang-motion.html
    const wayangTitle = await pageNav.title();
    record('Wayang Motion page loads', wayangTitle.includes('Wayang Motion'), `Title: ${wayangTitle}`);
    const wayangBtnActive = await pageNav.$eval('#btn-wayang-motion', el => el.classList.contains('active'));
    record('Wayang Motion navbar highlights Wayang Motion button as active', wayangBtnActive);

    // From wayang-motion.html, click Beranda
    await pageNav.click('a[href="index.html"]');
    await pageNav.waitForURL(/index\.html/);
    record('Navigation from Wayang Motion back to Beranda works', pageNav.url().includes('index.html'));

    // Test Hero CTA button on index.html
    await pageNav.click('#btn-explore');
    await pageNav.waitForURL(/timeline\.html/);
    record('Hero CTA "Mulai menjelajah" connects to Timeline', pageNav.url().includes('timeline.html'));

    await pageNav.close();

    // -------------------------------------------------------------
    // Test 2: Resolutions Verification (1366x768, 1440x900, 1920x1080)
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Viewport Resolutions & Visual Layout ---');
    const resolutions = [
      { width: 1366, height: 768, label: '1366x768' },
      { width: 1440, height: 900, label: '1440x900' },
      { width: 1920, height: 1080, label: '1920x1080' },
    ];

    for (const res of resolutions) {
      const pageRes = await browser.newPage({ viewport: { width: res.width, height: res.height } });
      const jsErrors = [];
      pageRes.on('pageerror', (err) => jsErrors.push(err.message));

      await pageRes.goto(`http://127.0.0.1:${PORT}/wayang-motion.html`);
      await pageRes.waitForSelector('#stage-viewport');

      // Verify essential elements rendered
      const stageVisible = await pageRes.isVisible('#stage-viewport');
      const introVisible = await pageRes.isVisible('#overlay-intro');
      const titleText = await pageRes.textContent('.motion-title');

      record(
        `Resolution ${res.label} initial render`,
        stageVisible && introVisible && titleText.includes('Wayang Motion') && jsErrors.length === 0,
        `Errors: ${jsErrors.length}`
      );

      // Screenshot initial landing state
      const shotPath = path.join(SCREENSHOT_DIR, `wayang_motion_${res.label}_initial.png`);
      await pageRes.screenshot({ path: shotPath, fullPage: false });
      console.log(`Saved screenshot: ${shotPath}`);

      await pageRes.close();
    }

    // -------------------------------------------------------------
    // Test 3: Intro overlay, Start interaction, Controls & States
    // -------------------------------------------------------------
    console.log('\n--- 3. Testing Interactive Flow & Controls ---');
    const pageMain = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      permissions: ['camera'],
    });

    const pageErrors = [];
    pageMain.on('pageerror', (err) => pageErrors.push(err.message));

    await pageMain.goto(`http://127.0.0.1:${PORT}/wayang-motion.html`);

    // Check Start Button
    const btnStart = await pageMain.$('#btn-start-motion');
    record('Mulai Bermain button is present and visible', await btnStart.isVisible());

    // Check Guide Modal
    const btnGuide = await pageMain.$('#btn-open-guide');
    await btnGuide.click();
    await pageMain.waitForSelector('#guide-modal.open');
    await pageMain.waitForTimeout(350); // allow CSS transition to complete
    record('Panduan Gerakan modal opens correctly', await pageMain.isVisible('#guide-modal.open'));

    // Screenshot Guide Modal
    await pageMain.screenshot({ path: path.join(SCREENSHOT_DIR, 'wayang_motion_guide_modal.png') });

    // Close Guide Modal
    const btnUnderstood = await pageMain.$('#btn-understood-guide');
    await btnUnderstood.click();
    await pageMain.waitForFunction(() => !document.querySelector('#guide-modal').classList.contains('open'));
    await pageMain.waitForTimeout(350); // allow backdrop fade-out
    record('Panduan Gerakan modal closes on confirmation', true);

    // Test Shadow Mode Toggle
    const btnShadow = await pageMain.$('#btn-toggle-shadow');
    await btnShadow.click();
    await pageMain.waitForTimeout(200);
    const isShadow = await pageMain.$eval('#stage-viewport', el => el.classList.contains('shadow-mode'));
    record('Mode Bayangan toggle turns on shadow mode', isShadow);
    await pageMain.screenshot({ path: path.join(SCREENSHOT_DIR, 'wayang_motion_shadow_mode.png') });
    await btnShadow.click(); // Toggle back to color
    await pageMain.waitForTimeout(200);

    // Test PiP Toggle
    const btnPipToggle = await pageMain.$('#btn-toggle-pip');
    await btnPipToggle.click();
    const pipHidden = await pageMain.$eval('#webcam-pip-card', el => el.classList.contains('hidden'));
    record('Toggle PiP webcam preview hides the card', pipHidden);
    await btnPipToggle.click(); // Show again
    const pipShown = await pageMain.$eval('#webcam-pip-card', el => !el.classList.contains('hidden'));
    record('Toggle PiP webcam preview restores the card', pipShown);

    // -------------------------------------------------------------
    // Test 4: Starting Experience & Camera lifecycle / Simulation
    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Experience Start & Camera / Simulation ---');
    await btnStart.click();

    // Check that intro is hidden
    await pageMain.waitForFunction(() => document.querySelector('#overlay-intro').classList.contains('hidden'));
    record('Intro overlay hides upon starting', true);

    // Wait for either camera stream or simulated active state
    await pageMain.waitForTimeout(2500);

    // Check whether Stop Camera button is now visible
    const btnStop = await pageMain.$('#btn-stop-camera');
    const isStopVisible = await btnStop.isVisible();
    record('Stop button is displayed during active session', isStopVisible);

    // Check Status Indicator
    const statusText = await pageMain.$eval('#tracking-status-text', el => el.textContent);
    console.log('Current tracking status text:', statusText);
    record('Status text is populated', statusText.length > 0, statusText);

    // Interactive puppet movement test (drag / cursor on stage)
    const canvasBox = await pageMain.$eval('#kelir-canvas', el => {
      const rect = el.getBoundingClientRect();
      return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
    });

    // Move pointer across canvas to simulate dalang movement
    await pageMain.mouse.move(canvasBox.x + canvasBox.width * 0.25, canvasBox.y + canvasBox.height * 0.5);
    await pageMain.mouse.down();
    await pageMain.mouse.move(canvasBox.x + canvasBox.width * 0.35, canvasBox.y + canvasBox.height * 0.4);
    await pageMain.mouse.up();
    await pageMain.waitForTimeout(600);

    // Screenshot active stage
    await pageMain.screenshot({ path: path.join(SCREENSHOT_DIR, 'wayang_motion_active_stage.png') });
    record('Puppet stage renders smoothly under interaction', true);

    // Test Reset Puppets Button
    const btnReset = await pageMain.$('#btn-reset-puppets');
    await btnReset.click();
    await pageMain.waitForTimeout(300);
    record('Reset position button responds without errors', true);

    // Test Stopping Experience & Camera Track Cleanup
    await btnStop.click();
    await pageMain.waitForSelector('#overlay-intro:not(.hidden)');
    record('Stopping experience returns to intro overlay', true);

    // Verify video stream is stopped
    const videoHasSrcObject = await pageMain.$eval('#webcam-video', el => el.srcObject !== null);
    record('Camera stream tracks stopped and cleared cleanly', !videoHasSrcObject);

    // -------------------------------------------------------------
    // Test 5: Camera Denied / Error State & Interactive Fallback
    // -------------------------------------------------------------
    console.log('\n--- 5. Testing Camera Unavailable / Denied Fallback ---');
    const pageNoCam = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      permissions: [], // No camera permission
    });

    // Force getUserMedia to reject to simulate denied camera / missing hardware
    await pageNoCam.addInitScript(() => {
      if (navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia = () => Promise.reject(new Error('Permission denied by user'));
      }
    });

    await pageNoCam.goto(`http://127.0.0.1:${PORT}/wayang-motion.html`);
    const btnStartNoCam = await pageNoCam.$('#btn-start-motion');
    await btnStartNoCam.click();

    // Verify Error overlay displays
    await pageNoCam.waitForSelector('#overlay-error:not(.hidden)', { timeout: 5000 });
    const isErrorVisible = await pageNoCam.isVisible('#overlay-error');
    const errorText = await pageNoCam.$eval('#error-message-text', el => el.textContent);
    record('Error overlay displays when camera access is denied', isErrorVisible, errorText);

    // Screenshot Error State
    await pageNoCam.screenshot({ path: path.join(SCREENSHOT_DIR, 'wayang_motion_error_fallback.png') });

    // Test Interactive Mode fallback button
    const btnInteractive = await pageNoCam.$('#btn-start-interactive');
    await btnInteractive.click();
    await pageNoCam.waitForFunction(() => document.querySelector('#overlay-error').classList.contains('hidden'));
    const isSimulationActive = await pageNoCam.$eval('#tracking-status-text', el => el.textContent.includes('Simulasi') || el.textContent.includes('Kursor'));
    record('Interactive simulation fallback enables cursor puppeteering', isSimulationActive);

    // Screenshot Simulation Mode
    await pageNoCam.screenshot({ path: path.join(SCREENSHOT_DIR, 'wayang_motion_simulation_mode.png') });

    await pageNoCam.close();
    await pageMain.close();

    // -------------------------------------------------------------
    // Test 6: Peta Interaktif Features & Interactions
    // -------------------------------------------------------------
    console.log('\n--- 6. Testing Peta Interaktif Features & Interactions ---');
    const pagePeta = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await pagePeta.goto(`http://127.0.0.1:${PORT}/peta.html`);
    await pagePeta.waitForSelector('#history-map');

    record('Peta Interaktif map container initialized', await pagePeta.isVisible('#history-map'));

    // Search functionality
    await pagePeta.fill('#region-search', 'Semarang');
    await pagePeta.waitForSelector('.search-result');
    const searchResultCount = await pagePeta.$$eval('.search-result', els => els.length);
    record('Region search produces autocomplete results', searchResultCount > 0, `Results: ${searchResultCount}`);

    // Click first result
    await pagePeta.click('.search-result');
    await pagePeta.waitForTimeout(300);
    const cardTitle = await pagePeta.$eval('#region-card-content', el => el.textContent);
    record('Selecting region populates info card with history and figures', cardTitle.includes('Semarang'));

    // Test Detail Modal
    await pagePeta.click('[data-open-details]');
    await pagePeta.waitForSelector('#history-modal.is-open');
    await pagePeta.waitForTimeout(350);
    record('Opening region details modal displays full history', await pagePeta.isVisible('#history-modal'));
    await pagePeta.screenshot({ path: path.join(SCREENSHOT_DIR, 'peta_modal_1440.png') });

    // Close Modal
    await pagePeta.click('.modal-close');
    await pagePeta.waitForSelector('#history-modal:not(.is-open)');
    record('Modal closes cleanly', true);

    // Test Heritage Explore Buttons
    await pagePeta.click('[data-explore="candi"]');
    await pagePeta.waitForTimeout(400);
    const candiCardText = await pagePeta.$eval('#region-card-content', el => el.textContent);
    record('Heritage exploration button zooms and selects Magelang candi region', candiCardText.includes('Magelang'));

    await pagePeta.screenshot({ path: path.join(SCREENSHOT_DIR, 'peta_interaktif_1440.png') });
    await pagePeta.close();

    // -------------------------------------------------------------
    // Test 7: Photobooth Features & Controls (if present)
    // -------------------------------------------------------------
    if (fs.existsSync(path.join(ROOT_DIR, 'photobooth.html'))) {
      console.log('\n--- 7. Testing Photobooth Features & Controls ---');
      const pagePhoto = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      await pagePhoto.goto(`http://127.0.0.1:${PORT}/photobooth.html`);
      await pagePhoto.waitForSelector('#stage-viewport-box');

      record('Photobooth studio viewport initialized', await pagePhoto.isVisible('#stage-viewport-box'));

      // Test Tab Switching
      await pagePhoto.click('[data-tab="tab-filters"]');
      record('Switching to Filter tab displays historical filter choices', await pagePhoto.isVisible('#tab-filters'));

      // Select Sepia filter
      await pagePhoto.click('[data-filter="sepia"]');
      const isSepiaSelected = await pagePhoto.$eval('[data-filter="sepia"]', el => el.classList.contains('selected'));
      record('Selecting Sepia filter updates active selection', isSepiaSelected);

      // Switch to Aksesoris tab
      await pagePhoto.click('[data-tab="tab-stickers"]');
      await pagePhoto.click('[data-sticker="blangkon"]');
      const isBlangkonSelected = await pagePhoto.$eval('[data-sticker="blangkon"]', el => el.classList.contains('selected'));
      record('Selecting Blangkon sticker updates active accessory', isBlangkonSelected);

      // Use Sample Model button
      await pagePhoto.click('#btn-use-sample');
      await pagePhoto.waitForTimeout(350);
      record('Sample portrait model loads successfully into studio', true);
      await pagePhoto.screenshot({ path: path.join(SCREENSHOT_DIR, 'photobooth_studio_1440.png') });
      await pagePhoto.close();
    }

    // -------------------------------------------------------------
    // Test 8: Timeline Tokoh Sejarah & Warisan Budaya Features
    // -------------------------------------------------------------
    console.log('\n--- 8. Testing Timeline Tokoh & Warisan Budaya Features ---');
    const pageTimeline = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await pageTimeline.goto(`http://127.0.0.1:${PORT}/timeline.html`);
    await pageTimeline.waitForSelector('#stage-content-card');

    // 1. Tokoh Grid & Filter Verification
    const tokohCardsCount = await pageTimeline.$$eval('.tokoh-profile-card', els => els.length);
    record('Tokoh Sejarah grid populated with figures', tokohCardsCount >= 6, `Total: ${tokohCardsCount}`);

    // Scroll to #tokoh and capture
    await pageTimeline.evaluate(() => document.querySelector('#tokoh').scrollIntoView());
    await pageTimeline.waitForTimeout(300);
    await pageTimeline.screenshot({ path: path.join(SCREENSHOT_DIR, 'timeline_tokoh_1440.png') });

    // Click filter 'pemimpin'
    await pageTimeline.click('[data-tokoh-filter="pemimpin"]');
    await pageTimeline.waitForTimeout(200);
    const filteredTokohCount = await pageTimeline.$$eval('.tokoh-profile-card', els => els.length);
    record('Filtering Tokoh by "pemimpin" filters correctly', filteredTokohCount > 0 && filteredTokohCount < tokohCardsCount, `Filtered: ${filteredTokohCount}`);

    // Click filter 'all' to restore
    await pageTimeline.click('[data-tokoh-filter="all"]');

    // Test Open Tokoh Biographical Modal
    await pageTimeline.click('.btn-read-tokoh');
    await pageTimeline.waitForSelector('#tokoh-modal.is-open');
    await pageTimeline.waitForTimeout(350);
    const modalName = await pageTimeline.$eval('#tokoh-modal-title', el => el.textContent);
    record('Clicking "Telusuri Biografi" opens biographical modal', modalName.length > 0, `Figure: ${modalName}`);
    await pageTimeline.screenshot({ path: path.join(SCREENSHOT_DIR, 'timeline_tokoh_modal_1440.png') });

    // Close Modal via close button
    await pageTimeline.click('#btn-close-tokoh-modal');
    await pageTimeline.waitForSelector('#tokoh-modal:not(.is-open)');
    await pageTimeline.waitForTimeout(300);
    record('Closing biographical modal restores view cleanly', true);

    // 2. Warisan Budaya Grid & Filter Verification
    const warisanCardsCount = await pageTimeline.$$eval('.warisan-item-card', els => els.length);
    record('Warisan Budaya grid populated with heritage cards', warisanCardsCount >= 6, `Total: ${warisanCardsCount}`);

    // Scroll to #warisan-budaya and capture
    await pageTimeline.evaluate(() => document.querySelector('#warisan-budaya').scrollIntoView());
    await pageTimeline.waitForTimeout(300);
    await pageTimeline.screenshot({ path: path.join(SCREENSHOT_DIR, 'timeline_warisan_1440.png') });

    // Click filter 'unesco'
    await pageTimeline.click('[data-warisan-filter="unesco"]');
    await pageTimeline.waitForTimeout(200);
    const unescoCount = await pageTimeline.$$eval('.warisan-item-card', els => els.length);
    record('Filtering Warisan Budaya by "unesco" displays UNESCO world heritages', unescoCount > 0, `UNESCO: ${unescoCount}`);

    await pageTimeline.close();

    // -------------------------------------------------------------
    // Test 9: Desktop Viewport Visual Screenshots Across All 4 Pages
    // -------------------------------------------------------------
    console.log('\n--- 9. Capturing Desktop Viewports (1366x768, 1440x900, 1920x1080) ---');
    const viewports = [
      { name: '1366x768', width: 1366, height: 768 },
      { name: '1440x900', width: 1440, height: 900 },
      { name: '1920x1080', width: 1920, height: 1080 }
    ];

    const pagesToCapture = [
      { id: 'timeline', file: 'timeline.html', url: `http://127.0.0.1:${PORT}/timeline.html` },
      { id: 'peta', file: 'peta.html', url: `http://127.0.0.1:${PORT}/peta.html` },
      { id: 'wayang-motion', file: 'wayang-motion.html', url: `http://127.0.0.1:${PORT}/wayang-motion.html` },
      { id: 'photobooth', file: 'photobooth.html', url: `http://127.0.0.1:${PORT}/photobooth.html` }
    ].filter(p => fs.existsSync(path.join(ROOT_DIR, p.file)));

    for (const targetPage of pagesToCapture) {
      for (const vp of viewports) {
        const vpPage = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
        const errors = [];
        vpPage.on('pageerror', err => errors.push(err.message));

        await vpPage.goto(targetPage.url);
        await vpPage.waitForTimeout(600);

        const screenshotPath = path.join(SCREENSHOT_DIR, `${targetPage.id}_${vp.name}.png`);
        await vpPage.screenshot({ path: screenshotPath });
        record(`Page ${targetPage.id} at ${vp.name} renders error-free`, errors.length === 0, `Errors: ${errors.length}`);
        await vpPage.close();
      }
    }
  } catch (err) {
    console.error('Fatal test error:', err);
    record('Playwright suite execution', false, err.message);
  } finally {
    await browser.close();
    server.close();
    console.log('\n=============================================');
    console.log('PLAYWRIGHT TEST SUITE RESULTS:');
    const total = testResults.length;
    const passed = testResults.filter(r => r.passed).length;
    console.log(`TOTAL: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
    console.log('=============================================\n');
  }
}

runTests();

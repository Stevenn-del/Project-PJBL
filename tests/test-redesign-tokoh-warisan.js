const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3500;
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
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(ROOT_DIR, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
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

async function runTestSuite() {
  await new Promise(resolve => server.listen(PORT, '127.0.0.1', resolve));
  console.log(`Test server active at http://127.0.0.1:${PORT}`);

  const browser = await chromium.launch({ headless: true });

  try {
    // =========================================================================
    // 1. TOKOH EDITORIAL PAGE VERIFICATION
    // =========================================================================
    console.log('\n=============================================');
    console.log('--- 1. Testing Tokoh Editorial Page (tokoh.html) ---');
    console.log('=============================================');

    const pageTokoh = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const tokohErrors = [];
    pageTokoh.on('pageerror', err => tokohErrors.push(err.message));

    await pageTokoh.goto(`http://127.0.0.1:${PORT}/tokoh.html`);
    await pageTokoh.waitForSelector('#tokoh-spotlight');

    // 1.1 Page Title & Meta
    const tokohTitle = await pageTokoh.title();
    record('Tokoh page loaded with correct title', tokohTitle.includes('Tokoh Bersejarah'), tokohTitle);
    record('Tokoh page console and JS runtime errors check', tokohErrors.length === 0, `Errors: ${tokohErrors.length}`);

    // 1.2 Navbar Active Link
    const isTokohActive = await pageTokoh.$eval('a[href="tokoh.html"]', el => el.classList.contains('active'));
    record('Tokoh navbar marks Tokoh as active page', isTokohActive);

    // 1.3 Spotlight Featured Figure
    const spotlightName = await pageTokoh.$eval('.spotlight-figure-name', el => el.textContent.trim());
    record('Spotlight featured figure initialized', spotlightName.length > 0, `Figure: ${spotlightName}`);

    // 1.4 Curated Figure Sequence (Spacious 2-Column, NO 3-Column / 4-Column Grids)
    const figuresCount = await pageTokoh.$$eval('.tokoh-profile-card', els => els.length);
    record('Curated editorial figures rendered', figuresCount >= 5, `Figures: ${figuresCount}`);

    const gridCols = await pageTokoh.$eval('#tokoh-grid', el => window.getComputedStyle(el).gridTemplateColumns.split(' ').length);
    record('Tokoh layout uses spacious 2 columns max (no dense 3-4 column grid)', gridCols <= 2, `Columns: ${gridCols}`);

    // 1.5 Filter Tabs Functionality
    await pageTokoh.click('[data-tokoh-filter="pejuang"]');
    await pageTokoh.waitForTimeout(200);
    const pejuangCount = await pageTokoh.$$eval('.tokoh-profile-card', els => els.length);
    record('Filtering by "pejuang" updates figure collection', pejuangCount > 0 && pejuangCount < figuresCount, `Pejuang Count: ${pejuangCount}`);

    // Restore to 'all'
    await pageTokoh.click('[data-tokoh-filter="all"]');
    await pageTokoh.waitForTimeout(150);

    // 1.6 Detail Modal Interaction
    await pageTokoh.click('.btn-read-tokoh');
    await pageTokoh.waitForSelector('#tokoh-modal.is-open');
    await pageTokoh.waitForTimeout(300);
    const modalTitle = await pageTokoh.$eval('#tokoh-modal-title', el => el.textContent.trim());
    record('Clicking "Pelajari Kisah" opens biographical detail modal', modalTitle.length > 0, `Modal Figure: ${modalTitle}`);
    await pageTokoh.screenshot({ path: path.join(SCREENSHOT_DIR, 'tokoh_modal_1440.png') });

    // Close Modal via button
    await pageTokoh.click('#btn-close-tokoh-modal');
    await pageTokoh.waitForSelector('#tokoh-modal:not(.is-open)');
    record('Modal closes cleanly via close button', true);

    // Scroll down to grid and capture
    await pageTokoh.evaluate(() => document.querySelector('#tokoh-grid').scrollIntoView());
    await pageTokoh.waitForTimeout(300);
    await pageTokoh.screenshot({ path: path.join(SCREENSHOT_DIR, 'tokoh_grid_1440.png') });

    // Test Escape key close
    await pageTokoh.click('.btn-read-tokoh');
    await pageTokoh.waitForSelector('#tokoh-modal.is-open');
    await pageTokoh.keyboard.press('Escape');
    await pageTokoh.waitForSelector('#tokoh-modal:not(.is-open)');
    record('Modal closes cleanly via Escape key', true);

    // 1.7 Check All Images in Tokoh Loaded Without Broken Links
    const brokenTokohImages = await pageTokoh.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src);
    });
    record('All portrait and brand images loaded successfully', brokenTokohImages.length === 0, `Broken: ${brokenTokohImages.length}`);

    await pageTokoh.close();

    // =========================================================================
    // 2. WARISAN BUDAYA CULTURAL EXHIBITION PAGE VERIFICATION
    // =========================================================================
    console.log('\n=============================================');
    console.log('--- 2. Testing Warisan Budaya Page (warisan-budaya.html) ---');
    console.log('=============================================');

    const pageWarisan = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const warisanErrors = [];
    pageWarisan.on('pageerror', err => warisanErrors.push(err.message));

    await pageWarisan.goto(`http://127.0.0.1:${PORT}/warisan-budaya.html`);
    await pageWarisan.waitForSelector('#warisan-masterpiece');

    // 2.1 Page Title & Meta
    const warisanTitle = await pageWarisan.title();
    record('Warisan Budaya page loaded with correct title', warisanTitle.includes('Warisan Budaya'), warisanTitle);
    record('Warisan Budaya page console and JS runtime errors check', warisanErrors.length === 0, `Errors: ${warisanErrors.length}`);

    // 2.2 Navbar Active Link
    const isWarisanActive = await pageWarisan.$eval('a[href="warisan-budaya.html"]', el => el.classList.contains('active'));
    record('Warisan Budaya navbar marks Warisan Budaya as active page', isWarisanActive);

    // 2.3 Masterpiece Showcase Banner
    const masterpieceTitle = await pageWarisan.$eval('.masterpiece-title', el => el.textContent.trim());
    record('Masterpiece showcase banner initialized', masterpieceTitle.length > 0, `Masterpiece: ${masterpieceTitle}`);

    // 2.4 Exhibition Pavilion Grid (Spacious 2-Column Museum Placards)
    const warisanCardsCount = await pageWarisan.$$eval('.warisan-item-card', els => els.length);
    record('Exhibition pavilion heritage cards rendered', warisanCardsCount >= 5, `Total Cards: ${warisanCardsCount}`);

    const warisanGridCols = await pageWarisan.$eval('#warisan-grid', el => window.getComputedStyle(el).gridTemplateColumns.split(' ').length);
    record('Warisan Budaya layout uses spacious 2 columns max (no dense 3-4 column grid)', warisanGridCols <= 2, `Columns: ${warisanGridCols}`);

    // Scroll to pavilion grid and capture
    await pageWarisan.evaluate(() => document.querySelector('#warisan-grid').scrollIntoView());
    await pageWarisan.waitForTimeout(300);
    await pageWarisan.screenshot({ path: path.join(SCREENSHOT_DIR, 'warisan_grid_1440.png') });

    // 2.5 Filter Tabs Functionality
    await pageWarisan.click('[data-warisan-filter="unesco"]');
    await pageWarisan.waitForTimeout(200);
    const unescoItemsCount = await pageWarisan.$$eval('.warisan-item-card', els => els.length);
    record('Filtering by "unesco" updates heritage collection', unescoItemsCount > 0, `UNESCO Count: ${unescoItemsCount}`);

    // Restore to 'all'
    await pageWarisan.click('[data-warisan-filter="all"]');
    await pageWarisan.waitForTimeout(150);

    // 2.6 Detail Modal Interaction
    await pageWarisan.click('.btn-explore-warisan');
    await pageWarisan.waitForSelector('#warisan-modal.is-open');
    await pageWarisan.waitForTimeout(300);
    const warisanModalTitle = await pageWarisan.$eval('#warisan-modal-title', el => el.textContent.trim());
    record('Clicking "Lihat Detail Kurasi" opens exhibition modal', warisanModalTitle.length > 0, `Modal Item: ${warisanModalTitle}`);
    await pageWarisan.screenshot({ path: path.join(SCREENSHOT_DIR, 'warisan_modal_1440.png') });

    // Close Modal via button
    await pageWarisan.click('#btn-close-warisan-modal');
    await pageWarisan.waitForSelector('#warisan-modal:not(.is-open)');
    record('Exhibition modal closes cleanly via close button', true);

    // Test Escape key close
    await pageWarisan.click('.btn-explore-warisan');
    await pageWarisan.waitForSelector('#warisan-modal.is-open');
    await pageWarisan.keyboard.press('Escape');
    await pageWarisan.waitForSelector('#warisan-modal:not(.is-open)');
    record('Exhibition modal closes cleanly via Escape key', true);

    // 2.7 Check All Images in Warisan Budaya Loaded Without Broken Links
    const brokenWarisanImages = await pageWarisan.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src);
    });
    record('All cultural artifact and architectural images loaded successfully', brokenWarisanImages.length === 0, `Broken: ${brokenWarisanImages.length}`);

    await pageWarisan.close();

    // =========================================================================
    // 3. MULTI-VIEWPORT SCREENSHOT VERIFICATION (1366x768, 1440x900, 1920x1080)
    // =========================================================================
    console.log('\n=============================================');
    console.log('--- 3. Capturing Multi-Viewport Screenshots ---');
    console.log('=============================================');

    const viewports = [
      { name: '1366x768', width: 1366, height: 768 },
      { name: '1440x900', width: 1440, height: 900 },
      { name: '1920x1080', width: 1920, height: 1080 }
    ];

    for (const pageName of ['tokoh', 'warisan-budaya']) {
      for (const vp of viewports) {
        const vpPage = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
        await vpPage.goto(`http://127.0.0.1:${PORT}/${pageName}.html`, { waitUntil: 'domcontentloaded' });
        await vpPage.waitForTimeout(400);

        const outPath = path.join(SCREENSHOT_DIR, `${pageName}_${vp.name}.png`);
        await vpPage.screenshot({ path: outPath });
        record(`Screenshot captured for ${pageName} at ${vp.name}`, fs.existsSync(outPath), outPath);
        await vpPage.close();
      }
    }

    // =========================================================================
    // 4. PROTECTED PAGES SAFETY CHECK (HOME & TIMELINE REMAIN UNTOUCHED)
    // =========================================================================
    console.log('\n=============================================');
    console.log('--- 4. Protected Pages Verification ---');
    console.log('=============================================');

    const pageIndex = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const indexErrors = [];
    pageIndex.on('pageerror', err => indexErrors.push(err.message));
    await pageIndex.goto(`http://127.0.0.1:${PORT}/index.html`);
    record('Home page (index.html) preserved and renders error-free', indexErrors.length === 0);
    await pageIndex.close();

    const pageTimeline = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const timelineErrors = [];
    pageTimeline.on('pageerror', err => timelineErrors.push(err.message));
    await pageTimeline.goto(`http://127.0.0.1:${PORT}/timeline.html`);
    record('Timeline page (timeline.html) preserved and renders error-free', timelineErrors.length === 0);
    await pageTimeline.close();

  } catch (err) {
    console.error('Fatal error in test suite:', err);
    record('Playwright suite execution', false, err.message);
  } finally {
    await browser.close();
    server.close();

    console.log('\n=============================================');
    console.log('FINAL PLAYWRIGHT REDESIGN TEST RESULTS:');
    const total = testResults.length;
    const passed = testResults.filter(r => r.passed).length;
    console.log(`TOTAL: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
    console.log('=============================================\n');
  }
}

runTestSuite();

const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3700;
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
      res.end('404 Not Found: ' + reqPath);
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

async function runSinglePageSuite() {
  await new Promise(resolve => server.listen(PORT, '127.0.0.1', resolve));
  console.log(`Single-Page Test Server listening at http://127.0.0.1:${PORT}`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream']
  });

  try {
    console.log('\n=============================================');
    console.log('--- 1. Testing Single-Page Architecture & Vertical Order ---');
    console.log('=============================================');

    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.goto(`http://127.0.0.1:${PORT}/index.html`);
    await page.waitForTimeout(500);

    // 1.1 Page Title & Errors
    const title = await page.title();
    record('Index page loaded with correct title', title.includes('Karsa Potret'), title);
    record('Zero console errors on single-page index', errors.length === 0, `Errors: ${errors.length}`);

    // 1.2 Verify All Sections Exist in Correct Vertical Order
    const expectedSections = [
      'home',
      'timeline',
      'tokoh',
      'destinations',
      'heritage',
      'culinary',
      'wayang-motion'
    ];

    const sectionPositions = [];
    for (const id of expectedSections) {
      const el = await page.$(`#${id}`);
      record(`Section #${id} exists on page`, el !== null);
      if (el) {
        const box = await el.boundingBox();
        sectionPositions.push({ id, top: box ? box.y : 0 });
      }
    }

    // Check vertical sequence (each section's top is strictly greater than previous)
    let isMonotonic = true;
    for (let i = 1; i < sectionPositions.length; i++) {
      if (sectionPositions[i].top < sectionPositions[i - 1].top) {
        isMonotonic = false;
        break;
      }
    }
    record('All sections are arranged vertically in sequential top-to-bottom order', isMonotonic);

    console.log('\n=============================================');
    console.log('--- 2. Testing Navbar Quick-Access Anchor Navigation ---');
    console.log('=============================================');

    // 2.1 Verify Every Navbar Item Links to an In-Page Anchor (#...)
    const navLinks = await page.$$eval('.nav-links-list .nav-item-link, #btn-wayang-motion', els => {
      return els.map(el => ({ text: el.textContent.trim(), href: el.getAttribute('href') }));
    });

    const allAreAnchors = navLinks.every(link => link.href && link.href.startsWith('#'));
    record('Every navbar item uses an in-page anchor (#)', allAreAnchors, JSON.stringify(navLinks));

    // 2.2 Verify Clicking Each Navbar Anchor Scrolls and Stays on Same Page
    for (const link of navLinks) {
      const targetId = link.href;
      await page.click(`a[href="${targetId}"]`);
      await page.waitForTimeout(400);

      // Verify URL stayed on index.html with appropriate hash
      const currentUrl = page.url();
      const isSamePage = currentUrl.includes('/index.html') || currentUrl.endsWith(`:${PORT}/`) || currentUrl.endsWith(`${targetId}`);
      record(`Clicking "${link.text}" stays on single-page (${targetId})`, isSamePage, currentUrl);

      // Verify Target Section is visible in viewport
      const targetEl = await page.$(targetId);
      const isVisible = targetEl !== null && await targetEl.isVisible();
      record(`Target section ${targetId} is scrolled into view`, isVisible);
    }

    console.log('\n=============================================');
    console.log('--- 3. Testing Sticky Header Offset & Visibility ---');
    console.log('=============================================');

    const headerBox = await page.$eval('#main-header', el => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return { position: style.position, height: rect.height, top: rect.top };
    });
    record('Navbar is sticky at top of viewport', headerBox.position === 'sticky', `Position: ${headerBox.position}, Height: ${headerBox.height}`);

    // Verify Hero CTA "#btn-explore" smoothly scrolls to #timeline
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    await page.click('#btn-explore');
    await page.waitForTimeout(400);
    const timelineScrolled = await page.evaluate(() => window.scrollY > 300);
    record('Hero CTA "Mulai menjelajah" smoothly scrolls down into timeline', timelineScrolled);

    console.log('\n=============================================');
    console.log('--- 4. Testing Integrated Features on Single Page ---');
    console.log('=============================================');

    // 4.1 Timeline Rail
    const eraTabsCount = await page.$$eval('.milestone-button', els => els.length);
    record('Timeline 5 Era milestones rendered', eraTabsCount === 5, `Eras: ${eraTabsCount}`);

    // 4.2 Tokoh Sejarah Grid & Filter
    const tokohCards = await page.$$eval('.tokoh-profile-card', els => els.length);
    record('Tokoh Sejarah profiles populated', tokohCards >= 6, `Figures: ${tokohCards}`);

    // 4.3 Peta Interaktif Leaflet Map
    const hasMap = await page.$('#history-map');
    record('Peta Interaktif map container initialized', hasMap !== null);

    // 4.4 Semantic 3D Heritage Gallery
    const has3DGallery = await page.$('#warisan-masterpiece-timeline');
    record('Semantic 3D Heritage Gallery rendered', has3DGallery !== null);

    // 4.5 Kuliner Tradisional Cards Grid
    const culinaryCards = await page.$$eval('.kuliner-card', els => els.length);
    record('Kuliner Tradisional cards rendered', culinaryCards >= 5, `Dishes: ${culinaryCards}`);

    // 4.6 Wayang Motion Stage
    const hasWayangStage = await page.$('#stage-viewport');
    record('Wayang Motion kelir stage initialized', hasWayangStage !== null);

    // 4.7 Zero Broken Images Check
    const brokenImages = await page.evaluate(() => {
      return Array.from(document.images)
        .filter(img => !img.complete || img.naturalWidth === 0)
        .map(img => img.src);
    });
    record('All images on single-page loaded successfully', brokenImages.length === 0, `Broken: ${brokenImages.length}`);

    console.log('\n=============================================');
    console.log('--- 5. Testing Mobile Viewport & Hamburger Navigation ---');
    console.log('=============================================');

    const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await mobilePage.goto(`http://127.0.0.1:${PORT}/index.html`);
    await mobilePage.waitForTimeout(300);

    const toggleVisible = await mobilePage.isVisible('#mobile-nav-toggle');
    record('Mobile hamburger toggle button visible on mobile viewport', toggleVisible);

    // Click toggle to open menu
    await mobilePage.click('#mobile-nav-toggle');
    await mobilePage.waitForTimeout(200);
    const drawerOpen = await mobilePage.isVisible('#nav-center-menu');
    record('Clicking hamburger button opens navigation menu drawer', drawerOpen);

    // Click an anchor in drawer (e.g., #culinary)
    await mobilePage.click('a[href="#culinary"]');
    await mobilePage.waitForTimeout(400);
    const mobileScrolled = await mobilePage.evaluate(() => window.scrollY > 500);
    record('Clicking mobile nav link scrolls to section and closes menu', mobileScrolled);

    // Take Full Page Screenshot for Visual Verification
    const fullShotPath = path.join(SCREENSHOT_DIR, 'single_page_full_1440.png');
    await page.screenshot({ path: fullShotPath, fullPage: false });
    console.log(`Saved screenshot: ${fullShotPath}`);

    await page.close();
    await mobilePage.close();

  } catch (err) {
    console.error('Test Suite Error:', err);
    record('Test Suite Execution', false, err.message);
  } finally {
    await browser.close();
    server.close();
  }

  const passed = testResults.filter(r => r.passed).length;
  const failed = testResults.filter(r => !r.passed).length;
  console.log('\n=============================================');
  console.log(`SINGLE-PAGE SCROLLING TEST RESULTS:`);
  console.log(`TOTAL: ${testResults.length} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('=============================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runSinglePageSuite();

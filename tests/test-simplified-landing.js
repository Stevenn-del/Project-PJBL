const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3800;
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

async function runTestSuite() {
  await new Promise(resolve => server.listen(PORT, '127.0.0.1', resolve));
  console.log(`Simplified Viewport Test Server listening at http://127.0.0.1:${PORT}`);

  const browser = await chromium.launch({ headless: true });

  try {
    console.log('\n============================================================');
    console.log('--- 1. Testing Elimination of Scrolling Layout & Section Containers ---');
    console.log('============================================================');

    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.goto(`http://127.0.0.1:${PORT}/index.html`);
    await page.waitForTimeout(400);

    // 1.1 Page title & Zero JS runtime errors
    const title = await page.title();
    record('Index page loaded with correct brand title', title.includes('Karsa Potret'), title);
    record('Zero JavaScript console errors on main screen', errors.length === 0, `Errors: ${errors.length}`);

    // 1.2 Verify All Non-Hero Content Sections are completely REMOVED from DOM (not just hidden with CSS)
    const deletedSectionIds = [
      'timeline',
      'timeline-rail',
      'tokoh',
      'destinations',
      'peta',
      'heritage',
      'warisan-budaya',
      'culinary',
      'koleksi-kuliner',
      'wayang-motion',
      'site-footer',
      'tokoh-modal',
      'warisan-modal',
      'history-modal',
      'kuliner-modal-backdrop',
      'guide-modal'
    ];

    for (const id of deletedSectionIds) {
      const el = await page.$(`#${id}`);
      record(`Section/Container #${id} removed from DOM`, el === null);
    }

    // 1.3 Total sections on index.html: exactly 0 or 1 (.hero-section / #hero-section only)
    const extraSectionsCount = await page.$$eval('section', els => els.length);
    record('Zero extra <section> elements below primary view', extraSectionsCount === 0, `Count: ${extraSectionsCount}`);

    console.log('\n============================================================');
    console.log('--- 2. Testing Preservation of Essential Main Screen Elements ---');
    console.log('============================================================');

    // 2.1 Hero Viewport Container Exists
    const hasHero = await page.$('#hero-section');
    record('Primary hero viewport (#hero-section) is present', hasHero !== null);

    // 2.2 3-Slide Hero Slideshow
    const slidesCount = await page.$$eval('.hero-slide', els => els.length);
    record('3-Image automatic slideshow preserved', slidesCount === 3, `Slides: ${slidesCount}`);

    // 2.3 Brand Logo
    const logoImg = await page.$('.brand-logo-img');
    record('Brand logo image preserved', logoImg !== null);

    // 2.4 Cultural Provenance Tag
    const tagText = await page.$eval('.hero-provenance-tag', el => el.textContent.trim());
    record('Cultural provenance tag preserved', tagText.includes('Jejak Peradaban Jawa Dwipa'), tagText);

    // 2.5 Hero Heading & Description
    const headingText = await page.$eval('.hero-heading', el => el.textContent.trim());
    record('Hero heading preserved', headingText.includes('JEJAK SEJARAH') && headingText.includes('JAWA TENGAH'));

    const descText = await page.$eval('.hero-description', el => el.textContent.trim());
    record('Hero description text preserved', descText.includes('Karsa Potret'));

    // 2.6 Primary Exploration CTA Button
    const exploreBtn = await page.$('#btn-explore');
    record('Primary exploration CTA button preserved', exploreBtn !== null);

    console.log('\n============================================================');
    console.log('--- 3. Testing Navbar & Elimination of Broken/Anchor Links ---');
    console.log('============================================================');

    // 3.1 Verify NO navigation link points to deleted anchor sections (#timeline, #tokoh, etc.)
    const allLinks = await page.$$eval('a', els => els.map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') })));
    const deletedAnchorLinks = allLinks.filter(l => l.href && l.href.startsWith('#') && l.href !== '#');
    record('Zero navigation links point to deleted section anchors', deletedAnchorLinks.length === 0, JSON.stringify(deletedAnchorLinks));

    // 3.2 Verify every navigation item has a valid, existing destination
    const navLinks = await page.$$eval('.nav-links-list .nav-item-link, #btn-wayang-motion, #btn-explore', els => {
      return els.map(el => ({ text: el.textContent.trim(), href: el.getAttribute('href') }));
    });

    for (const link of navLinks) {
      const targetFilePath = path.join(ROOT_DIR, link.href);
      const existsOnDisk = fs.existsSync(targetFilePath);
      record(`Link "${link.text}" -> "${link.href}" exists on disk`, existsOnDisk);
    }

    console.log('\n============================================================');
    console.log('--- 4. Testing Viewport Fit & Elimination of Vertical Scroll ---');
    console.log('============================================================');

    const viewports = [
      { width: 1920, height: 1080, name: '1080p Desktop' },
      { width: 1440, height: 900, name: 'MacBook / 1440p' },
      { width: 1366, height: 768, name: '1366x768 Standard Laptop' },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(300);

      const metrics = await page.evaluate(() => {
        return {
          windowHeight: window.innerHeight,
          windowWidth: window.innerWidth,
          scrollHeight: document.documentElement.scrollHeight,
          scrollWidth: document.documentElement.scrollWidth,
          bodyScrollHeight: document.body.scrollHeight,
          scrollY: window.scrollY
        };
      });

      // On standard viewports, page should fit without vertical scroll
      const fitsVertically = metrics.scrollHeight <= metrics.windowHeight + 2;
      record(`[${vp.name}] Main screen fits within viewport height without scroll`, fitsVertically, `Window: ${metrics.windowHeight}px, ScrollHeight: ${metrics.scrollHeight}px`);

      // No horizontal overflow
      const noHorizontalOverflow = metrics.scrollWidth <= metrics.windowWidth;
      record(`[${vp.name}] Zero unwanted horizontal scroll or overflow`, noHorizontalOverflow, `Window: ${metrics.windowWidth}px, ScrollWidth: ${metrics.scrollWidth}px`);

      // Screenshot for visual verification
      const shotPath = path.join(SCREENSHOT_DIR, `simplified_${vp.width}x${vp.height}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });
    }

    console.log('\n============================================================');
    console.log('--- 5. Testing Mobile Viewport & Navigation Drawer ---');
    console.log('============================================================');

    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(300);

    const mobileToggleVisible = await page.isVisible('#mobile-nav-toggle');
    record('Mobile hamburger toggle button is visible on mobile viewport', mobileToggleVisible);

    const mobileMetrics = await page.evaluate(() => {
      return {
        windowWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth
      };
    });
    record('Zero horizontal overflow on mobile viewport', mobileMetrics.scrollWidth <= mobileMetrics.windowWidth);

    // Click toggle to open drawer
    await page.click('#mobile-nav-toggle');
    await page.waitForTimeout(200);
    const drawerOpen = await page.isVisible('#nav-center-menu');
    record('Clicking hamburger toggle opens navigation drawer', drawerOpen);

    // Click toggle again to close
    await page.click('#mobile-nav-toggle');
    await page.waitForTimeout(200);
    const drawerClosed = !(await page.$eval('#nav-center-menu', el => el.classList.contains('show')));
    record('Clicking toggle again closes navigation drawer', drawerClosed);

    // Save mobile screenshot
    const mobileShot = path.join(SCREENSHOT_DIR, 'simplified_375x812_mobile.png');
    await page.screenshot({ path: mobileShot, fullPage: false });

    await page.close();

    console.log('\n============================================================');
    console.log('--- 6. Testing Preserved Dedicated Pages Independence ---');
    console.log('============================================================');

    const preservedPages = ['timeline.html', 'tokoh.html', 'peta.html', 'warisan-budaya.html', 'kuliner.html', 'wayang-motion.html'];
    for (const pageName of preservedPages) {
      const p = await browser.newPage();
      const pageErrors = [];
      p.on('pageerror', err => pageErrors.push(err.message));

      const response = await p.goto(`http://127.0.0.1:${PORT}/${pageName}`);
      record(`Preserved page "${pageName}" responds HTTP 200`, response.status() === 200, `Status: ${response.status()}`);
      record(`Preserved page "${pageName}" loads with zero console errors`, pageErrors.length === 0, `Errors: ${pageErrors.length}`);
      await p.close();
    }

  } catch (err) {
    console.error('Test Suite Exception:', err);
    record('Test Suite Execution', false, err.message);
  } finally {
    await browser.close();
    server.close();
  }

  const passed = testResults.filter(r => r.passed).length;
  const failed = testResults.filter(r => !r.passed).length;
  console.log('\n============================================================');
  console.log(`SIMPLIFIED LANDING TEST RESULTS:`);
  console.log(`TOTAL CHECKS: ${testResults.length} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite();

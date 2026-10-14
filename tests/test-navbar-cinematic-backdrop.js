const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PORT = 4200;
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
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function createStaticServer() {
  return http.createServer((req, res) => {
    try {
      let reqPath = decodeURI(req.url.split('?')[0]);
      if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
      const safePath = path.normalize(path.join(ROOT_DIR, reqPath));
      if (!safePath.startsWith(ROOT_DIR)) {
        res.writeHead(403);
        return res.end('Access denied');
      }
      if (fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
        const ext = path.extname(safePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        fs.createReadStream(safePath).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`404 Not Found: ${reqPath}`);
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server error: ' + err.message);
    }
  });
}

async function runVerification() {
  const server = createStaticServer();
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
  console.log(`Verification Server active at http://127.0.0.1:${PORT}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const screenshotsDir = path.join(ROOT_DIR, 'test_screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  let totalChecks = 0;
  let passedChecks = 0;

  function assert(condition, message) {
    totalChecks++;
    if (condition) {
      passedChecks++;
      console.log(`[PASS] ${message}`);
    } else {
      console.error(`[FAIL] ${message}`);
    }
  }

  const pagesToTest = [
    { file: 'index.html', title: 'Beranda', activeKey: 'Beranda', isHome: true },
    { file: 'timeline.html', title: 'Timeline', activeKey: 'Timeline', isHome: false },
    { file: 'tokoh.html', title: 'Tokoh', activeKey: 'Tokoh', isHome: false },
    { file: 'peta.html', title: 'Peta', activeKey: 'Peta', isHome: false },
    { file: 'warisan-budaya.html', title: 'Warisan Budaya', activeKey: 'Warisan Budaya', isHome: false },
    { file: 'kuliner.html', title: 'Kuliner', activeKey: 'Kuliner', isHome: false },
    { file: 'wayang-motion.html', title: 'Wayang Motion', activeKey: 'Wayang Motion', isHome: false }
  ];

  console.log('\n============================================================');
  console.log('--- 1. Testing Unified Navbar & Backdrop Across All Pages ---');
  console.log('============================================================');

  for (const p of pagesToTest) {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto(`http://127.0.0.1:${PORT}/${p.file}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    assert(consoleErrors.length === 0, `Page "${p.file}" loads with zero console errors (Errors: ${consoleErrors.length})`);

    // Brand logo
    const brandLogo = await page.$('.brand-wrapper img.brand-logo-img');
    assert(brandLogo !== null, `Page "${p.file}" has brand logo on the left`);

    // Nav center wrapper with capsule list
    const navLinksList = await page.$('.nav-links-list');
    assert(navLinksList !== null, `Page "${p.file}" has centered capsule navigation links`);

    // Active item
    if (p.activeKey !== 'Wayang Motion') {
      const activeLinkText = await page.$eval('.nav-links-list .nav-item-link.active', el => el.textContent.trim()).catch(() => null);
      assert(activeLinkText === p.activeKey, `Page "${p.file}" correctly marks "${p.activeKey}" as active`);
    } else {
      const activeBtn = await page.$('#btn-wayang-motion.active, #btn-wayang-motion');
      assert(activeBtn !== null, `Page "${p.file}" highlights Wayang Motion button`);
    }

    // Wayang Motion button on right
    const wayangBtn = await page.$('#btn-wayang-motion');
    assert(wayangBtn !== null, `Page "${p.file}" has Wayang Motion action button on the right`);

    // Backdrop test
    const backdropEl = await page.$('.cinematic-backdrop-fixed');
    if (p.isHome) {
      assert(backdropEl === null, `Home page ("${p.file}") does NOT use static backdrop (preserves 3-slide hero)`);
      const slides = await page.$$('.hero-slide');
      assert(slides.length === 3, `Home page preserves 3-image automatic slideshow (count: ${slides.length})`);
    } else {
      assert(backdropEl !== null, `Non-Home page ("${p.file}") has .cinematic-backdrop-fixed`);
      const backdropImg = await page.$eval('.cinematic-backdrop-img', el => {
        const bg = window.getComputedStyle(el).backgroundImage;
        return bg;
      }).catch(() => '');
      assert(backdropImg.includes('slide-1-prambanan.webp'), `Page "${p.file}" shared backdrop reuses Home Prambanan image (url: ${backdropImg})`);

      const backdropScrim = await page.$('.cinematic-backdrop-scrim');
      assert(backdropScrim !== null, `Page "${p.file}" has translucent dark burgundy scrim layer`);
    }

    // Capture desktop screenshot
    const screenshotPath = path.join(screenshotsDir, `desktop_${p.file.replace('.html', '')}_1440x900.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`  -> Captured desktop screenshot: ${screenshotPath}`);
  }

  console.log('\n============================================================');
  console.log('--- 2. Testing Mobile Navbar Drawer & Responsiveness ---');
  console.log('============================================================');

  const mobileContext = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  const mobilePage = await mobileContext.newPage();

  for (const p of pagesToTest) {
    await mobilePage.goto(`http://127.0.0.1:${PORT}/${p.file}`, { waitUntil: 'domcontentloaded' });
    await mobilePage.waitForTimeout(200);

    const toggleBtn = await mobilePage.$('#mobile-nav-toggle');
    assert(toggleBtn !== null, `Mobile page "${p.file}" has #mobile-nav-toggle visible`);

    // Check clicking toggle opens drawer
    await toggleBtn.click();
    await mobilePage.waitForTimeout(150);
    const isOpen = await mobilePage.$eval('#nav-center-menu', el => el.classList.contains('show'));
    assert(isOpen, `Clicking toggle on "${p.file}" opens mobile nav drawer`);

    // Capture mobile open screenshot
    const mobileScreenshot = path.join(screenshotsDir, `mobile_${p.file.replace('.html', '')}_drawer.png`);
    await mobilePage.screenshot({ path: mobileScreenshot });

    // Click toggle again to close
    await toggleBtn.click();
    await mobilePage.waitForTimeout(150);
    const isClosed = await mobilePage.$eval('#nav-center-menu', el => !el.classList.contains('show'));
    assert(isClosed, `Clicking toggle again on "${p.file}" closes mobile nav drawer`);
  }

  await mobileContext.close();
  await context.close();
  await browser.close();
  server.close();

  console.log('\n============================================================');
  console.log(`VERIFICATION SUMMARY: TOTAL ${totalChecks} | PASSED: ${passedChecks} | FAILED: ${totalChecks - passedChecks}`);
  console.log('============================================================');

  if (passedChecks === totalChecks) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runVerification().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});

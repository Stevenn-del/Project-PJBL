const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PORT = 4850;
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
  '.svg': 'image/svg+xml'
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

async function run() {
  await new Promise(r => server.listen(PORT, '127.0.0.1', r));
  console.log(`Server listening on http://127.0.0.1:${PORT}`);

  const browser = await chromium.launch({ headless: true });
  
  // 1. Desktop Test
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  console.log('Navigating to timeline.html...');
  await page.goto(`http://127.0.0.1:${PORT}/timeline.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);

  // Capture Initial Desktop 3D Gallery View
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'redesigned_timeline_desktop_1440.png') });
  console.log('Captured initial desktop screenshot.');

  // Check 3D Panels Rendered
  const panelCount = await page.$$eval('.timeline-slab', els => els.length);
  console.log(`Total 3D panels rendered: ${panelCount}`);

  // Test Next Navigation Button
  await page.click('#btn-stage-next');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'redesigned_timeline_next_era.png') });
  console.log('Captured next era screenshot.');

  // Test Open Detail Modal
  await page.click('#btn-open-era-detail');
  await page.waitForSelector('#timeline-detail-modal.is-open');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'redesigned_timeline_modal.png') });
  console.log('Captured chronicle detail modal screenshot.');

  // Close Detail Modal
  await page.click('#btn-close-timeline-modal');
  await page.waitForTimeout(400);

  // Test Open Overview Drawer
  await page.click('#btn-dock-overview');
  await page.waitForSelector('#timeline-overview-drawer.is-open');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'redesigned_timeline_drawer.png') });
  console.log('Captured overview drawer screenshot.');

  // Close desktop page to avoid socket concurrency
  await page.close();

  // 2. Mobile Viewport Test (375x812)
  const mobileContext = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  const mobilePage = await mobileContext.newPage();
  console.log('Navigating to mobile view...');
  await mobilePage.goto(`http://127.0.0.1:${PORT}/timeline.html`, { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: path.join(SCREENSHOT_DIR, 'redesigned_timeline_mobile_375.png') });
  console.log('Captured mobile screenshot.');

  await mobileContext.close();
  await browser.close();
  server.close();

  console.log('\n=============================================');
  console.log(`CONSOLE ERRORS: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.log(consoleErrors);
  }
  console.log('ALL SCREENSHOTS CREATED SUCCESSFULLY!');
  console.log('=============================================');
}

run().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

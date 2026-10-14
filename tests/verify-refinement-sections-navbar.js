const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PORT = 4600;
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
  console.log(`Verification server active on http://127.0.0.1:${PORT}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const results = [];
  function assert(name, condition, extra = '') {
    results.push({ name, passed: !!condition, extra });
    console.log(`${condition ? '[PASS]' : '[FAIL]'} ${name} ${extra ? `(${extra})` : ''}`);
  }

  const pages = [
    { file: 'index.html', title: 'Beranda', hasPageIntro: false },
    { file: 'timeline.html', title: 'Timeline', hasPageIntro: true },
    { file: 'tokoh.html', title: 'Tokoh', hasPageIntro: true },
    { file: 'peta.html', title: 'Peta', hasPageIntro: true },
    { file: 'warisan-budaya.html', title: 'Warisan Budaya', hasPageIntro: true },
    { file: 'kuliner.html', title: 'Kuliner', hasPageIntro: true },
    { file: 'wayang-motion.html', title: 'Wayang Motion', hasPageIntro: false }
  ];

  for (const p of pages) {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto(`http://127.0.0.1:${PORT}/${p.file}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(200);

    // 1. Transparent Navbar Check
    const headerBg = await page.$eval('#main-header', el => window.getComputedStyle(el).backgroundColor);
    const isTransparent = headerBg === 'rgba(0, 0, 0, 0)' || headerBg === 'transparent';
    assert(`${p.file}: Navbar header background is transparent`, isTransparent, `bg: ${headerBg}`);

    const headerBorderBottom = await page.$eval('#main-header', el => window.getComputedStyle(el).borderBottomColor);
    const headerBorderWidth = await page.$eval('#main-header', el => window.getComputedStyle(el).borderBottomWidth);
    assert(`${p.file}: Navbar header has no solid bottom border line`, headerBorderWidth === '0px' || headerBorderBottom === 'rgba(0, 0, 0, 0)', `border: ${headerBorderWidth} ${headerBorderBottom}`);

    // 2. Navigation Capsule Check
    const capsule = await page.$('.nav-links-list');
    assert(`${p.file}: Navigation capsule is visible and mounted`, capsule !== null);

    // 3. Feature Intro Check
    if (p.hasPageIntro) {
      const pageIntro = await page.$('.page-intro');
      assert(`${p.file}: Has short feature introduction (.page-intro)`, pageIntro !== null);

      const eyebrow = await page.$('.page-intro .provenance-badge');
      assert(`${p.file}: Feature intro has decorative eyebrow label`, eyebrow !== null);

      const heading = await page.$('.page-intro .page-hero-title, .page-intro h1');
      assert(`${p.file}: Feature intro has clear elegant heading`, heading !== null);

      const lead = await page.$('.page-intro .page-hero-lead, .page-intro p');
      assert(`${p.file}: Feature intro has descriptive lead paragraph`, lead !== null);
    }

    // Capture desktop screenshot
    const shotPath = path.join(SCREENSHOT_DIR, `refined_${p.file.replace('.html', '')}_desktop.png`);
    await page.screenshot({ path: shotPath });
  }

  // 4. Timeline Specific Removals Check
  await page.goto(`http://127.0.0.1:${PORT}/timeline.html`, { waitUntil: 'domcontentloaded' });
  const heroExists = await page.$('.timeline-hero, #intro-section');
  assert('timeline.html: Photographic timeline hero removed', heroExists === null);

  const highlightsExists = await page.$('.timeline-highlights-section, #highlights-section');
  assert('timeline.html: Pusaka Pilihan Era section removed', highlightsExists === null);

  const tokohExists = await page.$('.timeline-tokoh-section, #tokoh');
  assert('timeline.html: Tokoh card grid section removed', tokohExists === null);

  const stageExists = await page.$('#chapter-stage, #stage-content-card');
  assert('timeline.html: Main interactive timeline stage preserved', stageExists !== null);

  const railExists = await page.$('#timeline-rail');
  assert('timeline.html: Timeline era milestone rail preserved', railExists !== null);

  await browser.close();
  server.close();

  console.log('\n============================================================');
  const passedCount = results.filter(r => r.passed).length;
  console.log(`TOTAL CHECKS: ${results.length} | PASSED: ${passedCount} | FAILED: ${results.length - passedCount}`);
  console.log('============================================================');
}

run().catch(console.error);

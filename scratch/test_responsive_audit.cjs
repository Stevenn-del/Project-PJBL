const fs = require('fs');
const path = require('path');

const root = 'c:\\Users\\unive\\Documents\\Project\\Project-PJBL';
const htmlFiles = ['index.html', 'timeline.html', 'tokoh.html', 'peta.html', 'warisan-budaya.html', 'wayang-motion.html'];
const cssFiles = ['style.css', 'timeline.css', 'tokoh.css', 'peta.css', 'warisan.css', 'wayang-motion.css', 'redesign-palette.css'];

console.log('=== KARSAKALA RESPONSIVE AUDIT ===\n');

// 1. Audit HTML files
htmlFiles.forEach(f => {
  const content = fs.readFileSync(path.join(root, f), 'utf8');
  console.log(`Checking ${f}:`);
  const hasViewport = /<meta\s+name=["']viewport["']\s+content=["'][^"']*width=device-width[^"']*["']/i.test(content);
  console.log(`  - Viewport meta tag: ${hasViewport ? 'OK' : 'MISSING!'}`);
  const hasNavToggle = content.includes('mobile-nav-toggle');
  console.log(`  - Mobile nav toggle present: ${hasNavToggle ? 'OK' : 'MISSING!'}`);
  const hasNavDrawer = content.includes('nav-center-wrapper');
  console.log(`  - Nav drawer present: ${hasNavDrawer ? 'OK' : 'MISSING!'}`);
});

console.log('\n2. Audit CSS media queries & rules:');
cssFiles.forEach(f => {
  const content = fs.readFileSync(path.join(root, 'css', f), 'utf8');
  const mediaQueries = content.match(/@media[^{]+/g) || [];
  console.log(`\n${f} (${mediaQueries.length} media queries):`);
  mediaQueries.forEach(mq => console.log(`   ${mq.trim()}`));
});

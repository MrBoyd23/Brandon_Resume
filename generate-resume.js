/**
 * generate-resume.js
 *
 * Generates public/Brandon_Boyd_Resume.pdf using Puppeteer.
 * Run manually:  node generate-resume.js
 * Auto-runs via: npm run build  (prebuild hook in package.json)
 */

const puppeteer = require('puppeteer');
const path      = require('path');
const fs        = require('fs');
const { buildResumeHTML } = require('./resume-builder');

const outPath = path.join(__dirname, 'public', 'Brandon_Boyd_Resume.pdf');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();

  console.log('Rendering resume HTML...');
  await page.setContent(buildResumeHTML(), { waitUntil: 'networkidle0' });

  console.log('Generating PDF...');
  const pdf = await page.pdf({
    format: 'Letter',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });

  await browser.close();

  fs.writeFileSync(outPath, pdf);
  console.log('Resume saved to ' + outPath);
})();

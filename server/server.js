/**
 * server/server.js — Express backend
 *
 * Endpoints:
 *   GET  /api/resume  — generates and streams a fresh Brandon_Boyd_Resume.pdf
 *   POST /api/contact — handles the contact form submission
 *
 * Run with: node server/server.js  (or: npm run server from the project root)
 *
 * Requires a .env file at the project root with:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_RECIPIENT
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const express    = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const puppeteer  = require('puppeteer');
const crypto     = require('crypto');
const Database   = require('better-sqlite3');
const path       = require('path');
const { buildResumeHTML } = require('../resume-builder');

const app  = express();
const port = process.env.SERVER_PORT || 5000;

const DT_URL = process.env.DATATRACKER_URL;
const DT_TOKEN = process.env.DATATRACKER_TOKEN;

function reportError(site, message, opts = {}) {
  if (!DT_URL || !DT_TOKEN) return;
  fetch(DT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${DT_TOKEN}` },
    body: JSON.stringify({ site, level: "error", message, ...opts }),
  }).catch(() => {});
}

if (DT_URL && DT_TOKEN) {
  const hbUrl = DT_URL.replace(/\/ingest$/, "/heartbeat");
  setInterval(() => {
    fetch(hbUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${DT_TOKEN}` },
      body: JSON.stringify({ site: "resume" }),
    }).catch(() => {});
  }, 300000);
}

// ── QR tracking database ───────────────────────────────────────
const QR_IP_SALT = process.env.QR_IP_SALT || 'dev-salt-change-me';
const db = new Database(path.resolve(__dirname, 'qr.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS qr_target (
    slug        TEXT PRIMARY KEY,
    destination TEXT NOT NULL,
    label       TEXT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS qr_scan (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    slug        TEXT    NOT NULL,
    scanned_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    ip_hash     TEXT,
    user_agent  TEXT,
    referer     TEXT,
    is_bot      INTEGER NOT NULL DEFAULT 0,
    country     TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_qr_scan_slug ON qr_scan(slug);
  CREATE INDEX IF NOT EXISTS idx_qr_scan_time ON qr_scan(scanned_at);
`);

const seedTarget = db.prepare(
  'INSERT OR IGNORE INTO qr_target (slug, destination, label) VALUES (?, ?, ?)'
);
seedTarget.run('linkedin', 'https://www.linkedin.com/in/brandonaboyd/', 'LinkedIn profile');
seedTarget.run('card', 'https://resume.brandonaboyd.com/', 'Business card');

const targetLookup = db.prepare('SELECT destination FROM qr_target WHERE slug = ?');
const scanInsert = db.prepare(
  'INSERT INTO qr_scan (slug, ip_hash, user_agent, referer, is_bot, country) VALUES (?, ?, ?, ?, ?, ?)'
);

const BOT_MARKERS = /bot|crawl|spider|slurp|wget|curl|python|java|go-http|httpclient|fetch|headless|phantom|puppeteer|lighthouse|pagespeed|pingdom|uptimerobot|slackbot|discordbot|facebookexternalhit|twitterbot|whatsapp|linkedinbot|telegrambot|preview/i;

function hashIP(ip) {
  if (!ip) return null;
  return crypto.createHash('sha256').update(ip + QR_IP_SALT).digest('hex').slice(0, 16);
}

// ── Middleware ──────────────────────────────────────────────────
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ── GET /api/resume ─────────────────────────────────────────────
// Renders the resume HTML via Puppeteer and streams back a styled PDF.
app.get('/api/resume', async (req, res) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
    const page = await browser.newPage();
    await page.setContent(buildResumeHTML(), { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
    await browser.close();
    res.set({
      'Content-Type':        'application/pdf',
      'Content-Disposition': 'attachment; filename="Brandon_Boyd_Resume.pdf"',
      'Content-Length':      pdf.length,
      'Cache-Control':       'no-store',
    });
    res.send(pdf);
    console.log('Resume PDF generated and sent —', new Date().toISOString());
  } catch (err) {
    if (browser) await browser.close().catch(() => {});
    console.error('Resume generation failed:', err);
    reportError("resume", err.message, {
      error_type: err.name, traceback: err.stack,
      context: { endpoint: "/api/resume", method: "GET" },
    });
    res.status(500).json({ error: 'Failed to generate resume.' });
  }
});

// ── POST /api/contact ───────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, subject, message, inquiryType } = req.body;

  const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   Number(process.env.SMTP_PORT) || 465,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from:    `"Contact Form" <${process.env.SMTP_USER}>`,
    to:      process.env.CONTACT_RECIPIENT,
    subject: `New ${inquiryType} Inquiry from ${name}`,
    text:    `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\n\nMessage:\n${message}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent:', info.messageId);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    reportError("resume", error.message, {
      error_type: error.name, traceback: error.stack,
      context: { endpoint: "/api/contact", method: "POST" },
    });
    res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
});

// ── GET /q/:slug — QR code redirect with scan logging ───────────
app.get('/q/:slug', (req, res) => {
  const { slug } = req.params;
  const row = targetLookup.get(slug);

  if (!row) {
    res.status(404).json({ error: 'Unknown QR code' });
    return;
  }

  try {
    const rawIP = req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] || req.ip;
    const ua = (req.headers['user-agent'] || '').slice(0, 512);
    const ref = (req.headers['referer'] || '').slice(0, 512);
    const country = req.headers['cf-ipcountry'] || null;
    const isBot = BOT_MARKERS.test(ua) ? 1 : 0;
    scanInsert.run(slug, hashIP(rawIP), ua, ref, isBot, country);
  } catch (err) {
    console.error('QR scan log failed:', err.message);
    reportError('resume', err.message, {
      error_type: err.name, traceback: err.stack,
      context: { endpoint: `/q/${slug}`, method: 'GET' },
    });
  }

  res.set('Cache-Control', 'no-store');
  res.redirect(302, row.destination);
});

// ── GET /api/qr/stats — scan analytics summary ─────────────────
app.get('/api/qr/stats', (req, res) => {
  try {
    const targets = db.prepare(
      'SELECT slug, destination, label, created_at FROM qr_target'
    ).all();
    const summary = db.prepare(`
      SELECT slug,
             COUNT(*) AS total_scans,
             SUM(CASE WHEN is_bot = 0 THEN 1 ELSE 0 END) AS human_scans,
             SUM(CASE WHEN is_bot = 1 THEN 1 ELSE 0 END) AS bot_scans,
             MAX(scanned_at) AS last_scan
      FROM qr_scan GROUP BY slug
    `).all();
    res.json({ targets, summary });
  } catch (err) {
    console.error('QR stats query failed:', err.message);
    reportError('resume', err.message, {
      error_type: err.name, traceback: err.stack,
      context: { endpoint: '/api/qr/stats', method: 'GET' },
    });
    res.status(500).json({ error: 'Failed to fetch QR stats' });
  }
});

// ── Global error handler ────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  reportError("resume", err.message, {
    error_type: err.name, traceback: err.stack,
    context: { endpoint: req.path, method: req.method, ip: req.ip },
  });
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start ───────────────────────────────────────────────────────
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

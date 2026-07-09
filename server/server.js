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

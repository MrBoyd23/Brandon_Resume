import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';
import useDocTitle from '../../hooks/useDocTitle';

const contactFormCode = `// Express — Contact form endpoint with Nodemailer
// Validates input, sends email, and reports errors to DataTracker

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
    from:    \`"Contact Form" <\${process.env.SMTP_USER}>\`,
    to:      process.env.CONTACT_RECIPIENT,
    subject: \`New \${inquiryType} Inquiry from \${name}\`,
    text:    \`Name: \${name}\\nEmail: \${email}\\nPhone: \${phone}\\n\\nMessage:\\n\${message}\`,
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
    res.status(500).json({ error: 'Failed to send email.' });
  }
});`;

const pdfGenerationCode = `// Express — On-demand PDF resume generation via Puppeteer
// Renders HTML resume template, converts to PDF, streams to client

app.get('/api/resume', async (req, res) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox',
             '--disable-dev-shm-usage'],
    });
    const page = await browser.newPage();
    await page.setContent(buildResumeHTML(), {
      waitUntil: 'networkidle0'
    });

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
  } catch (err) {
    if (browser) await browser.close().catch(() => {});
    reportError("resume", err.message, {
      error_type: err.name, traceback: err.stack,
      context: { endpoint: "/api/resume", method: "GET" },
    });
    res.status(500).json({ error: 'Failed to generate resume.' });
  }
});`;

const errorHandlingCode = `// Express — Global error middleware with DataTracker reporting
// Catches unhandled errors from all routes and reports them

const DT_URL = process.env.DATATRACKER_URL;
const DT_TOKEN = process.env.DATATRACKER_TOKEN;

function reportError(site, message, opts = {}) {
  if (!DT_URL || !DT_TOKEN) return;
  fetch(DT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": \`Bearer \${DT_TOKEN}\`
    },
    body: JSON.stringify({
      site, level: "error", message, ...opts
    }),
  }).catch(() => {});
}

// Global error handler — must be registered after all routes
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  reportError("resume", err.message, {
    error_type: err.name,
    traceback: err.stack,
    context: {
      endpoint: req.path,
      method: req.method,
      ip: req.ip,
    },
  });
  res.status(500).json({ error: 'Internal server error' });
});`;

const Express = () => {
  useDocTitle('Express.js');
  const [activeTab, setActiveTab] = useState('contact');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Express.js</h1>
        <p className={styles.heroTagline}>Backend API framework powering contact forms, PDF generation, and service integrations</p>
        <div className={styles.heroBadges}>
          {['REST API', 'Middleware', 'Nodemailer', 'Puppeteer', 'Error Handling', 'Body Parsing'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It</h2>
          <p className={styles.sectionText}>
            Express powers the backend for this resume site and the Plex Dashboard. On this site, it handles
            two API endpoints: a contact form that sends email via Nodemailer, and an on-demand PDF resume
            generator that renders HTML through Puppeteer and streams the result as a download.
          </p>
          <p className={styles.sectionText}>
            The Plex Dashboard backend is a more complex Express application with multiple service integrations
            (TrueNAS, Tdarr, Speedtest), middleware caching layers, and an AI chat integration. Both projects
            demonstrate Express patterns I use regularly: body parsing, error middleware, environment-based
            configuration, and clean route separation.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>2</div>
              <div className={styles.statLabel}>Production Apps</div>
            </div>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>REST</div>
              <div className={styles.statLabel}>API Architecture</div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Patterns I Build With</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>Middleware stacking</strong> — Body parsing, CORS, rate limiting,
            and error handling composed as middleware layers. Global error handler catches anything the routes miss.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>Environment-driven config</strong> — SMTP credentials, API tokens,
            and service URLs loaded from <code>.env</code> at startup. Same codebase runs locally and in production.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>Error reporting</strong> — Every catch block reports to DataTracker
            with error type, stack trace, and request context. Errors are visible in the dashboard without SSH.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Always register the global error middleware <em>after</em> all routes.
            Express only invokes 4-argument middleware <code>(err, req, res, next)</code> when <code>next(err)</code>
            is called or an async handler throws.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Use Case — Resume Backend</h2>
        <p className={styles.sectionText}>
          This code is from the Express backend powering this resume site — contact form handling,
          PDF generation, and error reporting.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['contact', 'Contact form'], ['pdf', 'PDF generation'], ['errors', 'Error handling']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === key ? '#3b82f6' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
            }}>{label}</button>
          ))}
        </div>

        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>javascript — server.js</div>
          <SyntaxHighlighter language="javascript" style={vscDarkPlus} showLineNumbers>
            {activeTab === 'contact' ? contactFormCode : activeTab === 'pdf' ? pdfGenerationCode : errorHandlingCode}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default Express;

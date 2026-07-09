// src/components/skills/CodeBlock.js
// Shared code block for skill-detail pages (THALAB-718): a header bar with
// filename, language chip, and copy-to-clipboard button, above the highlighted
// source. Reusable across all skill pages.
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';

const CodeBlock = ({ filename, language, code, showLineNumbers = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable (insecure context) — silently ignore */
    }
  };

  return (
    <div className={styles.codeWrapper}>
      <div className={styles.codeHeader}>
        <span className={styles.codeDot} aria-hidden="true">●</span>
        <span className={styles.codeFile}>{filename}</span>
        {language && <span className={styles.codeLang}>{language}</span>}
        <button
          type="button"
          className={`${styles.codeCopy}${copied ? ` ${styles.codeCopied}` : ''}`}
          onClick={handleCopy}
          aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
        >
          {copied ? '✓ Copied' : '⧉ Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers={showLineNumbers}
        customStyle={{ margin: 0, fontSize: '0.82rem' }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;

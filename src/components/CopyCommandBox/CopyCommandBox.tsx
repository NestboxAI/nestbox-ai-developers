import React, { useState } from 'react';
import styles from './CopyCommandBox.module.css';

type Props = {
  command: string;
};

const CopyCommandBox: React.FC<Props> = ({ command }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={styles.container}>
      <div className={styles.languageIcon}>
        <span className={styles.tsIcon}>TS</span>
      </div>
      <code className={styles.command}>{command}</code>
      <button
        onClick={handleCopy}
        className={styles.copyButton}
        aria-label="Copy to clipboard"
        title={copied ? 'Copied!' : 'Copy'}
      >
        {copied ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={styles.copyIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={styles.copyIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default CopyCommandBox;

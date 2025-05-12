import React from 'react';
import styles from './CopyCommandBox.module.css';

type Props = {
  command: string;
};

const CopyCommandBox: React.FC<Props> = ({ command }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(command);
  };

  return (
    <div className={styles.container}>
      <span className={styles.command}>
        <span className={styles.prefix}>$</span> {command}
      </span>
      <button
        onClick={handleCopy}
        className={styles.copyButton}
        title="Copy"
        aria-label="Copy to clipboard"
      >
        📋
      </button>
    </div>
  );
};

export default CopyCommandBox;

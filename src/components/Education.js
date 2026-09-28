import React from 'react';
import styles from '../css/Education.module.css';
import aiCompetencies from '../config/aiCompetencies';
import useDocTitle from '../hooks/useDocTitle';

const Education = () => {
  useDocTitle('Education');
  return (
    <div className={styles.education}>
        <h2 className={styles.heading}>Education</h2>

        {/* ── Mesa Community College ── */}
        <div className={styles.educationItem}>
            <h3 className={styles.schoolName}>Mesa Community College</h3>
            <p className={styles.degree}>
                <span className={styles.degreeLabel}>Associates in Applied Science</span> — Administration of Justice
            </p>
            <span className={styles.year}>2006</span>

            <hr className={styles.sectionDivider} />
            <div className={styles.detailRow}>
                <p className={styles.detailLabel}>Relevant Coursework</p>
                <ul className={styles.tagsList}>
                    <li><span className={styles.tag}>CIS 126DL — Linux Operating System</span></li>
                </ul>
            </div>
        </div>

        {/* ── Mesa High School ── */}
        <div className={styles.educationItem}>
            <h3 className={styles.schoolName}>Mesa High School</h3>
            <p className={styles.degree}>
                <span className={styles.degreeLabel}>High School Diploma</span> — General Studies
            </p>
            <span className={styles.year}>2000 – 2003</span>

            <hr className={styles.sectionDivider} />
            <div className={styles.detailRow}>
                <p className={styles.detailLabel}>Activities &amp; Societies</p>
                <ul className={styles.tagsList}>
                    <li><span className={styles.tag}>Computer Technology</span></li>
                </ul>
            </div>
        </div>
    </div>
  );
};

const AiAutomation = () => (
  <div className={styles.aiSection}>
    <h2 className={styles.heading}>AI &amp; Automation</h2>
    <div className={styles.aiGrid}>
      {aiCompetencies.map(item => (
        <div key={item.title} className={styles.aiCard}>
          <h3 className={styles.aiCardTitle}>{item.title}</h3>
          <ul className={styles.aiCardList}>
            {item.bullets.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

export default Education;
export { AiAutomation };

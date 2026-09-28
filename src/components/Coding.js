import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../css/Skills.module.css';
import { codingSkills } from '../config/skillsConfig';
import preloaders from '../config/skillPreloads';

/**
 * Coding — nav bar shown above each coding skill detail page.
 * Skills driven by codingSkills in src/data/skillsConfig.js.
 */
const Coding = () => {
  const activeId = useLocation().pathname.replace(/^\//, '').split('/')[0];
  return (
    <div className={styles.skillsPage}>
      <p className={styles.centeredParagraph}>⌨ Coding &amp; Development — select a skill</p>
      <div className={styles.skillsList}>
        {codingSkills.map(({ id, label }) => (
          <Link
            key={id}
            to={`/${id}`}
            className={`${styles.skillBubble}${id === activeId ? ` ${styles.skillBubbleActive}` : ''}`}
            onMouseEnter={() => preloaders[id]?.()}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Coding;


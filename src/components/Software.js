import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../css/Skills.module.css';
import { softwareSkills } from '../config/skillsConfig';
import preloaders from '../config/skillPreloads';

/**
 * Software — nav bar shown above each software skill detail page.
 * Skills driven by softwareSkills in src/data/skillsConfig.js.
 */
const Software = () => {
  const activeId = useLocation().pathname.replace(/^\//, '').split('/')[0];
  return (
    <div className={styles.skillsPage}>
      <p className={styles.centeredParagraph}>🛠 Software &amp; Tools — select a skill</p>
      <div className={styles.skillsList}>
        {softwareSkills.map(({ id, label }) => (
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

export default Software;


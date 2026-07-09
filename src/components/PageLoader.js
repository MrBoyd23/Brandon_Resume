import React from 'react';
import styles from '../css/PageLoader.module.css';

const PageLoader = () => (
  <div className={styles.skeleton}>
    <div className={`${styles.skeletonHero} ${styles.shimmer}`} />
    <div className={`${styles.skeletonSection} ${styles.shimmer}`} />
    <div className={`${styles.skeletonSection} ${styles.shimmer}`} />
  </div>
);

export default PageLoader;

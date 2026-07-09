// src/hooks/useScrollReveal.js
// Reusable scroll-reveal hook (THALAB-710).
// Observes elements inside a container ref and adds `is-visible` as they enter
// the viewport, with a small index-based stagger. Fully respects
// prefers-reduced-motion (reveals everything immediately, no transitions) and
// degrades safely where IntersectionObserver is unavailable.
import { useEffect } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * @param {React.RefObject<HTMLElement>} containerRef - element whose descendants are revealed
 * @param {object} [options]
 * @param {string} [options.selector='[data-reveal]'] - which descendants to reveal
 * @param {number} [options.threshold=0.12] - IntersectionObserver visibility threshold
 * @param {number} [options.stagger=70] - per-item stagger in ms
 * @param {number} [options.maxStagger=420] - cap on cumulative stagger
 * @param {boolean} [options.once=true] - stop observing after first reveal
 */
export default function useScrollReveal(
  containerRef,
  { selector = '[data-reveal]', threshold = 0.12, stagger = 70, maxStagger = 420, once = true } = {}
) {
  useEffect(() => {
    const root = containerRef && containerRef.current;
    if (!root) return undefined;

    const els = Array.from(root.querySelectorAll(selector));
    if (els.length === 0) return undefined;

    root.classList.add('reveal-enabled');

    // Reduced motion or no IO support → reveal immediately, no animation.
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('is-visible'));
      return undefined;
    }

    els.forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${Math.min(i * stagger, maxStagger)}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          if (once) observer.unobserve(entry.target);
        });
      },
      { threshold }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [containerRef, selector, threshold, stagger, maxStagger, once]);
}

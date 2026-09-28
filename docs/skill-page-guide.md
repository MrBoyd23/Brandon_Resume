# Skill Page Guide

How to create a new skill detail page. All 49 existing skill pages follow this pattern.

## File Location

```
src/components/skills/<skill_id>.js
```

The `skill_id` must match the ID used in `skillsConfig.js` (lowercase, underscores for spaces).

## Page Structure

Every skill page follows this layout:

```
skillPage (wrapper)
  hero
    heroTitle        — skill name
    heroTagline      — one-line description (italic)
    heroBadges       — technology/category chips
      heroBadge      — individual chip (uppercase, outlined)
  section (repeatable)
    sectionTitle     — section heading with gold accent bar
    sectionText      — body paragraph(s)
    CodeBlock        — optional code example
  statsRow (optional)
    statBlock        — numeric highlight
      statNum        — the number
      statLabel      — label beneath
  callout (optional) — pull-quote for key statements
```

## Minimal Example

```jsx
import { useDocTitle } from '../../hooks/useDocTitle';
import CodeBlock from './CodeBlock';
import styles from '../css/SkillPage.module.css';

const exampleCode = `const greeting = "Hello, World!";
console.log(greeting);`;

export default function MySkill() {
  useDocTitle('My Skill');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h2 className={styles.heroTitle}>My Skill</h2>
        <p className={styles.heroTagline}>A brief tagline about this skill</p>
        <div className={styles.heroBadges}>
          <span className={styles.heroBadge}>Tag One</span>
          <span className={styles.heroBadge}>Tag Two</span>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Section Title</h3>
        <p className={styles.sectionText}>Description of this aspect.</p>
        <CodeBlock filename="example.js" language="javascript" code={exampleCode} />
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statBlock}>
          <div className={styles.statNum}>42</div>
          <div className={styles.statLabel}>Stat Label</div>
        </div>
      </div>

      <div className={styles.callout}>
        A key takeaway or pull-quote goes here.
      </div>
    </div>
  );
}
```

## CodeBlock Component

Import from `./CodeBlock`. Props:

| Prop | Type | Description |
|---|---|---|
| `filename` | string | Displayed in the header bar (e.g. `"app.py"`) |
| `language` | string | Syntax highlighting language (e.g. `"python"`, `"javascript"`, `"bash"`) |
| `code` | string | The code string to render |

Features:
- Uses `react-syntax-highlighter` with `vscDarkPlus` theme (Prism-based)
- Header bar shows: colored dot, filename, language chip, copy button
- Copy button uses `navigator.clipboard.writeText()` with fallback
- Accessible: `aria-label` changes between "Copy code to clipboard" and "Copied to clipboard"

Define code as template literal constants at the top of the file:

```jsx
const deployCode = `ansible-playbook -i inventory deploy.yml
# Output: PLAY RECAP ...`;
```

## Registration Steps

Three files need changes to wire up a new skill page:

### 1. `src/config/skillsConfig.js`

Add the skill ID to `CUSTOM_SKILL_IDS`:

```js
export const CUSTOM_SKILL_IDS = new Set([
  // ... existing IDs
  'my_skill',
]);
```

Add to the appropriate array (`codingSkills` or `softwareSkills`):

```js
export const codingSkills = [
  // ... existing skills
  { id: 'my_skill', label: 'My Skill' },
];
```

### 2. `src/App.js`

Add a lazy import to the `customComponents` map:

```js
const customComponents = {
  // ... existing entries
  my_skill: lazy(() => import('./components/skills/my_skill')),
};
```

### 3. Create the component file

Create `src/components/skills/my_skill.js` following the structure above.

No route definition needed — App.js auto-generates the route from the config entry.

## CSS Classes Reference

All classes come from `src/css/SkillPage.module.css`. Import as:

```js
import styles from '../css/SkillPage.module.css';
```

| Class | Element |
|---|---|
| `styles.skillPage` | Page wrapper |
| `styles.hero` | Hero banner |
| `styles.heroTitle` | Skill name heading |
| `styles.heroTagline` | Tagline paragraph |
| `styles.heroBadges` | Badge container |
| `styles.heroBadge` | Individual badge chip |
| `styles.section` | Content section card |
| `styles.sectionTitle` | Section heading |
| `styles.sectionText` | Body paragraph |
| `styles.twoCol` | Two-column grid layout |
| `styles.statsRow` | Stats row container |
| `styles.statBlock` | Individual stat card |
| `styles.statNum` | Stat number |
| `styles.statLabel` | Stat label |
| `styles.callout` | Pull-quote block |
| `styles.tipBox` | Info/note box |
| `styles.liveSection` | Live data section |
| `styles.liveDot` | Pulsing live indicator |
| `styles.cardsGrid` | Card grid for API results |
| `styles.card` | Individual result card |

import { ReelItem } from '@/types';

export const INITIAL_SAMPLE_REELS: ReelItem[] = [
  {
    url: 'https://www.instagram.com/reel/C8xDockerRollout/',
    domain: 'Technology',
    subdomain: 'DevOps & Cloud',
    category: 'Technology - DevOps & Cloud',
    subject: 'Zero-Downtime Docker Swarm & Compose Rollouts',
    personalUtility: 'Use `update_config: order: start-first` to prevent 502 Bad Gateway during production Docker deployments.',
    entities: 'Docker, Docker Compose, Nginx, GitHub Actions, AWS ECS',
    tags: '#docker, #devops, #cloud, #cicd, #backend',
    summary: `### 🚀 Zero-Downtime Docker Rollout Blueprint

When deploying updates to production Docker containers, standard container replacement causes momentary dropped connections (502 Bad Gateway).

#### 🛠️ Production Fix in \`docker-compose.yml\`:
\`\`\`yaml
services:
  web-api:
    image: my-app:latest
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
        order: start-first
        failure_action: rollback
      restart_policy:
        condition: on-failure
\`\`\`

#### 🔑 Key Mechanics:
1. **\`start-first\`**: Launches the new container and waits for the health check to pass BEFORE killing the old container.
2. **Health Check Gate**: Pair with an explicit \`healthcheck\` endpoint in Dockerfile so traffic only routes when ready.
3. **Automated Rollback**: If the new container fails 3 consecutive health checks, Docker automatically reverts to the previous stable image.`,
    caption: 'Stop having 502 errors when deploying docker containers! Here is how to configure rolling zero-downtime updates in 30 seconds. #docker #devops',
    timestamp: 1741750000000,
  },
  {
    url: 'https://www.instagram.com/reel/C9yTailwindV4/',
    domain: 'Technology',
    subdomain: 'Frontend & UI',
    category: 'Technology - Frontend & UI',
    subject: 'Tailwind CSS v4 CSS-First Architecture & Dynamic Variables',
    personalUtility: 'No more `tailwind.config.js` needed! Configure themes directly in CSS using `@theme` block.',
    entities: 'Tailwind CSS v4, Vite, CSS Grid, React, Next.js',
    tags: '#tailwindcss, #frontend, #css, #webdev, #react',
    summary: `### ⚡ What Changed in Tailwind CSS v4

Tailwind v4 is a ground-up rewrite engineered in Rust/LightningCSS for 10x faster builds and 100% CSS-first configuration.

#### 📦 1. Simplified CSS Import
No more \`@tailwind base;\` directives:
\`\`\`css
@import "tailwindcss";

@theme {
  --color-brand-primary: oklch(0.65 0.24 265);
  --color-brand-accent: oklch(0.78 0.18 190);
  --font-display: "Plus Jakarta Sans", sans-serif;
}
\`\`\`

#### 💎 Core Advantages:
- **Zero Config File**: Everything lives inside your main stylesheet.
- **Native OKLCH Colors**: Perceptually uniform wide-gamut colors out of the box.
- **Dynamic Viewport Units**: Instant support for \`h-dvh\`, \`w-svw\`, and modern CSS container queries without plugins.`,
    caption: 'Tailwind CSS v4 is finally here and it changes how we write styles forever. Here is the 60 second migration guide! #css #webdev',
    timestamp: 1741762000000,
  },
  {
    url: 'https://www.instagram.com/reel/C9zCursorPrompts/',
    domain: 'Technology',
    subdomain: 'AI & Machine Learning',
    category: 'Technology - AI & Machine Learning',
    subject: 'Cursor IDE .cursorrules & Context Anchoring Techniques',
    personalUtility: 'Create a `.cursorrules` file at project root to prevent LLMs from writing deprecated imports or legacy code.',
    entities: 'Cursor IDE, Claude 3.5 Sonnet, GPT-4o, TypeScript, Next.js App Router',
    tags: '#cursor, #ai, #developer, #productivity, #coding',
    summary: `### 🧠 Mastering Cursor AI with .cursorrules

To get 10x more accurate code generation in Cursor without repetitive prompt fixing, anchor your project with context guidelines.

#### 📝 Recommended \`.cursorrules\` Structure:
\`\`\`markdown
You are an expert full-stack TypeScript engineer specializing in Next.js 15 (App Router).
- Always use Server Components by default; only add 'use client' when handling client state or hooks.
- Use Tailwind CSS for styling with mobile-first responsive classes.
- Follow strict TypeScript types (never use 'any').
- Write self-documenting functions with concise inline JSDoc.
\`\`\`

#### 💡 Best Workflow:
- Use \`@Docs\` to index official documentation for new libraries.
- Use \`Cmd + K\` for surgical in-line edits rather than full file regenerations.`,
    caption: 'How to make Cursor AI generate 100% accurate Next.js and TypeScript code every single time. Save this .cursorrules template! #cursor #ai',
    timestamp: 1741774000000,
  },
  {
    url: 'https://www.instagram.com/reel/C8wProteinMealPrep/',
    domain: 'Fitness & Health',
    subdomain: 'Nutrition & Meal Prep',
    category: 'Fitness & Health - Nutrition & Meal Prep',
    subject: 'High-Protein Chipotle-Style Chicken Burrito Bowls (52g Protein)',
    personalUtility: 'Marinate chicken thighs with chipotle in adobo + lime juice for 4-day tender meal prep that doesn’t dry out.',
    entities: 'Chicken Thighs, Chipotle Peppers, Black Beans, Greek Yogurt, Jasmine Rice',
    tags: '#mealprep, #highprotein, #fitness, #nutrition, #healthyrecipes',
    summary: `### 🥗 High-Protein Chipotle Chicken Prep (4 Servings)

**Macros per bowl:** 520 kcal | 52g Protein | 48g Carbs | 12g Fat

#### 🛒 Ingredients:
- 1.5 lbs Boneless Skinless Chicken Thighs
- 1 can Chipotle Peppers in Adobo (blended with 2 limes + 4 garlic cloves)
- 2 cups Cooked Jasmine Rice (seasoned with cilantro & lime)
- 1 can Black Beans (rinsed and warmed with cumin)
- 1 cup Non-Fat Greek Yogurt + Taco Seasoning (High-protein Sour Cream substitute)

#### 🍳 Step-by-Step Method:
1. **Marinate**: Coat chicken in the blended chipotle adobo marinade for at least 30 mins.
2. **Sear**: Cook on medium-high cast iron skillet for 6 mins per side until internal temp reaches 165°F (74°C).
3. **Assemble**: Divide rice, black beans, diced chicken, and greek yogurt crema into 4 glass meal prep containers.`,
    caption: '52g protein Chipotle meal prep for the week! Saves you $80 on takeout and takes under 35 minutes to batch cook. #mealprep #healthy',
    timestamp: 1741780000000,
  },
  {
    url: 'https://www.instagram.com/reel/C8vIndexFundFormula/',
    domain: 'Finance & Wealth',
    subdomain: 'Investing & Index Funds',
    category: 'Finance & Wealth - Investing & Index Funds',
    subject: 'The 3-Fund Portfolio Strategy for Long-Term Wealth',
    personalUtility: 'Automate monthly DCA into VOO/VTI + VXUS + BND with low expense ratios (<0.04%) for market-beating compounding.',
    entities: 'Vanguard (VOO, VTI, VXUS, BND), Fidelity (FXAIX), Schwab',
    tags: '#investing, #finance, #stocks, #wealth, #passiveincome',
    summary: `### 📈 The Boglehead 3-Fund Portfolio Blueprint

A mathematically proven investment strategy that beats 90% of active hedge funds over a 15-year horizon.

#### 🥧 Asset Allocation Formula:
| Asset Class | Ticker Symbol | Recommended Weight | Purpose |
| :--- | :--- | :--- | :--- |
| **Total US Stock Market** | \`VTI\` / \`VOO\` | 70% | Core growth & compounding |
| **Total International** | \`VXUS\` | 20% | Global diversification |
| **Total Bond Market** | \`BND\` | 10% | Volatility hedge & stability |

#### 🔑 Rules of Execution:
1. **Automate**: Set auto-debit on payday so emotions don't dictate timing.
2. **Rebalance Annually**: Adjust back to target percentages once every 12 months.
3. **Never Panic Sell**: Market downturns represent discounted share purchases.`,
    caption: 'You do not need to pick individual stocks to become a millionaire. Here is the exact 3-fund portfolio used by the top 1%. #investing #wealth',
    timestamp: 1741792000000,
  },
  {
    url: 'https://www.instagram.com/reel/C8uDeepWorkFramework/',
    domain: 'Productivity',
    subdomain: 'Focus & Time Management',
    category: 'Productivity - Focus & Time Management',
    subject: 'The 90-Minute Ultradian Rhythm Protocol for 4x Output',
    personalUtility: 'Work in 90-minute hyper-focus blocks followed by 20-minute cognitive defocus (walking, sunlight, no screen).',
    entities: 'Pomodoro, Ultradian Rhythms, Flow State, Notion, Time Blocking',
    tags: '#productivity, #deepwork, #focus, #habits, #mindset',
    summary: `### 🧠 The 90/20 Deep Work Protocol

The human brain naturally cycles through peak alertness and mental fatigue in 90-minute waves known as **Ultradian Rhythms**.

#### ⏰ Execution Blueprint:
1. **The 90-Minute Sprint:**
   - Put phone in another room or turn on Do Not Disturb.
   - Pick exactly **ONE** high-leverage task (e.g. coding a feature, writing an essay).
   - Enter uninterrupted flow state.
2. **The 20-Minute Cognitive Defocus:**
   - Step away from all screens.
   - Go for a walk, hydrate, or look into the distance to rest optic nerves.
   - Resets dopamine and memory consolidation for the next sprint.

#### 📊 Result:
Two 90-minute deep work blocks produce more high-quality creative output than an entire 8-hour day of fragmented multitasking.`,
    caption: 'Stop working 8 hours a day. Use the 90-minute biological rhythm rule to get 4x more done in half the time. #productivity #deepwork',
    timestamp: 1741804000000,
  }
];

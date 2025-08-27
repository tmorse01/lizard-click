# Lizard Click 🦎 — "Lizard! Lizard! Lizard!" Tribute
A tiny site where you click a big LIZARD button, it shouts "Lizard!" (Elio post-credits style), and a counter goes up.
Goals: Vite + React + TypeScript, instant audio on click, localStorage counter, optional Tailwind, a11y labels and focus states.
Acceptance Criteria:
- Big centered "Lizard" button with aria-label and keyboard (Space/Enter) support
- Click increments counter immediately and persists to localStorage
- Play /public/sounds/lizard.mp3 on each click with minimal latency
- "Reset" action with confirmation
- Easter eggs: speech bubble on 3/6/9 clicks (session), triple-chant + confetti every 50th click
- (Optional) PWA basic offline caching
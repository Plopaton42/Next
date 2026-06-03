# Setup

## Install

```bash
npm install @plopaton42/design-system
```

## CSS setup (required)

Add to your global stylesheet (`src/index.css`, `src/globals.css`, or `src/main.tsx`):

```css
/* Option A — full bundle (tokens + component styles) */
@import '@plopaton42/design-system/style.css';

/* Option B — tokens only (if you only need --ds-* variables) */
@import '@plopaton42/design-system/tokens/variables.css';
@import '@plopaton42/design-system/tokens/semantic.css';
```

## React setup

```tsx
// src/main.tsx or src/App.tsx
import '@plopaton42/design-system/style.css'
import { Button, Checkbox, SplitButton } from '@plopaton42/design-system/react'

export default function App() {
  return <Button type="primary">Hello</Button>
}
```

## Vue 3 setup

```ts
// src/main.ts
import '@plopaton42/design-system/style.css'
import { Button } from '@plopaton42/design-system'
```

## TypeScript

All components ship with TypeScript types. No extra `@types/` package needed.

```tsx
import type { ButtonProps } from '@plopaton42/design-system/react'
```

## What's exported

| Export path | Contents |
|------------|----------|
| `@plopaton42/design-system/react` | React components (Button, Checkbox, SplitButton) |
| `@plopaton42/design-system` | Vue 3 components |
| `@plopaton42/design-system/style.css` | All CSS (tokens + component styles) |
| `@plopaton42/design-system/tokens/variables.css` | Primitive CSS variables only |
| `@plopaton42/design-system/tokens/semantic.css` | Semantic CSS variables only |

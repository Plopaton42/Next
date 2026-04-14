# Design System — AI Agent Conventions

This file documents everything an AI coding agent needs to understand and
work effectively in this repository. Keep it updated as conventions evolve.

---

## Design System Name and Purpose

**Name:** `@mobivia/design-system`

**Purpose:** A token-driven, AI-first Vue 3 component library that maintains a
single source of truth flowing from Figma through JSON design tokens into CSS
custom properties and Tailwind utility classes. Components are built in Vue 3
with TypeScript and `<script setup>`.

---

## Repository Structure

```
design-system/
├── README.md                      ← project overview and quick start
├── CLAUDE.md                      ← you are here
├── .mcp.json                      ← Figma MCP SSE config (do not modify)
├── tokens/
│   ├── source/                    ← DTCG JSON token files (edit these)
│   │   ├── focus.json             ← focus ring tokens (brand-agnostic)
│   │   ├── radius.json            ← border-radius scale: radius-N in px
│   │   ├── spacing.json           ← padding/px, padding/py, space-between scales
│   │   ├── sizing.json            ← heights, icon sizes, stroke widths, opacity
│   │   ├── typography.json        ← font families, sizes, weights (brand-agnostic)
│   │   ├── shadows.json           ← box-shadow tokens (brand-agnostic)
│   │   ├── primitives/            ← raw color scales
│   │   │   ├── global-colors.json ← 12 universal scales + global palette
│   │   │   ├── norauto.json       ← brand/norauto + brand/secondary scales
│   │   │   ├── midas.json
│   │   │   ├── atu.json
│   │   │   ├── auto5.json
│   │   │   └── mobivia.json
│   │   └── semantic/              ← semantic tokens referencing primitives
│   │       ├── norauto.json       ← primary brand (Figma-synced)
│   │       ├── midas.json
│   │       ├── atu.json
│   │       ├── auto5.json
│   │       └── mobivia.json
│   └── build/                     ← GENERATED, gitignored (do not edit)
│       ├── variables.css          ← all primitive CSS vars under :root { --ds-* }
│       ├── semantic.css           ← all semantic vars under :root { --ds-* }
│       └── theme.ts               ← typed TS object for Vue component use
├── components/
│   ├── _template/                 ← copy this when creating a new component
│   │   ├── Component.vue
│   │   ├── Component.stories.ts
│   │   └── README.md
│   ├── Checkbox/
│   │   ├── Checkbox.vue
│   │   ├── Checkbox.stories.ts
│   │   ├── Checkbox.figma.ts      ← Figma Code Connect mapping
│   │   └── README.md
│   └── index.ts                   ← component exports
├── composables/                   ← Vue composables (shared reactive logic)
├── mcp/
│   └── server.ts                  ← MCP server exposing design system tools
├── .figma/
│   └── README.md                  ← Figma integration docs
├── src/
│   ├── main.ts
│   ├── App.vue
│   └── style.css                  ← Tailwind entry + @theme token bridges
├── style-dictionary.config.ts     ← token build pipeline config
├── tailwind.config.ts             ← Tailwind v4 plugin config (theme is in CSS)
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Token Naming Conventions

### Source format: W3C DTCG (Design Token Community Group)

All token files in `tokens/source/` use the DTCG format:

```json
{
  "category": {
    "name": {
      "$value": "the-value",
      "$type": "color | dimension | fontFamily | fontWeight | number | shadow",
      "$description": "Human-readable description of when to use this token"
    }
  }
}
```

### CSS custom property naming

Style Dictionary transforms the nested JSON path into a flat CSS custom property
with the prefix `--ds-`:

| JSON path                          | CSS custom property                  |
|------------------------------------|--------------------------------------|
| `blue.blue-700`                    | `--ds-blue-blue-700`                 |
| `neutral.neutral-900`              | `--ds-neutral-neutral-900`           |
| `border-radius.radius-8`           | `--ds-border-radius-radius-8`        |
| `padding.px.px-16`                 | `--ds-padding-px-px-16`              |
| `button.primary.surface`           | `--ds-button-primary-surface`        |
| `default.on-surface`               | `--ds-default-on-surface`            |

### Rules

1. Use `kebab-case` for all token names.
2. Avoid abbreviations — prefer `primary-foreground` over `primary-fg`.
3. Use semantic names (`color.text.primary`) not atomic names (`color.gray.900`)
   for tokens consumed in components. Atomic tokens exist as the scale
   (e.g., `color.neutral.*`) that semantic tokens reference.
4. Never hardcode `--ds-*` variable values in components. Always use the
   Tailwind utility class or reference the CSS custom property by name.

---

## Component Conventions

### Technology

- **Vue 3** with `<script setup>` (Composition API, no Options API)
- **TypeScript** — all props, emits, and composable return types must be typed
- **Tailwind CSS v4** — use utility classes; avoid inline styles
- **No CSS Modules, no scoped styles** — unless a component requires styles
  that cannot be expressed with Tailwind utilities

### File structure

Each component lives in its own directory under `components/`:

```
components/
└── Button/
    ├── Button.vue     ← component implementation
    └── README.md      ← props table, usage, a11y notes, Figma link
```

### Vue SFC template

```vue
<script setup lang="ts">
// 1. Imports
// 2. Props definition
// 3. Emits definition
// 4. Composable usage
// 5. Computed/reactive state
// 6. Methods/handlers

defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}>();

defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<template>
  <!-- Single root element preferred; use fragments only when necessary -->
</template>
```

### Naming rules

- Component files: `PascalCase.vue` (e.g., `Button.vue`, `InputField.vue`)
- Composables: `use` prefix, camelCase (e.g., `useTheme.ts`, `useId.ts`)
- Emits: camelCase verb (e.g., `update:modelValue`, `submit`)
- CSS classes: Tailwind utilities only; no custom class names on elements

---

## How to Add a New Component

1. **Copy the template:**
   ```bash
   cp -r components/_template components/MyComponent
   ```

2. **Rename the Vue file:**
   ```bash
   mv components/MyComponent/Component.vue components/MyComponent/MyComponent.vue
   ```

3. **Implement the component** in `MyComponent.vue` following the conventions
   above. Do NOT implement logic in the template step — scaffold first.

4. **Update README.md** in the component directory with:
   - Purpose and usage
   - Props table
   - Emits table
   - Which `--ds-*` tokens it uses
   - Accessibility notes
   - Link to the Figma component

5. **Create the Code Connect file** `MyComponent.figma.ts` in the component directory.
   Use the format documented in the "Figma Code Connect" section above.

6. **Export the component** from `components/index.ts`:
   ```typescript
   export { default as MyComponent } from './MyComponent/MyComponent.vue';
   ```

7. **Run the dev server** and verify it renders:
   ```bash
   npm run dev
   ```

---

## Token Pipeline: Figma → JSON → CSS Vars → Tailwind

### Two-layer token architecture

```
Layer 1 — Primitives (tokens/source/primitives/ + global files)
  Universal color scales: blue, neutral, ambient, periwinkle, red,
  green, orange, rose, violet, indigo — shared across all brands.
  Brand-specific scales: brand/norauto/*, brand/secondary/*
  Dimension scales: spacing, radius, sizing (height, icon, stroke, opacity)

Layer 2 — Semantic (tokens/source/semantic/)
  Purpose-based tokens that reference primitives via {path} aliases.
  e.g.: button.primary.surface → {blue.blue-700}
  One file per brand. Norauto is Figma-synced.
```

### Full pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│  FIGMA (source of truth for visual design)                          │
│  Variables extracted via Figma MCP Plugin API                       │
└──────────────────────────┬──────────────────────────────────────────┘
                           │  use_figma → get_variable_defs
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│  tokens/source/  (DTCG format, committed to git)                    │
│  ├── primitives/global-colors.json  ← 12 universal color scales    │
│  ├── primitives/{brand}.json        ← brand-specific scales        │
│  ├── semantic/{brand}.json          ← semantic tokens              │
│  └── spacing|radius|sizing|typography|shadows|focus.json            │
└──────────────────────────┬──────────────────────────────────────────┘
                           │  npm run build:tokens
                           │  (style-dictionary.config.ts)
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│  tokens/build/  (gitignored — do not edit)                          │
│  ├── variables.css   :root { --ds-* }  ← all primitive tokens      │
│  ├── semantic.css    :root { --ds-* }  ← all semantic tokens       │
│  └── theme.ts        export const theme = { ... }                  │
└────────────┬──────────────────────────────┬─────────────────────────┘
             │                              │
             ▼                              ▼
┌────────────────────────┐   ┌──────────────────────────────────────┐
│  src/style.css         │   │  import { theme } from '@tokens/theme'│
│  @import variables.css │   │  (rare — only when typed JS values    │
│  @import semantic.css  │   │   are needed outside of CSS)          │
│  @theme inline { ... } │   └──────────────────────────────────────┘
└────────────┬───────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Tailwind CSS v4 utility classes                                    │
│  class="bg-[--ds-button-primary-surface] text-[--ds-default-...]"  │
│  ↑ generated from @theme inline variables                           │
└─────────────────────────────────────────────────────────────────────┘
```

### Key points

- **Never edit `tokens/build/`** — it is gitignored and regenerated on every
  `build:tokens` run.
- **Always run `npm run build:tokens`** after editing any `tokens/source/` file
  before starting `npm run dev` or `npm run build`.
- The **`--ds-` prefix** on all CSS custom properties prevents collisions with
  Tailwind's own internal variables (which use `--color-*`, `--spacing-*` etc.).
- Semantic tokens are **single-mode** (no light/dark/contrast split) — the
  Figma file drives this architecture. Dark mode can be added via primitive
  overrides in a future iteration.
- Components always reference **semantic tokens**, never primitives directly.
- The Style Dictionary config separates primitives from semantics using
  `filePath` filtering — primitives → `variables.css`, semantics → `semantic.css`.

---

## MCP Tools

Run the MCP server with: `npm run mcp`

| Tool              | Description                                                         |
|-------------------|---------------------------------------------------------------------|
| `list_tokens`     | Returns all tokens by category from `tokens/source/` (recursive)   |
| `get_component`   | Returns `.vue` source + README for a named component                |
| `get_conventions` | Returns this CLAUDE.md file                                         |

---

## Figma Code Connect

Each component has a co-located `Component.figma.ts` file that records the
mapping between the Figma component and the Vue implementation.

### File format

```typescript
// components/MyComponent/MyComponent.figma.ts
export const myComponentFigmaConnect = {
  figmaFileKey: '<fileKey>',
  figmaNodeId: '<nodeId>',
  figmaUrl: 'https://www.figma.com/design/<fileKey>/...?node-id=<nodeId>',
  component: 'MyComponent',
  source: 'components/MyComponent/MyComponent.vue',
  label: 'Vue' as const,
  props: {
    // vuePropName: { figmaProp: 'Figma Property Name', type: 'boolean' | 'string' | 'enum' }
  },
  example: `<MyComponent :prop="value" />`,
} as const;
```

### Publishing mappings

Mappings are published to Figma Dev Mode via the **Figma MCP server** (not the CLI).
When a new component is added or a prop mapping changes, republish using the
`send_code_connect_mappings` MCP tool.

Requirements for Code Connect to work:
- The Figma component must be **published in a Figma library**
- The Figma file must be in a team on a **Professional, Organization, or Enterprise** plan

---

## Common Commands

```bash
npm run build:tokens   # Regenerate tokens/build/ from tokens/source/
npm run dev            # Start Vite dev server (requires build:tokens first)
npm run build          # Full production build (tokens + type-check + vite)
npm run mcp            # Start the MCP server on stdio
```

---

## Agent Rules — Non Negotiable

These rules apply to EVERY task, without exception.
No need to be reminded — always follow them.

### After any component change
- Update README.md of the modified component
- Update Storybook stories if props, variants or states changed
- Update the props table in README.md if props changed
- Add a changelog entry at the bottom of README.md with the date and what changed

### After any token change
- Re-run the Style Dictionary build
- Update CLAUDE.md if a new token category was introduced
- Check that no existing component breaks (spot check Tailwind classes)

### After adding a new component
- Create the full folder structure: Component.vue + README.md + Component.stories.ts + Component.figma.ts
- Document every prop, variant, slot and emit in README.md
- Add at least one Storybook story per variant
- Register the component in /components/index.ts
- Create the Figma Code Connect file and publish the mapping via the Figma MCP server
- The `Playground` story is MANDATORY on every component — it must always be the first story exported and must have `argTypes` defined for every prop so all controls are interactive in Storybook

### General
- Never leave a TODO without a comment explaining what's needed
- Never use arbitrary Tailwind values — always use design tokens
- If a Figma link is provided, always extract all visible variants before coding

---

## Figma Fidelity — Non Negotiable

When a Figma component or frame is provided (via selection or URL),
Claude's job is to be a pixel-perfect translator, not an interpreter.

---

### Before writing a single line of code

1. Extract ALL information from Figma:
   - Every variant (e.g. Primary, Secondary, Ghost, Destructive)
   - Every size (e.g. sm, md, lg)
   - Every state (default, hover, focus, active, disabled, loading, error)
   - Every prop visible in Figma (label, icon, iconPosition, etc.)
   - Every slot (leading icon, trailing icon, prefix, suffix)
   - Exact spacing, radius, typography, color — all mapped to design tokens
   - Motion/transition if visible in prototype

2. Write a component spec BEFORE coding and wait for approval:

   ## Component Spec — [ComponentName]

   ### Variants
   - variant: primary | secondary | ghost | destructive

   ### Sizes
   - size: sm | md | lg

   ### States
   - default, hover, focus, active, disabled, loading

   ### Props
   | Prop | Type | Default | Description |
   |---|---|---|---|
   | variant | 'primary' \| 'secondary' \| 'ghost' | 'primary' | Visual style |
   | size | 'sm' \| 'md' \| 'lg' | 'md' | Component size |
   | disabled | boolean | false | Disabled state |
   | loading | boolean | false | Loading state |
   | label | string | — | Button text |

   ### Slots
   - leading-icon
   - trailing-icon

   ### Design tokens used
   - bg: color-brand-surface-primary
   - text: color-brand-surface-on-primary
   - radius: radius-button-default

   "Does this spec match your Figma? Shall I proceed?"

3. Wait for explicit approval before writing any code

---

### During development

- Every spacing value → must match a design token exactly
- Every color → must match a design token exactly
- Every border-radius → must match a design token exactly
- Every font size/weight/family → must match a design token exactly
- If a value exists in Figma but has NO corresponding token →
  stop and ask: "This value has no token: [value].
  Should I create a new token, use the closest existing one,
  or is this a one-off?"

---

### When perfect ISO is technically impossible

1. Stop immediately — do not approximate silently
2. Explain clearly:
   "I can't reproduce [X] exactly because [reason].
   Here are my options:
   A) [Option A] — closest to Figma, minor visual difference
   B) [Option B] — technically cleaner, slightly different
   C) Create a new token for this value
   Which do you prefer?"
3. Wait for answer before proceeding
4. Document the decision in README.md under
   "## Known Deviations from Figma"

---

### Figma fidelity check (after coding)

Report this table before asking for merge approval:

| Item | Figma value | Token used | Match |
|---|---|---|---|
| Background | #005ab8 | color-button-primary | ✅ |
| Border radius | 8px | radius-button-default | ✅ |
| Font size | 16px | text-md | ✅ |
| Padding | 12px 24px | spacing-3 spacing-6 | ✅ |

If any row is ❌ → fix before asking to merge.

---

### What Claude NEVER does with Figma

- Never starts coding without extracting the full spec first
- Never approximates a value silently
- Never invents a prop name — always uses Figma layer/variant name as reference
- Never ignores a state visible in Figma
- Never uses a hardcoded value when a token exists
- Never considers a component done without the fidelity check table

---

## Git Workflow — Professional Standards

Claude operates as a senior frontend developer on this project.
Every task follows a professional, production-grade workflow.
No shortcuts. No exceptions.

---

### Branch naming

Never commit directly to main. Always branch.

| Type | Pattern | Example |
|---|---|---|
| New component | feat/component-[name] | feat/component-button |
| Update component | update/component-[name] | update/component-button |
| New tokens | feat/tokens-[category] | feat/tokens-colors |
| Bug fix | fix/[description] | fix/button-disabled-state |
| Hotfix (urgent) | hotfix/[description] | hotfix/button-crash-prod |
| Storybook | story/[component] | story/button |
| Documentation | docs/[description] | docs/button-readme |
| Refactor | refactor/[description] | refactor/token-naming |
| Release | release/v[x.x.x] | release/v1.2.0 |

---

### Commit message format (Conventional Commits)

type(scope): short description in imperative mood

Types:
- feat → new component or feature
- update → changes to existing component
- fix → bug fix
- docs → documentation only
- refactor → restructure without behavior change
- tokens → design token changes
- test → storybook stories, tests
- chore → build, config, deps
- breaking → breaking change (always explicit)

Rules:
- Max 72 characters for subject line
- Use imperative mood ("add" not "added", "fix" not "fixed")
- Reference ticket/issue if relevant in body
- Mark breaking changes explicitly: "BREAKING CHANGE:" in body

Examples:

```
feat(button): add loading state with spinner
fix(input): correct disabled border using token color-outline-weak
update(button): add ghost variant, update stories and README
tokens(colors): add semantic danger tokens for all 3 modes
docs(button): update props table, add usage rules and examples
breaking(button): rename prop "type" to "variant" — update all usages
```

---

### Self-review checklist

Before asking for merge approval, Claude runs this checklist
and reports every item:

#### Code quality
- [ ] vue-tsc --noEmit passes with zero errors
- [ ] No arbitrary Tailwind values (only design tokens)
- [ ] No hardcoded color, spacing or font values
- [ ] No console.log or debug code left
- [ ] No TODO left without an explanatory comment
- [ ] Props are fully typed with TypeScript interfaces
- [ ] All emits are declared and typed
- [ ] Slots are documented

#### Component completeness
- [ ] All Figma variants implemented
- [ ] All states handled: default, hover, focus, disabled, loading (if applicable)
- [ ] Responsive behavior considered
- [ ] Dark mode works with existing tokens
- [ ] Contrast mode works with existing tokens

#### Accessibility
- [ ] Correct semantic HTML element used
- [ ] aria-label or aria-labelledby present where needed
- [ ] Keyboard navigation works (Tab, Enter, Space, Escape)
- [ ] Focus ring visible and uses design token
- [ ] Color is never the only indicator of state

#### Documentation
- [ ] README.md updated
- [ ] Props table complete and accurate
- [ ] Usage examples updated
- [ ] Changelog entry added with date
- [ ] Storybook stories cover all variants and states
- [ ] Figma link present in Storybook story
- [ ] Fidelity check table completed

#### Tokens & build
- [ ] Style Dictionary build passes
- [ ] No existing component broken by token changes
- [ ] tokens/build/ is gitignored and not committed

---

### Workflow for a NEW component

1. Announce: "Starting feat/component-[name]"
2. Create branch
3. Read CLAUDE.md conventions before writing any code
4. Extract full Figma spec → write Component Spec → wait for approval
5. Create: Component.vue + README.md + Component.stories.ts + Component.figma.ts
6. Register in /components/index.ts
6b. Publish Code Connect mapping via Figma MCP server
7. Run full self-review checklist
8. Complete fidelity check table
9. Report all results (all must be ✅)
10. Write PR description
11. Ask: "All checks pass ✅ Ready to merge feat/component-[name] → main?"
12. Wait for explicit approval
13. After approval: merge, delete branch, confirm: "Merged and branch deleted ✅"

### Workflow for UPDATING an existing component

1. Announce: "Starting update/component-[name]"
2. Create branch
3. Read current component code + README before touching anything
4. If Figma provided → re-extract full spec, compare with current implementation
5. Make changes
6. Update README.md changelog section
7. Update Storybook stories if props/variants/states changed
8. Run full self-review checklist
9. Show a clear diff summary:
   - What changed and why
   - Breaking changes? Yes/No
   - Components affected by this change
10. Write PR description
11. Ask: "All checks pass ✅ Ready to merge update/component-[name] → main?"
12. Wait for explicit approval
13. After approval: merge, delete branch, confirm: "Merged and branch deleted ✅"

### Workflow for TOKENS update

1. Announce: "Starting feat/tokens-[category]"
2. Create branch
3. Update token JSON files
4. Run Style Dictionary build → must pass
5. Audit: list every component that uses these tokens
6. Spot-check each affected component in Storybook
7. If a component breaks → fix it in the same branch
8. Run self-review checklist (token section)
9. Ask: "Tokens updated, build passes, [N] components verified ✅ Ready to merge?"
10. Wait for explicit approval

### Hotfix workflow

1. Announce: "🚨 Hotfix — branching from main"
2. Create hotfix/[description] from main
3. Fix only the specific issue — no scope creep
4. Run self-review checklist
5. Ask: "Hotfix ready ✅ Urgent — merge hotfix → main?"
6. After approval: merge, tag patch version, delete branch

---

### PR description format

```
## What
[One sentence describing what this PR does]

## Why
[One sentence on why this change was needed]

## Changes
- [Bullet list of specific changes]

## Variants & states implemented
- [List from Figma spec]

## Checklist
[Paste checklist results with ✅ or ❌]

## Fidelity check
[Paste fidelity table]

## Breaking changes
None / [Description + migration path]

## Storybook
[Which stories to check]
```

---

### Semantic versioning

| Change type | Bump | Example |
|---|---|---|
| New component | minor | 1.0.0 → 1.1.0 |
| Update (non-breaking) | patch | 1.1.0 → 1.1.1 |
| Bug fix | patch | 1.1.1 → 1.1.2 |
| Breaking change | major | 1.1.2 → 2.0.0 |
| Tokens only (non-breaking) | patch | 2.0.0 → 2.0.1 |

After every merge:
1. Update version in package.json
2. Add entry to CHANGELOG.md
3. Commit: chore(release): bump version to vX.X.X

### CHANGELOG.md format

```
## [1.1.0] - 2026-03-18

### Added
- Button component with 3 variants and 3 sizes

### Changed
- Surface tokens updated for dark mode contrast

### Fixed
- Input disabled border color now uses correct token

### Breaking
- None
```

---

### What Claude NEVER does

- Never commits directly to main
- Never merges without explicit user approval
- Never skips the self-review checklist
- Never skips the fidelity check table
- Never leaves a branch open after merge
- Never force pushes
- Never commits node_modules, tokens/build/, .env
- Never ships a component without a `Component.figma.ts` Code Connect file
- Never ships a component without Storybook stories
- Never ships a component without a `Playground` story as the first export
- Never ships a Storybook story without `argTypes` for every prop
- Never uses a hardcoded value when a token exists
- Never ignores a TypeScript error
- Never approximates a Figma value silently
- Never starts coding without the approved Component Spec
- Never marks an accessibility item ✅ without actually checking it
- Never bumps a major version without warning about breaking changes
- Never starts a new task without reading CLAUDE.md first

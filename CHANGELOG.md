# Changelog

All notable changes to `@next/design-system` are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased] — feat/tokens-figma-migration

### Breaking

- **Primitive token naming** completely changed to match Figma "Next" file:
  - Old: `norauto.primary.primary-50` → New: `brand.norauto.norauto-500`
  - Old: `norauto.neutral.grey-80` → New: `neutral.neutral-200`
  - CSS vars change accordingly: `--ds-norauto-primary-primary-50` → `--ds-brand-norauto-norauto-500`
- **Spacing system** changed from rem-based generic scale to px-based directional scale:
  - Old: `spacing.4` (1rem / 16px) → New: `padding.px.px-16` / `padding.py.py-16`
- **Radius scale** changed from named tokens to numeric:
  - Old: `radius.lg` (8px) → New: `border-radius.radius-8`
- **Semantic tokens** (norauto) fully rewritten with new Figma structure
- **Style Dictionary output** changed: `semantic-light/dark/contrast.css` → single `semantic.css`
- Removed `primitives/alert.json` and `primitives/decorative.json` (now in `semantic/norauto.json`)

### Added

- `tokens/source/primitives/global-colors.json` — 12 universal color scales:
  `blue`, `neutral`, `ambient`, `periwinkle`, `red`, `green`, `orange`, `rose`, `violet`, `indigo`, `global`
- `tokens/source/sizing.json` — component heights, icon sizes, stroke widths, opacity scale
- Norauto semantic tokens now cover: `default`, `ambient`, `highlight`, `button` (7 variants),
  `interaction`, `decorative`, `feedback`, `global/ring-focus`
- Button control tokens: min-height, padding, space-between, radius, border sizes — all sizes (sm → xxl)

### Changed

- `tokens/source/primitives/norauto.json` — new `brand/norauto` (9 steps) + `brand/secondary` (10 steps)
- `tokens/source/spacing.json` — directional padding + gap scale
- `tokens/source/radius.json` — numeric scale radius-0 → radius-64 + radius-full
- `style-dictionary.config.ts` — filePath-based filtering replaces mode-prefix filtering
- `README.md` and `CLAUDE.md` — updated to reflect new token architecture

### Not changed (pending Figma update)

- Midas, ATU, Auto5, Mobivia brand primitives and semantics (deleted — see below)
- `typography.json`, `shadows.json`, `focus.json`

---

## [Unreleased] — update/component-button (3-tier token migration)

### Added

- `tokens/source/primitives.json`, `tokens/source/semantic.json`,
  `tokens/source/components.json` — full Primitive → Semantic → Component
  pipeline extracted directly from Figma's 3 Variable collections (192 + 226
  + 218 tokens), per the `roadtrip-figma-tokens` design-system guide
- Real `:active`/press visual states on `Button` (and `SplitButton`), driven
  by actual Figma tokens (`surface-active`, `border-pressed`/`border-active`)

### Changed

- `Button` destructive/alternative token mapping corrected to match Figma's
  Components collection: `destructive`+`secondary` now has its own tokens
  (was reusing `outlined`); `alternative`+`primary` now borrows `primary`'s
  hover/active tokens (was falling back to a flat rest surface)
- Renamed several `--ds-button-control-*` CSS custom properties to match the
  restructured Figma tokens (`icon-size`→`icon-number`, `padding-{px,py}`→
  `padding-default-{px,py}`, `border-{default,style}`→
  `border-size-{default,style}`, `border-hover`→`border-size-pressed`) and
  the disabled/focus-ring tokens (`--ds-default-*-disabled`→
  `--ds-color-scene-default-*-disabled`, `--ds-global-ring-focus`→
  `--ds-color-focus-ring`)
- `style-dictionary.config.ts` CSS routing extended to classify
  `semantic.json`/`components.json` as semantic-tier output

### Removed

- `destructive`+`outlined` combination on `Button` — no longer exists as a
  Figma Component token; falls back to the base type's default-intent style
- Old flat `button.*` block from `tokens/source/semantic/norauto.json`
  (superseded by `tokens/source/components.json`)

### Not changed

- Non-Button components (Checkbox, SplitButton's own container/menu chrome,
  etc.) remain on the legacy flat semantic model — migrate opportunistically
  per component, not repo-wide

---

## [0.1.0] — 2026-04-07

### Added

- Initial release: Checkbox component with full Figma Code Connect
- Multi-brand token architecture (5 brands × 3 modes)
- Style Dictionary build pipeline
- Storybook setup
- MCP server with `list_tokens`, `get_component`, `get_conventions`
- README and CLAUDE.md conventions documentation

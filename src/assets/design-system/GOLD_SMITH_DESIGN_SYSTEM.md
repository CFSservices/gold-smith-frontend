## Gold Smith Design System

Single-source reference for Gold Smith brand tokens and design primitives. All values here are defined once in CSS under `src/assets/design-system/tokens/*.css` and consumed by Tailwind, PrimeReact, and custom components.

---

## Colors

### Brand gold palette (primitives)

- `--color-gold-50`  `#FFFBEB`
- `--color-gold-100` `#FEF3C7`
- `--color-gold-200` `#FDE68A`
- `--color-gold-300` `#FCD34D`
- `--color-gold-400` `#FBBF24`
- `--color-gold-500` `#F59E0B`
- `--color-gold-600` `#D97706`
- `--color-gold-700` `#B45309`
- `--color-gold-800` `#92400E`
- `--color-gold-900` `#78350F`
- `--color-gold-950` `#451A03`

### Brand gold (Figma tokens)

- `--color-gold-dark`              `#675122`   (Primary / Default in light mode)
- `--color-gold-medium`            `#A97F00`   (Primary / Default in dark mode)
- `--color-gold-icon-dark`         `#D4A574`
- `--color-gold-light`             `#FFF9E5`
- `--color-gold-light-alt`         `#ECE0C5`
- `--color-gold-gradient-start`    `#54421C`
- `--color-gold-gradient-end`      `#2E240F`

### Neutrals / secondary (stone)

- `--color-secondary-50`   `#FAFAF9`
- `--color-secondary-100`  `#F5F5F4`
- `--color-base-bg`        `#F2F2F2`   (App base background)
- `--color-secondary-200`  `#E7E5E4`
- `--color-secondary-300`  `#D6D3D1`
- `--color-secondary-400`  `#A8A29E`
- `--color-secondary-500`  `#78716C`
- `--color-secondary-600`  `#57534E`
- `--color-secondary-700`  `#44403C`
- `--color-secondary-800`  `#292524`
- `--color-secondary-900`  `#1C1917`
- `--color-secondary-950`  `#0C0A09`

### Semantic primitives

- `--color-white`             `#FFFFFF`
- `--color-black`             `#000000`
- `--color-border-default`    `#CCCCCC`
- `--color-text-muted`        `#555555`
- `--color-disabled-bg`       `#E5E5E5`
- `--color-disabled-text`     `#808080`

### Primary semantic (light mode)

- `--color-primary`                   alias of `--color-gold-dark`
- `--color-primary-default`          alias of `--color-gold-dark`
- `--color-primary-hover`            `#54421C`
- `--color-primary-pressed`          `#2E240F`
- `--color-primary-tint`             `#ECE0C5`
- `--color-primary-tint-hover`       `#F2EAD9`
- `--color-primary-tint-pressed`     `#E6D6B2`

### Error semantic

- `--color-error`                    `#A90000`
- `--color-error-hover`              `#8F0000`
- `--color-error-pressed`            `#5C0000`
- `--color-error-tint`               `#FFE5E5`
- `--color-error-tint-hover`         `#FFCCCC`
- `--color-error-tint-pressed`       `#FF9999`

### Success semantic

- `--color-success`                  `#00A91C`
- `--color-success-hover`            `#008F18`
- `--color-success-pressed`          `#005C0F`
- `--color-success-tint`             `#E5FFEA`
- `--color-success-tint-hover`       `#CCFFD4`
- `--color-success-tint-pressed`     `#99FFAA`

### Warning semantic

- `--color-warning`                  `#A97F00`
- `--color-warning-hover`            `#8F6B00`
- `--color-warning-pressed`          `#5C4500`
- `--color-warning-tint`             `#FFF9E5`
- `--color-warning-tint-hover`       `#FFF2CC`
- `--color-warning-tint-pressed`     `#FFE599`

### Dark-mode semantic overrides

Defined under `.dark` in `primereact-vars.css`, using transparent overlays for tints:

- `--primary-color`          alias of `--color-gold-medium`
- `--color-primary-default` alias of `--color-gold-medium`
- `--color-primary-hover`   `#8F6B00`
- `--color-primary-pressed` `#5C4500`
- `--color-primary-tint`    `rgba(169, 127, 0, 0.2)`
- `--color-error-tint`      `rgba(169, 0, 0, 0.2)`
- `--color-success-tint`    `rgba(0, 169, 28, 0.2)`
- `--color-warning-tint`    `rgba(169, 127, 0, 0.2)`
- `--color-disabled-bg`     `#374151`
- `--color-disabled-text`   `#6B7280`
- `--color-border-default`  `#4B5563`

---

## Surfaces & PrimeReact semantic mapping

These variables are defined in `primereact-vars.css` and consumed by PrimeReact for all components:

### Light mode (`:root`)

- `--primary-color`              `var(--color-gold-dark)`
- `--primary-color-text`        `var(--color-white)`
- `--font-family`               `var(--font-sans)`
- `--surface-ground`            `var(--color-base-bg)`
- `--surface-section`           `var(--color-white)`
- `--surface-card`              `var(--color-white)`
- `--surface-overlay`           `var(--color-white)`
- `--surface-border`            `var(--color-border-default)`
- `--surface-hover`             `var(--color-secondary-200)`
- `--text-color`                `var(--color-black)`
- `--text-color-secondary`      `var(--color-text-muted)`
- `--highlight-bg`              `var(--color-gold-light)`
- `--highlight-text-color`      `var(--color-gold-dark)`
- `--focus-ring`                `0 0 0 0.2rem rgba(103, 81, 34, 0.3)`
- `--border-radius`             `8px`
- `--maskbg`                    `rgba(0, 0, 0, 0.4)`

### Dark mode (`.dark`)

- `--primary-color`              `var(--color-gold-medium)`
- `--primary-color-text`        `var(--color-white)`
- `--surface-ground`            `var(--color-secondary-900)`
- `--surface-section`           `var(--color-secondary-900)`
- `--surface-card`              `var(--color-secondary-800)`
- `--surface-overlay`           `var(--color-secondary-800)`
- `--surface-border`            `var(--color-secondary-700)`
- `--surface-hover`             `var(--color-secondary-700)`
- `--text-color`                `var(--color-white)`
- `--text-color-secondary`      `var(--color-secondary-400)`
- `--highlight-bg`              `rgba(169, 127, 0, 0.2)`
- `--highlight-text-color`      `var(--color-gold-400)`
- `--focus-ring`                `0 0 0 0.2rem rgba(169, 127, 0, 0.3)`

---

## Typography

All typography primitives are defined in `tokens/typography.css`.

### Font family

- `--font-sans`  
  `'Noto Sans', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`

### Legacy size aliases

- `--font-size-xs`      `10px`
- `--font-size-sm`      `12px`
- `--font-size-base`    `14px`
- `--font-size-md`      `16px`
- `--font-size-lg`      `18px`
- `--font-size-xl`      `24px`
- `--font-size-2xl`     `32px`

### Figma named scale

- `--font-size-caption1`     `10px`
- `--font-size-caption2`     `11px`
- `--font-size-footnote`     `12px`
- `--font-size-body`         `14px`
- `--font-size-callout`      `16px`
- `--font-size-title1`       `18px`
- `--font-size-title2`       `24px`
- `--font-size-title3`       `28px`
- `--font-size-large-title`  `32px`
- `--font-size-huge-title`   `40px`

### Line heights

- `--line-height-xs`    `13.62px`
- `--line-height-sm`    `16.34px`
- `--line-height-base`  `19.07px`
- `--line-height-md`    `21.79px`
- `--line-height-lg`    `24.52px`
- `--line-height-xl`    `32.69px`
- `--line-height-2xl`   `43.58px`

### Font weights

- `--font-weight-normal`    `400`
- `--font-weight-medium`    `500`
- `--font-weight-semibold`  `600`
- `--font-weight-bold`      `700`
- `--font-weight-extrabold` `800`
- `--font-weight-black`     `900`

---

## Spacing (Figma measure tokens)

- `--spacing-nil`    `0px`
- `--spacing-xxs`    `2px`
- `--spacing-xs`     `4px`
- `--spacing-sm`     `6px`
- `--spacing-base`   `8px`
- `--spacing-lg`     `12px`
- `--spacing-xl`     `16px`
- `--spacing-2xl`    `20px`
- `--spacing-3xl`    `24px`
- `--spacing-4xl`    `32px`
- `--spacing-5xl`    `40px`
- `--spacing-6xl`    `48px`
- `--spacing-7xl`    `56px`
- `--spacing-8xl`    `64px`
- `--spacing-9xl`    `80px`
- `--spacing-10xl`   `96px`
- `--spacing-11xl`   `120px`
- `--spacing-12xl`   `160px`
- `--spacing-13xl`   `200px`
- `--spacing-14xl`   `240px`
- `--spacing-15xl`   `320px`

---

## Radius

- `--radius-none`  `0px`
- `--radius-sm`    `8px`   (default corner radius for most components)
- `--radius-lg`    `16px`

Global PrimeReact radius is set via:

- `--border-radius` `8px` (maps to Figma `r_8`)

---

## Usage notes

- **Authoritative source**: These token values are the single source of truth. Tailwind `@theme` variables, PrimeReact semantic variables, and app components must all reference these CSS variables instead of hardcoding hex/px values.
- **Light vs dark**: Primitives are neutral; dark mode overrides semantics (primary, feedback tints, disabled, border) via `.dark` in `primereact-vars.css`.
- **Component theming**: PrimeReact components read from the semantic surface and brand variables listed above, so changing a token here will propagate automatically across buttons, inputs, dialogs, dropdowns, tables, and feedback components.


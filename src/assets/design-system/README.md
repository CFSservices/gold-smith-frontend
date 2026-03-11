# Gold Smith Design System

Modular design system foundation for the Gold Smith application. Each concern lives in its own file for scalability without a single-file dependency.

## Structure

```
assets/design-system/
├── tokens/           # Primitive values (colors, typography)
│   ├── colors.css
│   ├── typography.css
│   └── index.css
├── theme/            # PrimeReact variable mappings
│   ├── primereact-vars.css
│   └── index.css
├── base/             # Reset, typography classes, component overrides
│   ├── reset.css
│   ├── typography.css
│   ├── components.css
│   └── index.css
├── design-system.css # Master entry point
└── README.md
```

## Import Order

1. **Tokens** – Define primitive values in `:root`
2. **Theme** – Maps tokens to PrimeReact variables
3. **Base** – Reset, semantic typography classes, PrimeReact component overrides

**Note:** Tokens are loaded in `index.css` before `@theme inline`; Tailwind references them (no duplication). Design system path: `src/assets/design-system/`.

## Token Flow (Phase 1)

- **tokens/** defines primitive values; no raw hex in theme or base
- **theme/primereact-vars.css** maps tokens to PrimeReact semantics (--primary-color, --text-color, etc.)
- **base/** uses var(--text-color), var(--surface-border), and other semantic variables
- **@theme** in `src/index.css` extends Tailwind; tokens and @theme share the same values

## Tailwind–PrimeReact Handshake (Phase 3)

- **CSS layers** (in `src/index.css`): `@layer theme, primereact, base, utilities`
- **Layer order**: Later layers override earlier. Design system base overrides PrimeReact without `!important`.
- **PrimeReact theme**: Loaded via CDN in `index.html`; `primereact-vars.css` maps our tokens to `--primary-color`, `--surface-ground`, etc.
- **Component overrides**: Use `base` layer; avoid `!important`—layer specificity is sufficient.
- **Reference**: [PrimeReact CSS Layer](https://primereact.org/guides/csslayer/)

## Adding New Tokens

- Add color tokens to `tokens/colors.css`
- Add typography/spacing tokens to `tokens/typography.css` (or create `tokens/spacing.css`)
- Add to `@theme inline` in `src/index.css` (references token var) so Tailwind generates utilities
- Reference tokens in `theme/primereact-vars.css` for PrimeReact components

## Usage

The design system is imported in `src/index.css` from `src/assets/design-system/`. Do not import design-system files directly in components; use Tailwind utilities and semantic classes instead.

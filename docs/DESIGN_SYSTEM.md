# Design System

Ported 1:1 from the reference portfolio (`projects/1_kartikey`): a minimal, compact system on
Tailwind CSS v4, Geist Sans / Geist Mono, a 14px base size, weight-450 headings, hairline borders,
no shadows on content, and a narrow 3xl reading column.

## Files

| File | Purpose |
| --- | --- |
| `src/index.css` | `@import "tailwindcss"` + `tw-animate-css`, then the files below, then `@custom-variant dark`. All `@import`s must stay above any other rule (Vite skips them otherwise). |
| `styles/fonts.css` | `@font-face` for Geist / Geist Mono (variable, from `public/fonts`) and `--font-geist-*`. |
| `styles/tokens.css` | Copied from the reference. Colors (light + `.dark`), `@theme` type scale, shadows, motion, z-index. |
| `styles/base.css` | Element defaults: `h1–h4` weight 450 + tight tracking, selection, focus ring, smooth scroll. |
| `styles/typography.css` | Type roles: `text-heading-48…16`, `text-copy-18…13(-mono)`, `heading-lg/sm`, `body-text`, `eyebrow`. |
| `styles/layout.css` | `page-shell`, `section-shell` (48rem), `surface`, `interactive-row`. |
| `styles/utilities.css` | `thin-scrollbar`. |
| `styles/vendor.css` | Markdown editor + browser-autofill adapters (project-specific). |

## Tokens

- **Color:** `background foreground card popover primary secondary accent muted border input ring`
  plus `destructive success warning`. Light: white / near-black. Dark: pure black `#000`, cards `#0a0a0a`,
  borders `rgba(255,255,255,.14)`.
- **Radius:** `--radius` 0.5rem → `rounded-xs/sm/md/lg/xl`.
- **Type scale (compact):** `text-xs 11px · sm 12px · base 14px · lg 16px · xl 18px · 2xl 20px …`.
- **Elevation:** `shadow-popover`, `shadow-overlay` only. Content surfaces have no shadow.
- **Motion:** `--duration-fast/base/slow` 150/200/300ms, `--ease-out-expo`.
- **Z-index:** `z-(--z-sticky)` 40, `z-(--z-overlay)` 50.
- Rule: no hex/rgb values or raw z-indexes in components.

## Layout

`AppLayout` = `<div class="px-3">` → sticky `Navbar` → `max-w-3xl` column → page → `Footer`.
Pages use `page-shell`; landing sections use `section-shell` + `py-12 sm:py-14 lg:py-16`.
Lists are borderless rows (`Card` with `border-0 bg-transparent p-3 sm:p-5 lg:p-6`) in a
`space-y-4 -ml-3 md:-ml-5` container. Page titles: path eyebrow (`PathnameDisplay`), then the title,
then `body-text`.

Note: `sm:text-heading-48` and similar variants on plain `@layer components` classes do not generate
in Tailwind v4, so those headings stay at the base size. This matches the reference exactly.

## Components

`components/ui` (reference primitives, copied): `Button` (default/destructive/outline/secondary/ghost/link ·
default 36px, xs, sm, lg, icon, icon-xs/sm/lg), `Input`, `Badge`, `Card` (+Header/Title/Description/Content/Footer),
`Select`, `Dialog`, `Skeleton`, `EmptyState`, `ErrorState`.
Written in the same style for this app: `Textarea`, `Label`, `RadioGroup`, `Accordion`.

`components/shared`: `PageHeader`, `PathnameDisplay`, `PageSkeleton`/`LoadingRows`, `AsyncList`
(loading → error → empty → rows), `FormField`, `UnderlineLink`, `MarkdownContent`.

Conventions: controls use `focus-visible:ring-[3px] ring-ring/50`, invalid state via `aria-invalid`,
errors as `text-sm text-destructive` (inline) or `> error: …` in mono (form submit failures).
Status colors: success / warning / destructive tokens on outline badges.

Theme: `next-themes` (class strategy, `light | dark | system`, default system, key `theme`) and the
circle-reveal toggle (`react-theme-switch-animation`), same as the reference. `index.html` applies the
stored theme before React loads.

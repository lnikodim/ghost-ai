# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Foundation

## Current Goal

- None

## Completed

- Next.js boilerplate cleanup
- `01-design-system.md` — shadcn/ui setup, UI primitives, `cn()` helper, dark theme
- `02-editor.md` — editor navbar, project sidebar shell, dialog pattern
- `03-auth.md` — Clerk wired into Next.js: ClerkProvider with dark theme, protected-first middleware in `proxy.ts`, sign-in/sign-up pages with two-panel layout, root redirect, UserButton in editor navbar

## In Progress

- None

## Next Up

- None

## Open Questions

- None

## Architecture Decisions

- None

## Session Notes

- Editor chrome uses overlay sidebar (no layout shift) with navbar toggle controlling open state
- Dialog pattern wraps shadcn primitives with design tokens; feature dialogs deferred
- Auth uses protected-first strategy: all routes blocked except `/sign-in` and `/sign-up` (resolved from env vars)
- Clerk appearance variables override the dark theme using CSS custom properties from `globals.css`; no hardcoded colors
- `ClerkProvider` is placed inside `<body>` (required for Clerk v7+)

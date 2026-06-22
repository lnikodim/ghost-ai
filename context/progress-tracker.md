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
- `04-project-dialogs.md` — editor home screen, create/rename/delete project dialogs, sidebar project items with owner-only actions, mobile backdrop scrim, `useProjectDialogs` hook, mock project data
- `05-prisma.md` — `Project` and `ProjectCollaborator` models, `lib/prisma.ts` singleton with URL-based branching (Accelerate vs direct pg), migration `20260526182516_init_projects`, client generated to `app/egenerated/prisma`
- `06-project-apis.md` — REST API routes for projects: `GET /api/projects`, `POST /api/projects`, `PATCH /api/projects/[projectId]`, `DELETE /api/projects/[projectId]`; owner-only enforcement for mutations; 401/403 responses
- `07-wire-editor-home.md` — editor home wired to real project data: `lib/projects.ts` server-side data helper, `useProjectActions` hook with real API calls and navigation, server component page fetching owned + shared projects, `EditorHomeClient` client shell, create dialog shows room ID preview, rename pre-fills name, delete redirects to `/editor` if active workspace
- `08-editor-workspace-shell.md` — `/editor/[roomId]` server component with Clerk access checks, `lib/project-access.ts` helpers, `AccessDenied` component, workspace layout with project name navbar, share/AI sidebar toggles, canvas placeholder, highlighted active project in sidebar
- `09-share-dialog.md` — share dialog from workspace navbar: owner invite/remove/copy-link flows, collaborator read-only list, `GET/POST/DELETE /api/projects/[projectId]/collaborators`, Clerk Backend API enrichment for display names and avatars, `lib/collaborators.ts`, `useShareDialog` hook
- `10-liveblocks-setup.md` — Liveblocks infrastructure: typed `liveblocks.config.ts` (Presence + UserMeta), cached `@liveblocks/node` client in `lib/liveblocks.ts`, deterministic cursor color helper, `POST /api/liveblocks-auth` with Clerk auth, project access checks, room creation, and session tokens with user metadata
- `11-base-canvas.md` — Liveblocks-backed React Flow canvas: `CanvasRoom` wrapper with provider/suspense/error boundary, `Canvas` with `useLiveblocksFlow`, shared types in `types/canvas.ts`, dot background, MiniMap, loose connections, and `fitView`
- `12-shape-panel.md` — bottom shape panel with draggable shape buttons, drag payload with shape and default size, canvas drop handling with `screenToFlowPosition`, node ID generation, `CanvasNode` renderer, and `canvasNode` type registration
- `13-node-shape.md` — shape-specific node rendering via shared `NodeShape` component (CSS for rectangle/pill/circle, SVG for diamond/hexagon/cylinder), selected-state borders, and cursor-attached ghost drag preview from the shape panel
- `14-node-editing.md` — selected-node resize handles with minimum size constraints, double-click inline label editing with centered placeholder, live label sync via `updateNodeData`, and `nodrag`/`nopan`/`nowheel` on the edit textarea

## In Progress

- None

## Next Up

- None

## Open Questions

- None

## Architecture Decisions

- None

## Session Notes

- UI polish pass: floating sidebars, dark-themed React Flow/MiniMap, Liveblocks `Cursors`, AI sidebar placeholder, active project styling, Liveblocks dark CSS imports
- Editor home screen shows centered heading + description + New Project button (no card wrapper)
- `useProjectDialogs` hook owns all dialog/form/loading state; slug derived from name via `toSlug()` helper
- Sidebar project items use `DropdownMenuTrigger` with `buttonVariants` styling (base-ui doesn't support `asChild`)
- Mobile scrim: `fixed inset-0 bg-black/50 md:hidden` rendered conditionally when sidebar is open; tap closes sidebar
- Editor chrome uses overlay sidebar (no layout shift) with navbar toggle controlling open state
- Dialog pattern wraps shadcn primitives with design tokens; feature dialogs deferred
- Auth uses protected-first strategy: all routes blocked except `/sign-in` and `/sign-up` (resolved from env vars)
- Clerk appearance variables override the dark theme using CSS custom properties from `globals.css`; no hardcoded colors
- `ClerkProvider` is placed inside `<body>` (required for Clerk v7+)
- Prisma v7: driver adapters are required; `prisma-client` generator with explicit output path `app/egenerated/prisma`
- `lib/prisma.ts` branches on `DATABASE_URL` prefix — `prisma+postgres://` uses Accelerate extension, all other URLs use `@prisma/adapter-pg` directly
- Global singleton cached on `globalThis` for hot-reload safety in development
- `useProjectActions` hook pre-generates a random suffix when the create dialog opens so the room ID preview is stable; room ID = `slug-suffix` passed as custom `id` to `POST /api/projects` to keep project ID and Liveblocks room ID aligned
- Shared projects fetched via `ProjectCollaborator.email` matched against the current Clerk user's primary email
- Editor page is a server component; interactive shell extracted to `app/editor/_components/editor-home-client.tsx`
- `lib/project-access.ts` provides `getCurrentClerkIdentity()` and `getProjectAccess()` for server-side workspace authorization
- `/editor/[roomId]` redirects unauthenticated users to `/sign-in`; missing or unauthorized projects render `AccessDenied`
- Workspace shell: navbar shows project name + share/AI toggles, canvas placeholder fills viewport, AI sidebar is a slide-over placeholder
- Share dialog: owners invite/remove collaborators and copy workspace link; collaborators get read-only list; Clerk Backend API enriches emails with display name and avatar when available
- `lib/collaborators.ts` handles collaborator list/invite/remove with owner enforcement and Clerk user lookup
- Liveblocks room ID matches project ID; `lib/liveblocks.ts` caches the node client and maps user IDs to a fixed cursor color palette
- `POST /api/liveblocks-auth` verifies Clerk auth and project membership before calling `getOrCreateRoom`/`updateRoom` and issuing ID tokens with name, avatar, and cursor color
- Canvas uses `useLiveblocksFlow` with empty initial nodes/edges; `types/canvas.ts` defines `canvasNode`/`canvasEdge` types plus node color and shape palettes
- Shape panel: floating pill toolbar at bottom-center with draggable Lucide icons for all six shapes; drop creates `canvasNode` nodes via Liveblocks-synced `onNodesChange` add
- `NodeShape` renders each shape variant: CSS borders/radius for rectangle, pill, and circle; inline SVG polygons/ellipses for diamond, hexagon, and cylinder; borders use `--border-subtle` at rest and `--accent-primary` when selected
- Shape drag preview: transparent native drag image, custom `ShapeDragPreview` ghost follows cursor with default size/color, cleared on drop or drag end
- Node editing: `NodeResizer` on selected nodes (min 48×32), subtle dark-theme resize handles in `globals.css`; double-click label area opens centered textarea overlay; labels sync through React Flow `updateNodeData` into Liveblocks `onNodesChange`; `NodeShape` shows centered `Label` placeholder when empty
- Prisma Postgres: `lib/prisma.ts` rewrites pooled URLs to direct TCP (`db.prisma.io`), uses a cached `pg.Pool`, and retries transient cold-start connection failures

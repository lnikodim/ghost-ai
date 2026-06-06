'use client';

import { useState } from 'react';
import { Bot, Sparkles, X } from 'lucide-react';

import { EditorNavbar } from '@/components/editor/editor-navbar';
import { ProjectSidebar } from '@/components/editor/project-sidebar';
import { CreateProjectDialog } from '@/components/editor/create-project-dialog';
import { RenameProjectDialog } from '@/components/editor/rename-project-dialog';
import { DeleteProjectDialog } from '@/components/editor/delete-project-dialog';
import { ShareProjectDialog } from '@/components/editor/share-project-dialog';
import { CanvasRoom } from '@/components/editor/canvas-room';
import { Button } from '@/components/ui/button';
import { useProjectActions } from '@/hooks/use-project-actions';
import type { AccessibleProject } from '@/lib/project-access';
import type { Project } from '@/lib/projects';
import { cn } from '@/lib/utils';

interface EditorWorkspaceClientProps {
  project: AccessibleProject;
  isOwner: boolean;
  ownedProjects: Project[];
  sharedProjects: Project[];
}

export function EditorWorkspaceClient({ project, isOwner, ownedProjects, sharedProjects }: EditorWorkspaceClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const {
    mode,
    activeProject,
    name,
    roomId,
    isLoading,
    openCreate,
    openRename,
    openDelete,
    close,
    setName,
    handleSubmit,
  } = useProjectActions();

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        projectName={project.name}
        isAiSidebarOpen={isAiSidebarOpen}
        onToggleAiSidebar={() => setIsAiSidebarOpen((prev) => !prev)}
        onShareClick={() => setIsShareDialogOpen(true)}
      />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onCreateProject={openCreate}
        onRenameProject={openRename}
        onDeleteProject={openDelete}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        activeProjectId={project.id}
      />

      <div className="flex min-h-0 flex-1 flex-col pt-12">
        <div className="relative flex min-h-0 flex-1">
          <main className="relative min-h-0 flex-1 bg-base">
            <CanvasRoom roomId={project.id} />
          </main>

          {isAiSidebarOpen ? (
            <div
              aria-hidden="true"
              className="fixed inset-0 top-12 z-40 bg-black/50 md:hidden"
              onClick={() => setIsAiSidebarOpen(false)}
            />
          ) : null}

          <aside
            aria-hidden={!isAiSidebarOpen}
            className={cn(
              'fixed top-15 right-3 bottom-3 z-50 flex w-80 flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface/95 shadow-xl backdrop-blur-sm transition-transform duration-300 ease-in-out',
              isAiSidebarOpen ? 'translate-x-0' : 'translate-x-[calc(100%+0.75rem)] pointer-events-none',
            )}
          >
            <div className="flex items-start justify-between border-b border-surface-border px-4 py-3">
              <div className="flex min-w-0 items-start gap-2.5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-ai/15 text-ai-text">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-medium text-copy-primary">AI Copilot</h2>
                  <p className="text-xs text-copy-muted">Architecture assistant</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Close AI sidebar"
                onClick={() => setIsAiSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
              <div className="rounded-2xl border border-surface-border bg-elevated p-4">
                <div className="mb-3 flex items-center gap-2 text-ai-text">
                  <Bot className="h-4 w-4" />
                  <span className="text-sm font-medium text-copy-primary">Chat surface pending</span>
                </div>
                <p className="text-sm leading-relaxed text-copy-muted">
                  The toggle is wired. Messaging and generation are intentionally out of scope here.
                </p>
              </div>

              <div className="rounded-2xl border border-dashed border-surface-border-subtle bg-base/40 p-4">
                <p className="mb-2 text-xs font-medium tracking-wide text-copy-faint uppercase">Future hooks</p>
                <p className="text-sm leading-relaxed text-copy-muted">
                  Prompt composer, run status, and architecture guidance will attach to this sidebar.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <CreateProjectDialog
        open={mode === 'create'}
        onOpenChange={(open) => {
          if (!open) close();
        }}
        name={name}
        roomId={roomId}
        isLoading={isLoading}
        onNameChange={setName}
        onSubmit={handleSubmit}
      />

      <RenameProjectDialog
        open={mode === 'rename'}
        onOpenChange={(open) => {
          if (!open) close();
        }}
        currentName={activeProject?.name ?? ''}
        name={name}
        isLoading={isLoading}
        onNameChange={setName}
        onSubmit={handleSubmit}
      />

      <DeleteProjectDialog
        open={mode === 'delete'}
        onOpenChange={(open) => {
          if (!open) close();
        }}
        projectName={activeProject?.name ?? ''}
        isLoading={isLoading}
        onConfirm={handleSubmit}
      />

      <ShareProjectDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        projectId={project.id}
        isOwner={isOwner}
      />
    </div>
  );
}

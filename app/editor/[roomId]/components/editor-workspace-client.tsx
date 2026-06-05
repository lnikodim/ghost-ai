'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

import { EditorNavbar } from '@/components/editor/editor-navbar';
import { ProjectSidebar } from '@/components/editor/project-sidebar';
import { CreateProjectDialog } from '@/components/editor/create-project-dialog';
import { RenameProjectDialog } from '@/components/editor/rename-project-dialog';
import { DeleteProjectDialog } from '@/components/editor/delete-project-dialog';
import { Button } from '@/components/ui/button';
import { useProjectActions } from '@/hooks/use-project-actions';
import type { AccessibleProject } from '@/lib/project-access';
import type { Project } from '@/lib/projects';
import { cn } from '@/lib/utils';

interface EditorWorkspaceClientProps {
  project: AccessibleProject;
  ownedProjects: Project[];
  sharedProjects: Project[];
}

export function EditorWorkspaceClient({ project, ownedProjects, sharedProjects }: EditorWorkspaceClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);

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
          <main className="flex flex-1 items-center justify-center bg-base">
            <p className="text-sm text-copy-muted">Canvas coming soon</p>
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
              'fixed top-12 right-0 z-50 flex h-[calc(100dvh-3rem)] w-80 flex-col border-l border-surface-border bg-surface/95 backdrop-blur-sm transition-transform duration-300 ease-in-out',
              isAiSidebarOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none',
            )}
          >
            <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
              <h2 className="text-sm font-medium text-copy-primary">AI Assistant</h2>
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

            <div className="flex flex-1 items-center justify-center px-4">
              <p className="text-center text-sm text-copy-muted">AI chat coming soon</p>
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
    </div>
  );
}

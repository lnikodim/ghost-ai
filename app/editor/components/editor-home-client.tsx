'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { EditorNavbar } from '@/components/editor/editor-navbar';
import { ProjectSidebar } from '@/components/editor/project-sidebar';
import { CreateProjectDialog } from '@/components/editor/create-project-dialog';
import { RenameProjectDialog } from '@/components/editor/rename-project-dialog';
import { DeleteProjectDialog } from '@/components/editor/delete-project-dialog';
import { Button } from '@/components/ui/button';
import { useProjectActions } from '@/hooks/use-project-actions';
import type { Project } from '@/lib/projects';

interface EditorHomeClientProps {
  ownedProjects: Project[];
  sharedProjects: Project[];
}

export function EditorHomeClient({ ownedProjects, sharedProjects }: EditorHomeClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      <EditorNavbar isSidebarOpen={isSidebarOpen} onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onCreateProject={openCreate}
        onRenameProject={openRename}
        onDeleteProject={openDelete}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
      />

      <main className="flex flex-1 flex-col items-center justify-center gap-4 pt-12">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-lg font-medium text-copy-primary">Create a project or open an existing one</h1>
          <p className="max-w-sm text-sm text-copy-muted">
            Start a new architecture workspace, or choose a project from the sidebar
          </p>
        </div>
        <Button type="button" onClick={openCreate}>
          <Plus className="h-5 w-5" />
          New Project
        </Button>
      </main>

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

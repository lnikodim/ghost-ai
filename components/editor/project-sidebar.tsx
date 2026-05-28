'use client';

import { MoreHorizontal, Pencil, Plus, Trash2, X } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { Project } from '@/lib/projects';

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: () => void;
  onRenameProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
  ownedProjects: Project[];
  sharedProjects: Project[];
  className?: string;
}

interface ProjectItemProps {
  project: Project;
  onRename: (project: Project) => void;
  onDelete: (project: Project) => void;
}

function ProjectItem({ project, onRename, onDelete }: ProjectItemProps) {
  return (
    <div className="group flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-elevated">
      <span className="min-w-0 flex-1 truncate text-sm text-copy-secondary">{project.name}</span>

      {project.isOwner ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Actions for ${project.name}`}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
              'shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 data-popup-open:opacity-100',
            )}
          >
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={() => onRename(project)}>
              <Pencil className="h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(project)} variant="destructive">
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}

function EmptyTabPlaceholder({ message }: { message: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center">
      <p className="text-sm text-copy-muted">{message}</p>
    </div>
  );
}

export function ProjectSidebar({
  isOpen,
  onClose,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
  ownedProjects,
  sharedProjects,
  className,
}: ProjectSidebarProps) {
  return (
    <>
      {isOpen ? (
        <div aria-hidden="true" className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} />
      ) : null}

      <aside
        aria-hidden={!isOpen}
        className={cn(
          'fixed top-12 left-0 z-50 flex h-[calc(100dvh-3rem)] w-72 flex-col border-r border-surface-border bg-surface/95 backdrop-blur-sm transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none',
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
          <h2 className="text-sm font-medium text-copy-primary">Projects</h2>
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Close sidebar" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Tabs defaultValue="my-projects" className="flex min-h-0 flex-1 flex-col gap-0">
          <TabsList className="mx-4 mt-3 w-[calc(100%-2rem)]">
            <TabsTrigger value="my-projects">My Projects</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>

          <TabsContent value="my-projects" className="flex min-h-0 flex-1 flex-col data-[state=inactive]:hidden">
            {ownedProjects.length > 0 ? (
              <div className="flex flex-col gap-0.5 overflow-y-auto px-2 py-2">
                {ownedProjects.map((project) => (
                  <ProjectItem
                    key={project.id}
                    project={project}
                    onRename={onRenameProject}
                    onDelete={onDeleteProject}
                  />
                ))}
              </div>
            ) : (
              <EmptyTabPlaceholder message="No projects yet" />
            )}
          </TabsContent>

          <TabsContent value="shared" className="flex min-h-0 flex-1 flex-col data-[state=inactive]:hidden">
            {sharedProjects.length > 0 ? (
              <div className="flex flex-col gap-0.5 overflow-y-auto px-2 py-2">
                {sharedProjects.map((project) => (
                  <ProjectItem
                    key={project.id}
                    project={project}
                    onRename={onRenameProject}
                    onDelete={onDeleteProject}
                  />
                ))}
              </div>
            ) : (
              <EmptyTabPlaceholder message="No shared projects yet" />
            )}
          </TabsContent>
        </Tabs>

        <div className="border-t border-surface-border p-4">
          <Button type="button" className="w-full" onClick={onCreateProject}>
            <Plus className="h-5 w-5" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  );
}

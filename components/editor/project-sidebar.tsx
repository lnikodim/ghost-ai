'use client';

import { Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

function EmptyTabPlaceholder({ message }: { message: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center">
      <p className="text-sm text-copy-muted">{message}</p>
    </div>
  );
}

export function ProjectSidebar({ isOpen, onClose, className }: ProjectSidebarProps) {
  return (
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
          <EmptyTabPlaceholder message="No projects yet" />
        </TabsContent>

        <TabsContent value="shared" className="flex min-h-0 flex-1 flex-col data-[state=inactive]:hidden">
          <EmptyTabPlaceholder message="No shared projects yet" />
        </TabsContent>
      </Tabs>

      <div className="border-t border-surface-border p-4">
        <Button type="button" className="w-full">
          <Plus className="h-5 w-5" />
          New Project
        </Button>
      </div>
    </aside>
  );
}

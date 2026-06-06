'use client';

import { UserButton } from '@clerk/nextjs';
import { PanelLeftClose, PanelLeftOpen, Share2, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  projectName?: string;
  isAiSidebarOpen?: boolean;
  onToggleAiSidebar?: () => void;
  onShareClick?: () => void;
  className?: string;
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  projectName,
  isAiSidebarOpen = false,
  onToggleAiSidebar,
  onShareClick,
  className,
}: EditorNavbarProps) {
  const isWorkspace = Boolean(projectName);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 flex h-12 shrink-0 items-center border-b border-surface-border bg-surface',
        className,
      )}
    >
      <div className="flex flex-1 items-center px-3">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-expanded={isSidebarOpen}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          onClick={onToggleSidebar}
        >
          {isSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex flex-1 items-center justify-center px-3">
        {projectName ? (
          <div className="flex min-w-0 flex-col items-center text-center">
            <h1 className="truncate text-sm font-medium text-copy-primary">{projectName}</h1>
            <span className="text-xs text-copy-muted">Workspace</span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 items-center justify-end gap-1 px-3">
        {isWorkspace ? (
          <>
            <Button type="button" variant="ghost" size="sm" aria-label="Share project" onClick={onShareClick}>
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            {onToggleAiSidebar ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-expanded={isAiSidebarOpen}
                aria-label={isAiSidebarOpen ? 'Close AI sidebar' : 'Open AI sidebar'}
                className={cn(
                  isAiSidebarOpen && 'bg-brand text-primary-foreground hover:bg-brand/90 hover:text-primary-foreground',
                )}
                onClick={onToggleAiSidebar}
              >
                <Sparkles className="h-4 w-4" />
                AI
              </Button>
            ) : null}
          </>
        ) : null}
        <UserButton />
      </div>
    </header>
  );
}

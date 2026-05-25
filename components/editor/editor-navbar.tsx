'use client';

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  className?: string;
}

export function EditorNavbar({ isSidebarOpen, onToggleSidebar, className }: EditorNavbarProps) {
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

      <div className="flex flex-1 items-center justify-center" />

      <div className="flex flex-1 items-center justify-end px-3" />
    </header>
  );
}

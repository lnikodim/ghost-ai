'use client';

import type { ReactNode } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  footer: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function ProjectDialog({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
  className,
}: ProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          'gap-6 rounded-3xl border border-surface-border bg-elevated p-6 text-copy-primary ring-0 sm:max-w-md',
          className,
        )}
      >
        <DialogHeader className="gap-2 text-left">
          <DialogTitle className="text-base font-medium">
            <span className="text-copy-primary">{title}</span>
          </DialogTitle>

          {description ? <DialogDescription className="text-copy-muted">{description}</DialogDescription> : null}
        </DialogHeader>

        {children}

        <DialogFooter className="-mx-6 -mb-6 mt-0 flex-row justify-end gap-2 rounded-b-3xl border-t border-surface-border bg-subtle/50 px-6 py-4 sm:justify-end">
          {footer}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

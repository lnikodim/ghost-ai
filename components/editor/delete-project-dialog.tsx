'use client';

import { Button } from '@/components/ui/button';
import { ProjectDialog } from '@/components/editor/project-dialog';

interface DeleteProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  isLoading: boolean;
  onConfirm: () => void;
}

export function DeleteProjectDialog({
  open,
  onOpenChange,
  projectName,
  isLoading,
  onConfirm,
}: DeleteProjectDialogProps) {
  return (
    <ProjectDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete project"
      description={`"${projectName}" will be permanently deleted. This action cannot be undone.`}
      footer={
        <>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Deleting…' : 'Delete project'}
          </Button>
        </>
      }
    />
  );
}

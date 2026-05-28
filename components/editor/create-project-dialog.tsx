'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProjectDialog } from '@/components/editor/project-dialog';

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  roomId: string;
  isLoading: boolean;
  onNameChange: (value: string) => void;
  onSubmit: () => void;
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  name,
  roomId,
  isLoading,
  onNameChange,
  onSubmit,
}: CreateProjectDialogProps) {
  return (
    <ProjectDialog
      open={open}
      onOpenChange={onOpenChange}
      title="New project"
      description="Give your architecture workspace a name."
      footer={
        <>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="button" onClick={onSubmit} disabled={!name.trim() || isLoading}>
            {isLoading ? 'Creating…' : 'Create project'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <Input
          autoFocus
          placeholder="Project name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && name.trim()) onSubmit();
          }}
        />
        {name.trim() ? (
          <p className="text-xs text-copy-muted">
            Room ID: <span className="font-mono text-copy-secondary">{roomId || '—'}</span>
          </p>
        ) : null}
      </div>
    </ProjectDialog>
  );
}

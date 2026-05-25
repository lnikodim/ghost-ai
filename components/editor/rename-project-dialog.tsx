'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProjectDialog } from '@/components/editor/project-dialog';

interface RenameProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  name: string;
  isLoading: boolean;
  onNameChange: (value: string) => void;
  onSubmit: () => void;
}

export function RenameProjectDialog({
  open,
  onOpenChange,
  currentName,
  name,
  isLoading,
  onNameChange,
  onSubmit,
}: RenameProjectDialogProps) {
  return (
    <ProjectDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Rename project"
      description={`Renaming "${currentName}"`}
      footer={
        <>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="button" onClick={onSubmit} disabled={!name.trim() || isLoading}>
            {isLoading ? 'Saving…' : 'Save'}
          </Button>
        </>
      }
    >
      <Input
        autoFocus
        placeholder="Project name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && name.trim()) onSubmit();
        }}
      />
    </ProjectDialog>
  );
}

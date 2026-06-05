'use client';

import { Check, Link2, Loader2, UserRound, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useShareDialog } from '@/hooks/use-share-dialog';
import { cn } from '@/lib/utils';

interface ShareProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  isOwner: boolean;
}

function CollaboratorAvatar({ name, imageUrl }: { name: string; imageUrl: string | null }) {
  if (imageUrl) {
    return <img src={imageUrl} alt={name} className="size-8 shrink-0 rounded-full object-cover" />;
  }

  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-subtle text-copy-muted">
      <UserRound className="size-4" />
    </div>
  );
}

export function ShareProjectDialog({ open, onOpenChange, projectId, isOwner }: ShareProjectDialogProps) {
  const {
    collaborators,
    inviteEmail,
    isLoadingList,
    isInviting,
    isRemovingEmail,
    error,
    isCopied,
    setInviteEmail,
    inviteCollaborator,
    removeCollaborator,
    copyProjectLink,
  } = useShareDialog(projectId, open);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-5 rounded-3xl border border-surface-border bg-elevated p-6 text-copy-primary ring-0 sm:max-w-md"
      >
        <DialogHeader className="gap-2 text-left">
          <DialogTitle className="text-base font-medium text-copy-primary">Share project</DialogTitle>
          <DialogDescription className="text-copy-muted">
            {isOwner
              ? 'Invite collaborators by email or copy a link to this workspace.'
              : 'People with access to this workspace.'}
          </DialogDescription>
        </DialogHeader>

        {isOwner ? (
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Email address"
              value={inviteEmail}
              disabled={isInviting}
              onChange={(event) => setInviteEmail(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && inviteEmail.trim()) {
                  void inviteCollaborator();
                }
              }}
            />
            <Button
              type="button"
              disabled={!inviteEmail.trim() || isInviting}
              onClick={() => void inviteCollaborator()}
            >
              {isInviting ? 'Inviting…' : 'Invite'}
            </Button>
          </div>
        ) : null}

        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-copy-muted">Collaborators</p>

          {isLoadingList ? (
            <div className="flex items-center justify-center py-6 text-copy-muted">
              <Loader2 className="size-5 animate-spin" />
            </div>
          ) : collaborators.length === 0 ? (
            <p className="py-2 text-sm text-copy-muted">No collaborators yet.</p>
          ) : (
            <ul className="flex max-h-56 flex-col gap-1 overflow-y-auto">
              {collaborators.map((collaborator) => {
                const label = collaborator.displayName ?? collaborator.email;
                const isRemoving = isRemovingEmail === collaborator.email;

                return (
                  <li key={collaborator.id} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-subtle/60">
                    <CollaboratorAvatar name={label} imageUrl={collaborator.imageUrl} />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-copy-primary">{label}</p>
                      {collaborator.displayName ? (
                        <p className="truncate text-xs text-copy-muted">{collaborator.email}</p>
                      ) : null}
                    </div>

                    {isOwner ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Remove ${collaborator.email}`}
                        disabled={isRemoving}
                        onClick={() => void removeCollaborator(collaborator.email)}
                      >
                        {isRemoving ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
                      </Button>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {error ? <p className="text-sm text-state-error">{error}</p> : null}

        <Button
          type="button"
          variant="outline"
          className={cn('w-full', isCopied && 'border-state-success/40 text-state-success')}
          onClick={() => void copyProjectLink()}
        >
          {isCopied ? (
            <>
              <Check className="size-4" />
              Copied!
            </>
          ) : (
            <>
              <Link2 className="size-4" />
              Copy project link
            </>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

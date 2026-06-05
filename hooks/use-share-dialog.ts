'use client';

import { useCallback, useEffect, useState } from 'react';

import type { EnrichedCollaborator } from '@/lib/collaborators';

interface ShareDialogState {
  collaborators: EnrichedCollaborator[];
  inviteEmail: string;
  isLoadingList: boolean;
  isInviting: boolean;
  isRemovingEmail: string | null;
  error: string | null;
  isCopied: boolean;
}

const initialState: ShareDialogState = {
  collaborators: [],
  inviteEmail: '',
  isLoadingList: false,
  isInviting: false,
  isRemovingEmail: null,
  error: null,
  isCopied: false,
};

export function useShareDialog(projectId: string, open: boolean) {
  const [state, setState] = useState<ShareDialogState>(initialState);

  const loadCollaborators = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoadingList: true, error: null }));

    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`);
      if (!res.ok) {
        throw new Error('Failed to load collaborators');
      }

      const data = (await res.json()) as { collaborators: EnrichedCollaborator[] };
      setState((prev) => ({ ...prev, collaborators: data.collaborators, isLoadingList: false }));
    } catch {
      setState((prev) => ({
        ...prev,
        isLoadingList: false,
        error: 'Unable to load collaborators. Please try again.',
      }));
    }
  }, [projectId]);

  useEffect(() => {
    if (!open) {
      setState(initialState);
      return;
    }

    void loadCollaborators();
  }, [open, loadCollaborators]);

  const setInviteEmail = useCallback((inviteEmail: string) => {
    setState((prev) => ({ ...prev, inviteEmail, error: null }));
  }, []);

  const inviteCollaborator = useCallback(async () => {
    const email = state.inviteEmail.trim();
    if (!email) return;

    setState((prev) => ({ ...prev, isInviting: true, error: null }));

    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string; collaborator?: EnrichedCollaborator };

      if (!res.ok) {
        setState((prev) => ({
          ...prev,
          isInviting: false,
          error: data.error ?? 'Failed to invite collaborator',
        }));
        return;
      }

      if (!data.collaborator) {
        setState((prev) => ({ ...prev, isInviting: false, error: 'Failed to invite collaborator' }));
        return;
      }

      setState((prev) => ({
        ...prev,
        collaborators: [...prev.collaborators, data.collaborator!],
        inviteEmail: '',
        isInviting: false,
        error: null,
      }));
    } catch {
      setState((prev) => ({ ...prev, isInviting: false, error: 'Failed to invite collaborator' }));
    }
  }, [projectId, state.inviteEmail]);

  const removeCollaborator = useCallback(
    async (email: string) => {
      setState((prev) => ({ ...prev, isRemovingEmail: email, error: null }));

      try {
        const res = await fetch(`/api/projects/${projectId}/collaborators`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          setState((prev) => ({
            ...prev,
            isRemovingEmail: null,
            error: data.error ?? 'Failed to remove collaborator',
          }));
          return;
        }

        setState((prev) => ({
          ...prev,
          collaborators: prev.collaborators.filter((collaborator) => collaborator.email !== email),
          isRemovingEmail: null,
          error: null,
        }));
      } catch {
        setState((prev) => ({ ...prev, isRemovingEmail: null, error: 'Failed to remove collaborator' }));
      }
    },
    [projectId],
  );

  const copyProjectLink = useCallback(async () => {
    const url = `${window.location.origin}/editor/${projectId}`;

    try {
      await navigator.clipboard.writeText(url);
      setState((prev) => ({ ...prev, isCopied: true, error: null }));

      window.setTimeout(() => {
        setState((prev) => ({ ...prev, isCopied: false }));
      }, 2000);
    } catch {
      setState((prev) => ({ ...prev, error: 'Unable to copy link. Please try again.' }));
    }
  }, [projectId]);

  return {
    collaborators: state.collaborators,
    inviteEmail: state.inviteEmail,
    isLoadingList: state.isLoadingList,
    isInviting: state.isInviting,
    isRemovingEmail: state.isRemovingEmail,
    error: state.error,
    isCopied: state.isCopied,
    setInviteEmail,
    inviteCollaborator,
    removeCollaborator,
    copyProjectLink,
  };
}

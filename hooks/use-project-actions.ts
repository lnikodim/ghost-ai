'use client';

import { useCallback, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import type { Project } from '@/lib/projects';

export type DialogMode = 'create' | 'rename' | 'delete' | null;

interface ProjectActionsState {
  mode: DialogMode;
  activeProject: Project | null;
  name: string;
  suffix: string;
  isLoading: boolean;
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function generateSuffix(): string {
  return Math.random().toString(36).slice(2, 8);
}

export function useProjectActions() {
  const router = useRouter();
  const pathname = usePathname();

  const [state, setState] = useState<ProjectActionsState>({
    mode: null,
    activeProject: null,
    name: '',
    suffix: '',
    isLoading: false,
  });

  const openCreate = useCallback(() => {
    setState({ mode: 'create', activeProject: null, name: '', suffix: generateSuffix(), isLoading: false });
  }, []);

  const openRename = useCallback((project: Project) => {
    setState({ mode: 'rename', activeProject: project, name: project.name, suffix: '', isLoading: false });
  }, []);

  const openDelete = useCallback((project: Project) => {
    setState({ mode: 'delete', activeProject: project, name: '', suffix: '', isLoading: false });
  }, []);

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, mode: null, isLoading: false }));
  }, []);

  const setName = useCallback((name: string) => {
    setState((prev) => ({ ...prev, name }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    const { mode, activeProject, name, suffix } = state;

    try {
      if (mode === 'create') {
        const slug = toSlug(name);
        const roomId = slug ? `${slug}-${suffix}` : suffix;

        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim() || 'Untitled Project', id: roomId }),
        });

        if (!res.ok) throw new Error('Failed to create project');
        const data = (await res.json()) as { project: { id: string } };
        setState({ mode: null, activeProject: null, name: '', suffix: '', isLoading: false });
        router.push(`/editor/${data.project.id}`);
        return;
      }

      if (mode === 'rename' && activeProject) {
        const res = await fetch(`/api/projects/${activeProject.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim() }),
        });

        if (!res.ok) throw new Error('Failed to rename project');
        setState({ mode: null, activeProject: null, name: '', suffix: '', isLoading: false });
        router.refresh();
        return;
      }

      if (mode === 'delete' && activeProject) {
        const res = await fetch(`/api/projects/${activeProject.id}`, { method: 'DELETE' });

        if (!res.ok) throw new Error('Failed to delete project');

        const isActiveWorkspace = pathname === `/editor/${activeProject.id}`;
        setState({ mode: null, activeProject: null, name: '', suffix: '', isLoading: false });

        if (isActiveWorkspace) {
          router.push('/editor');
        } else {
          router.refresh();
        }
        return;
      }
    } catch {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [state, router, pathname]);

  const slug = toSlug(state.name);
  const roomId = slug ? `${slug}-${state.suffix}` : state.suffix;

  return {
    mode: state.mode,
    activeProject: state.activeProject,
    name: state.name,
    slug,
    roomId,
    isLoading: state.isLoading,
    openCreate,
    openRename,
    openDelete,
    close,
    setName,
    handleSubmit,
  };
}

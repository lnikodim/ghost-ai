'use client';

import { useCallback, useState } from 'react';

import type { MockProject } from '@/lib/mock-projects';

export type DialogMode = 'create' | 'rename' | 'delete' | null;

interface ProjectDialogsState {
  mode: DialogMode;
  activeProject: MockProject | null;
  name: string;
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

export function useProjectDialogs() {
  const [state, setState] = useState<ProjectDialogsState>({
    mode: null,
    activeProject: null,
    name: '',
    isLoading: false,
  });

  const openCreate = useCallback(() => {
    setState({ mode: 'create', activeProject: null, name: '', isLoading: false });
  }, []);

  const openRename = useCallback((project: MockProject) => {
    setState({ mode: 'rename', activeProject: project, name: project.name, isLoading: false });
  }, []);

  const openDelete = useCallback((project: MockProject) => {
    setState({ mode: 'delete', activeProject: project, name: '', isLoading: false });
  }, []);

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, mode: null, isLoading: false }));
  }, []);

  const setName = useCallback((name: string) => {
    setState((prev) => ({ ...prev, name }));
  }, []);

  const handleSubmit = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true }));
    setTimeout(() => {
      setState((prev) => ({ ...prev, mode: null, isLoading: false }));
    }, 600);
  }, []);

  const slug = toSlug(state.name);

  return {
    mode: state.mode,
    activeProject: state.activeProject,
    name: state.name,
    slug,
    isLoading: state.isLoading,
    openCreate,
    openRename,
    openDelete,
    close,
    setName,
    handleSubmit,
  };
}

import { redirect } from 'next/navigation';

import { AccessDenied } from '@/components/editor/access-denied';
import { getCurrentClerkIdentity, getProjectAccess } from '@/lib/project-access';
import { getProjectsForUser } from '@/lib/projects';

import { EditorWorkspaceClient } from './components/editor-workspace-client';

type EditorWorkspacePageProps = {
  params: Promise<{ roomId: string }>;
};

export default async function EditorWorkspacePage({ params }: EditorWorkspacePageProps) {
  const { roomId } = await params;
  const identity = await getCurrentClerkIdentity();

  if (!identity) {
    redirect('/sign-in');
  }

  const access = await getProjectAccess(roomId, identity);

  if (access.status !== 'granted') {
    return <AccessDenied />;
  }

  const { owned, shared } = await getProjectsForUser();

  return <EditorWorkspaceClient project={access.project} ownedProjects={owned} sharedProjects={shared} />;
}

import { auth, currentUser } from '@clerk/nextjs/server';

import { prisma } from './prisma';

export interface ClerkIdentity {
  userId: string;
  email: string | null;
}

export interface AccessibleProject {
  id: string;
  name: string;
}

export type ProjectAccessResult =
  | { status: 'granted'; project: AccessibleProject }
  | { status: 'not_found' }
  | { status: 'denied' };

export async function getCurrentClerkIdentity(): Promise<ClerkIdentity | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress ?? null;

  return { userId, email };
}

export async function getProjectAccess(projectId: string, identity: ClerkIdentity): Promise<ProjectAccessResult> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, name: true, ownerId: true },
  });

  if (!project) {
    return { status: 'not_found' };
  }

  if (project.ownerId === identity.userId) {
    return { status: 'granted', project: { id: project.id, name: project.name } };
  }

  if (identity.email) {
    const collaborator = await prisma.projectCollaborator.findUnique({
      where: { projectId_email: { projectId, email: identity.email } },
    });

    if (collaborator) {
      return { status: 'granted', project: { id: project.id, name: project.name } };
    }
  }

  return { status: 'denied' };
}

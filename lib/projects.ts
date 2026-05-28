import { auth, currentUser } from '@clerk/nextjs/server';

import { prisma } from './prisma';

export interface Project {
  id: string;
  name: string;
  isOwner: boolean;
}

export async function getProjectsForUser(): Promise<{ owned: Project[]; shared: Project[] }> {
  const { userId } = await auth();
  if (!userId) return { owned: [], shared: [] };

  const ownedRaw = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, name: true },
  });

  const owned: Project[] = ownedRaw.map((p) => ({ ...p, isOwner: true }));

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  if (!email) return { owned, shared: [] };

  const sharedCollabs = await prisma.projectCollaborator.findMany({
    where: { email },
    select: { project: { select: { id: true, name: true } } },
  });

  const shared: Project[] = sharedCollabs.map((c) => ({ id: c.project.id, name: c.project.name, isOwner: false }));

  return { owned, shared };
}

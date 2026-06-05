import { clerkClient } from '@clerk/nextjs/server';

import { getCurrentClerkIdentity, getProjectAccess } from './project-access';
import { prisma } from './prisma';

export interface EnrichedCollaborator {
  id: string;
  email: string;
  displayName: string | null;
  imageUrl: string | null;
  createdAt: string;
}

interface CollaboratorRecord {
  id: string;
  email: string;
  createdAt: Date;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email);
}

function getDisplayName(user: {
  firstName: string | null;
  lastName: string | null;
  username: string | null;
}): string | null {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  if (fullName) return fullName;
  if (user.username) return user.username;
  return null;
}

async function enrichCollaborators(records: CollaboratorRecord[]): Promise<EnrichedCollaborator[]> {
  if (records.length === 0) return [];

  const client = await clerkClient();
  const emails = records.map((record) => record.email);

  let usersByEmail = new Map<
    string,
    { firstName: string | null; lastName: string | null; username: string | null; imageUrl: string }
  >();

  try {
    const response = await client.users.getUserList({ emailAddress: emails, limit: 500 });
    usersByEmail = new Map(
      response.data.flatMap((user) =>
        user.emailAddresses.map((address) => [
          address.emailAddress.toLowerCase(),
          {
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            imageUrl: user.imageUrl,
          },
        ]),
      ),
    );
  } catch {
    // Fall back to email-only display when Clerk lookup fails.
  }

  return records.map((record) => {
    const clerkUser = usersByEmail.get(record.email.toLowerCase());

    return {
      id: record.id,
      email: record.email,
      displayName: clerkUser ? getDisplayName(clerkUser) : null,
      imageUrl: clerkUser?.imageUrl ?? null,
      createdAt: record.createdAt.toISOString(),
    };
  });
}

export async function listProjectCollaborators(
  projectId: string,
): Promise<{ ok: true; collaborators: EnrichedCollaborator[] } | { ok: false; status: 401 | 403 | 404 }> {
  const identity = await getCurrentClerkIdentity();
  if (!identity) {
    return { ok: false, status: 401 };
  }

  const access = await getProjectAccess(projectId, identity);
  if (access.status === 'not_found') {
    return { ok: false, status: 404 };
  }
  if (access.status === 'denied') {
    return { ok: false, status: 403 };
  }

  const records = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: 'asc' },
    select: { id: true, email: true, createdAt: true },
  });

  const collaborators = await enrichCollaborators(records);

  return { ok: true, collaborators };
}

export async function inviteProjectCollaborator(
  projectId: string,
  rawEmail: string,
): Promise<
  { ok: true; collaborator: EnrichedCollaborator } | { ok: false; status: 400 | 401 | 403 | 404 | 409; error: string }
> {
  const identity = await getCurrentClerkIdentity();
  if (!identity) {
    return { ok: false, status: 401, error: 'Unauthorized' };
  }

  const email = normalizeEmail(rawEmail);
  if (!isValidEmail(email)) {
    return { ok: false, status: 400, error: 'A valid email address is required' };
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, ownerId: true },
  });

  if (!project) {
    return { ok: false, status: 404, error: 'Not found' };
  }

  if (project.ownerId !== identity.userId) {
    return { ok: false, status: 403, error: 'Forbidden' };
  }

  if (identity.email && normalizeEmail(identity.email) === email) {
    return { ok: false, status: 400, error: 'You cannot invite yourself' };
  }

  const existing = await prisma.projectCollaborator.findUnique({
    where: { projectId_email: { projectId, email } },
  });

  if (existing) {
    return { ok: false, status: 409, error: 'This collaborator has already been invited' };
  }

  const record = await prisma.projectCollaborator.create({
    data: { projectId, email },
    select: { id: true, email: true, createdAt: true },
  });

  const [collaborator] = await enrichCollaborators([record]);

  return { ok: true, collaborator };
}

export async function removeProjectCollaborator(
  projectId: string,
  rawEmail: string,
): Promise<{ ok: true } | { ok: false; status: 400 | 401 | 403 | 404; error: string }> {
  const identity = await getCurrentClerkIdentity();
  if (!identity) {
    return { ok: false, status: 401, error: 'Unauthorized' };
  }

  const email = normalizeEmail(rawEmail);
  if (!isValidEmail(email)) {
    return { ok: false, status: 400, error: 'A valid email address is required' };
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, ownerId: true },
  });

  if (!project) {
    return { ok: false, status: 404, error: 'Not found' };
  }

  if (project.ownerId !== identity.userId) {
    return { ok: false, status: 403, error: 'Forbidden' };
  }

  const existing = await prisma.projectCollaborator.findUnique({
    where: { projectId_email: { projectId, email } },
  });

  if (!existing) {
    return { ok: false, status: 404, error: 'Collaborator not found' };
  }

  await prisma.projectCollaborator.delete({ where: { id: existing.id } });

  return { ok: true };
}

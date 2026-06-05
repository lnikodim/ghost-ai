import type { NextRequest } from 'next/server';

import { inviteProjectCollaborator, listProjectCollaborators, removeProjectCollaborator } from '@/lib/collaborators';

type RouteContext = { params: Promise<{ projectId: string }> };

export async function GET(_request: NextRequest, ctx: RouteContext) {
  const { projectId } = await ctx.params;
  const result = await listProjectCollaborators(projectId);

  if (!result.ok) {
    return Response.json(
      { error: result.status === 404 ? 'Not found' : result.status === 403 ? 'Forbidden' : 'Unauthorized' },
      { status: result.status },
    );
  }

  return Response.json({ collaborators: result.collaborators });
}

export async function POST(request: NextRequest, ctx: RouteContext) {
  const { projectId } = await ctx.params;
  const body = await request.json().catch(() => ({}));
  const email = typeof body?.email === 'string' ? body.email : '';

  const result = await inviteProjectCollaborator(projectId, email);

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status });
  }

  return Response.json({ collaborator: result.collaborator }, { status: 201 });
}

export async function DELETE(request: NextRequest, ctx: RouteContext) {
  const { projectId } = await ctx.params;
  const body = await request.json().catch(() => ({}));
  const email = typeof body?.email === 'string' ? body.email : '';

  const result = await removeProjectCollaborator(projectId, email);

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status });
  }

  return new Response(null, { status: 204 });
}

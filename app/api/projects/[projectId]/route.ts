import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import type { NextRequest } from 'next/server';

type RouteContext = { params: Promise<{ projectId: string }> };

export async function PATCH(request: NextRequest, ctx: RouteContext) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { projectId } = await ctx.params;
  const body = await request.json().catch(() => ({}));
  const name: string | undefined = typeof body?.name === 'string' && body.name.trim() ? body.name.trim() : undefined;

  if (!name) {
    return Response.json({ error: 'name is required' }, { status: 400 });
  }

  const existing = await prisma.project.findUnique({ where: { id: projectId } });
  if (!existing) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }
  if (existing.ownerId !== userId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const project = await prisma.project.update({
    where: { id: projectId },
    data: { name },
  });

  return Response.json({ project });
}

export async function DELETE(_request: NextRequest, ctx: RouteContext) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { projectId } = await ctx.params;

  const existing = await prisma.project.findUnique({ where: { id: projectId } });
  if (!existing) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }
  if (existing.ownerId !== userId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  await prisma.project.delete({ where: { id: projectId } });

  return new Response(null, { status: 204 });
}

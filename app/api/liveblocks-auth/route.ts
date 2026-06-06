import { currentUser } from '@clerk/nextjs/server';

import { ensureLiveblocksRoom, getLiveblocks, getUserCursorColor } from '@/lib/liveblocks';
import { getCurrentClerkIdentity, getProjectAccess } from '@/lib/project-access';

function getDisplayName(user: { firstName: string | null; lastName: string | null; username: string | null }): string {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  if (fullName) return fullName;
  if (user.username) return user.username;
  return 'Anonymous';
}

function liveblocksAuthError(reason: string, status = 500): Response {
  return Response.json({ error: 'forbidden', reason }, { status });
}

export async function POST(request: Request) {
  if (!process.env.LIVEBLOCKS_SECRET_KEY) {
    console.error('[liveblocks-auth] LIVEBLOCKS_SECRET_KEY is not set');
    return liveblocksAuthError('Liveblocks is not configured on the server');
  }

  try {
    const identity = await getCurrentClerkIdentity();
    if (!identity) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const room = typeof body?.room === 'string' ? body.room : null;

    if (!room) {
      return Response.json({ error: 'room is required' }, { status: 400 });
    }

    const access = await getProjectAccess(room, identity);

    if (access.status === 'not_found') {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }

    if (access.status === 'denied') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    await ensureLiveblocksRoom(room, identity.userId);

    const user = await currentUser();
    const name = user
      ? getDisplayName({
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
        })
      : 'Anonymous';
    const avatar = user?.imageUrl ?? '';
    const color = getUserCursorColor(identity.userId);

    const { status, body: tokenBody } = await getLiveblocks().identifyUser(identity.userId, {
      userInfo: {
        name,
        avatar,
        color,
      },
    });

    if (status >= 400) {
      console.error('[liveblocks-auth] identifyUser failed:', status, tokenBody);
      return liveblocksAuthError('Failed to issue Liveblocks session token', status);
    }

    return new Response(tokenBody, { status });
  } catch (error) {
    console.error('[liveblocks-auth] Unexpected error:', error);
    return liveblocksAuthError('Failed to authenticate with Liveblocks');
  }
}

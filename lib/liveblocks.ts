import { Liveblocks } from '@liveblocks/node';

const globalForLiveblocks = globalThis as unknown as {
  liveblocks: Liveblocks | undefined;
};

const CURSOR_COLORS = [
  '#E53E3E',
  '#DD6B20',
  '#D69E2E',
  '#38A169',
  '#319795',
  '#3182CE',
  '#805AD5',
  '#D53F8C',
  '#00B5D8',
  '#667EEA',
] as const;

function createLiveblocksClient(): Liveblocks {
  const secret = process.env.LIVEBLOCKS_SECRET_KEY;
  if (!secret) {
    throw new Error('LIVEBLOCKS_SECRET_KEY is not set');
  }

  return new Liveblocks({ secret });
}

export function getLiveblocks(): Liveblocks {
  if (!globalForLiveblocks.liveblocks) {
    globalForLiveblocks.liveblocks = createLiveblocksClient();
  }

  return globalForLiveblocks.liveblocks;
}

export function getUserCursorColor(userId: string): string {
  let hash = 0;

  for (let index = 0; index < userId.length; index += 1) {
    hash = userId.charCodeAt(index) + ((hash << 5) - hash);
  }

  const colorIndex = Math.abs(hash) % CURSOR_COLORS.length;
  return CURSOR_COLORS[colorIndex];
}

export async function ensureLiveblocksRoom(roomId: string, userId: string): Promise<void> {
  const liveblocks = getLiveblocks();

  await liveblocks.getOrCreateRoom(roomId, {
    defaultAccesses: [],
    usersAccesses: {
      [userId]: ['room:write'],
    },
  });

  await liveblocks.updateRoom(roomId, {
    usersAccesses: {
      [userId]: ['room:write'],
    },
  });
}

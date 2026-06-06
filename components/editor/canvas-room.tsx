'use client';

import { LiveMap, LiveObject } from '@liveblocks/client';
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from '@liveblocks/react/suspense';
import { ErrorBoundary } from 'react-error-boundary';

import { Canvas } from '@/components/editor/canvas';

interface CanvasRoomProps {
  roomId: string;
}

function CanvasLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-base">
      <p className="text-sm text-copy-muted">Loading canvas…</p>
    </div>
  );
}

function CanvasError() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-base">
      <p className="text-sm text-copy-muted">Unable to connect to the canvas.</p>
    </div>
  );
}

export function CanvasRoom({ roomId }: CanvasRoomProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth" badgeLocation="bottom-left">
      <RoomProvider
        id={roomId}
        initialPresence={{
          cursor: null,
          isThinking: false,
        }}
        initialStorage={{
          flow: new LiveObject({
            nodes: new LiveMap(),
            edges: new LiveMap(),
          }),
        }}
      >
        <ErrorBoundary fallback={<CanvasError />}>
          <ClientSideSuspense fallback={<CanvasLoading />}>
            <Canvas />
          </ClientSideSuspense>
        </ErrorBoundary>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

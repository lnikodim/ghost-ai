'use client';

import { useCallback, type DragEvent } from 'react';
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import { Cursors, useLiveblocksFlow } from '@liveblocks/react-flow';
import '@xyflow/react/dist/style.css';
import '@liveblocks/react-flow/styles.css';

import { CanvasNode as CanvasNodeComponent } from '@/components/editor/canvas-node';
import { ShapePanel } from '@/components/editor/shape-panel';
import {
  createCanvasNodeId,
  DEFAULT_NODE_COLOR,
  parseShapeDragPayload,
  SHAPE_DRAG_MIME,
  type CanvasEdge,
  type CanvasNode,
} from '@/types/canvas';

const nodeTypes = {
  canvasNode: CanvasNodeComponent,
};

function CanvasFlow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } = useLiveblocksFlow<CanvasNode, CanvasEdge>(
    {
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    },
  );

  const { screenToFlowPosition } = useReactFlow();

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    if (!event.dataTransfer.types.includes(SHAPE_DRAG_MIME)) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const payload = parseShapeDragPayload(event.dataTransfer.getData(SHAPE_DRAG_MIME));
      if (!payload) {
        return;
      }

      const flowPosition = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: CanvasNode = {
        id: createCanvasNodeId(payload.shape),
        type: 'canvasNode',
        position: {
          x: flowPosition.x - payload.width / 2,
          y: flowPosition.y - payload.height / 2,
        },
        width: payload.width,
        height: payload.height,
        data: {
          label: '',
          color: DEFAULT_NODE_COLOR,
          shape: payload.shape,
        },
      };

      onNodesChange([
        {
          type: 'add',
          item: newNode,
        },
      ]);
    },
    [onNodesChange, screenToFlowPosition],
  );

  return (
    <div className="relative h-full w-full" onDragOver={handleDragOver} onDrop={handleDrop}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        connectionMode={ConnectionMode.Loose}
        fitView
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          bgColor="var(--bg-base)"
          color="var(--border-subtle)"
        />
        <Cursors />
        <MiniMap
          pannable
          zoomable
          nodeColor={(node) => (node.data as CanvasNode['data']).color}
          maskColor="rgba(8, 8, 9, 0.75)"
          style={{ bottom: 72, right: 12, width: 140, height: 96 }}
        />
      </ReactFlow>
      <ShapePanel />
    </div>
  );
}

export function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasFlow />
    </ReactFlowProvider>
  );
}

'use client';

import { NodeShape } from '@/components/editor/node-shape';
import { DEFAULT_NODE_COLOR, type NodeShape as NodeShapeType } from '@/types/canvas';

export interface ShapeDragPreviewState {
  shape: NodeShapeType;
  width: number;
  height: number;
  x: number;
  y: number;
}

interface ShapeDragPreviewProps {
  preview: ShapeDragPreviewState;
}

export function ShapeDragPreview({ preview }: ShapeDragPreviewProps) {
  return (
    <div
      className="pointer-events-none fixed z-50 opacity-80"
      style={{
        left: preview.x,
        top: preview.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <NodeShape shape={preview.shape} width={preview.width} height={preview.height} fill={DEFAULT_NODE_COLOR} />
    </div>
  );
}

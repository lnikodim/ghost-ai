'use client';

import type { NodeProps } from '@xyflow/react';

import { NodeShape } from '@/components/editor/node-shape';
import type { CanvasNode } from '@/types/canvas';

export function CanvasNode({ data, width, height, selected }: NodeProps<CanvasNode>) {
  const nodeWidth = width ?? 160;
  const nodeHeight = height ?? 80;

  return (
    <NodeShape
      shape={data.shape}
      width={nodeWidth}
      height={nodeHeight}
      fill={data.color}
      label={data.label || undefined}
      selected={selected}
    />
  );
}

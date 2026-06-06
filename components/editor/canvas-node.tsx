'use client';

import type { NodeProps } from '@xyflow/react';

import { getNodeTextColor, type CanvasNode } from '@/types/canvas';

export function CanvasNode({ data, width, height }: NodeProps<CanvasNode>) {
  const nodeWidth = width ?? 160;
  const nodeHeight = height ?? 80;
  const textColor = getNodeTextColor(data.color);

  return (
    <div
      className="flex items-center justify-center rounded-xl border border-surface-border"
      style={{
        width: nodeWidth,
        height: nodeHeight,
        backgroundColor: data.color,
        color: textColor,
      }}
    >
      {data.label ? <span className="px-2 text-center text-sm">{data.label}</span> : null}
    </div>
  );
}

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { NodeResizer, useReactFlow, type NodeProps } from '@xyflow/react';

import { NodeShape } from '@/components/editor/node-shape';
import {
  getNodeTextColor,
  NODE_LABEL_PLACEHOLDER,
  NODE_MIN_HEIGHT,
  NODE_MIN_WIDTH,
  type CanvasNode,
} from '@/types/canvas';

export function CanvasNode({ id, data, width, height, selected }: NodeProps<CanvasNode>) {
  const nodeWidth = width ?? 160;
  const nodeHeight = height ?? 80;
  const { updateNodeData } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textColor = getNodeTextColor(data.color);

  const closeEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleLabelDoubleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleLabelChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNodeData(id, { label: event.target.value });
    },
    [id, updateNodeData],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        closeEditing();
      }
    },
    [closeEditing],
  );

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.focus();
    textarea.select();
  }, [isEditing]);

  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={NODE_MIN_WIDTH}
        minHeight={NODE_MIN_HEIGHT}
        color="var(--accent-primary)"
      />
      <div className="relative" style={{ width: nodeWidth, height: nodeHeight }}>
        <NodeShape
          shape={data.shape}
          width={nodeWidth}
          height={nodeHeight}
          fill={data.color}
          label={isEditing ? undefined : data.label || undefined}
          placeholder={isEditing || data.label ? undefined : NODE_LABEL_PLACEHOLDER}
          selected={selected}
        />
        {!isEditing ? (
          <div className="absolute inset-0 flex items-center justify-center" onDoubleClick={handleLabelDoubleClick} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <textarea
              ref={textareaRef}
              value={data.label}
              onChange={handleLabelChange}
              onBlur={closeEditing}
              onKeyDown={handleKeyDown}
              onPointerDown={(event) => event.stopPropagation()}
              onMouseDown={(event) => event.stopPropagation()}
              className="nodrag nopan nowheel max-h-full w-full resize-none overflow-hidden bg-transparent px-2 text-center text-sm outline-none"
              style={{ color: textColor }}
              rows={1}
              aria-label="Node label"
            />
          </div>
        )}
      </div>
    </>
  );
}

'use client';

import type { DragEvent } from 'react';
import { Circle, Cylinder, Diamond, Hexagon, Pill, RectangleHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  NODE_SHAPES,
  SHAPE_DEFAULT_SIZES,
  SHAPE_DRAG_MIME,
  type NodeShape,
  type ShapeDragPayload,
} from '@/types/canvas';

const SHAPE_ICONS: Record<NodeShape, typeof Circle> = {
  rectangle: RectangleHorizontal,
  diamond: Diamond,
  circle: Circle,
  pill: Pill,
  cylinder: Cylinder,
  hexagon: Hexagon,
};

function handleShapeDragStart(event: DragEvent<HTMLButtonElement>, shape: NodeShape) {
  const size = SHAPE_DEFAULT_SIZES[shape];
  const payload: ShapeDragPayload = {
    shape,
    width: size.width,
    height: size.height,
  };

  event.dataTransfer.setData(SHAPE_DRAG_MIME, JSON.stringify(payload));
  event.dataTransfer.effectAllowed = 'move';
}

export function ShapePanel() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-surface-border bg-surface/95 px-2 py-1.5 shadow-xl backdrop-blur-sm">
        {NODE_SHAPES.map((shape) => {
          const Icon = SHAPE_ICONS[shape];

          return (
            <Button
              key={shape}
              type="button"
              variant="ghost"
              size="icon-sm"
              draggable
              aria-label={`Add ${shape}`}
              className="rounded-full text-copy-secondary hover:text-copy-primary"
              onDragStart={(event) => handleShapeDragStart(event, shape)}
            >
              <Icon className="h-5 w-5" />
            </Button>
          );
        })}
      </div>
    </div>
  );
}

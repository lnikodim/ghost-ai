import type { Edge, Node } from '@xyflow/react';

export const NODE_COLORS = [
  { fill: '#1F1F1F', text: '#EDEDED' },
  { fill: '#10233D', text: '#52A8FF' },
  { fill: '#2E1938', text: '#BF7AF0' },
  { fill: '#331B00', text: '#FF990A' },
  { fill: '#3C1618', text: '#FF6166' },
  { fill: '#3A1726', text: '#F75F8F' },
  { fill: '#0F2E18', text: '#62C073' },
  { fill: '#062822', text: '#0AC7B4' },
] as const;

export const NODE_SHAPES = ['rectangle', 'diamond', 'circle', 'pill', 'cylinder', 'hexagon'] as const;

export type NodeColor = (typeof NODE_COLORS)[number]['fill'];
export type NodeShape = (typeof NODE_SHAPES)[number];

export const DEFAULT_NODE_COLOR = NODE_COLORS[0].fill;
export const DEFAULT_NODE_SHAPE: NodeShape = 'rectangle';

export interface ShapeSize {
  width: number;
  height: number;
}

export const NODE_MIN_WIDTH = 48;
export const NODE_MIN_HEIGHT = 32;
export const NODE_LABEL_PLACEHOLDER = 'Label';

export const SHAPE_DEFAULT_SIZES: Record<NodeShape, ShapeSize> = {
  rectangle: { width: 160, height: 80 },
  diamond: { width: 120, height: 120 },
  circle: { width: 80, height: 80 },
  pill: { width: 160, height: 64 },
  cylinder: { width: 120, height: 80 },
  hexagon: { width: 100, height: 100 },
};

export const SHAPE_DRAG_MIME = 'application/x-ghost-canvas-shape';

export interface ShapeDragPayload {
  shape: NodeShape;
  width: number;
  height: number;
}

let canvasNodeIdCounter = 0;

export function createCanvasNodeId(shape: NodeShape): string {
  const id = `${shape}-${Date.now()}-${canvasNodeIdCounter}`;
  canvasNodeIdCounter += 1;
  return id;
}

export function parseShapeDragPayload(raw: string): ShapeDragPayload | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    const { shape, width, height } = parsed as ShapeDragPayload;
    if (!NODE_SHAPES.includes(shape) || typeof width !== 'number' || typeof height !== 'number') {
      return null;
    }

    return { shape, width, height };
  } catch {
    return null;
  }
}

export function getNodeTextColor(fill: string): string {
  return NODE_COLORS.find((entry) => entry.fill === fill)?.text ?? NODE_COLORS[0].text;
}

export interface CanvasNodeData extends Record<string, unknown> {
  label: string;
  color: string;
  shape: NodeShape;
}

export interface CanvasEdgeData extends Record<string, unknown> {}

export type CanvasNode = Node<CanvasNodeData, 'canvasNode'>;
export type CanvasEdge = Edge<CanvasEdgeData, 'canvasEdge'>;

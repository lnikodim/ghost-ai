import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { getNodeTextColor, type NodeShape } from '@/types/canvas';

const BORDER_REST = 'var(--border-subtle)';
const BORDER_SELECTED = 'var(--accent-primary)';

interface NodeShapeProps {
  shape: NodeShape;
  width: number;
  height: number;
  fill: string;
  label?: string;
  selected?: boolean;
  className?: string;
}

function getBorderColor(selected: boolean): string {
  return selected ? BORDER_SELECTED : BORDER_REST;
}

function NodeLabel({ label, textColor }: { label: string; textColor: string }) {
  return (
    <span className="px-2 text-center text-sm" style={{ color: textColor }}>
      {label}
    </span>
  );
}

function SvgShapeFrame({
  width,
  height,
  label,
  textColor,
  children,
}: {
  width: number;
  height: number;
  label?: string;
  textColor: string;
  children: ReactNode;
}) {
  return (
    <div className="relative" style={{ width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block" aria-hidden>
        {children}
      </svg>
      {label ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <NodeLabel label={label} textColor={textColor} />
        </div>
      ) : null}
    </div>
  );
}

function DiamondShape({
  width,
  height,
  fill,
  stroke,
}: {
  width: number;
  height: number;
  fill: string;
  stroke: string;
}) {
  const points = `${width / 2},0 ${width},${height / 2} ${width / 2},${height} 0,${height / 2}`;

  return <polygon points={points} fill={fill} stroke={stroke} strokeWidth={1} />;
}

function HexagonShape({
  width,
  height,
  fill,
  stroke,
}: {
  width: number;
  height: number;
  fill: string;
  stroke: string;
}) {
  const points = [
    `${width * 0.25},0`,
    `${width * 0.75},0`,
    `${width},${height / 2}`,
    `${width * 0.75},${height}`,
    `${width * 0.25},${height}`,
    `0,${height / 2}`,
  ].join(' ');

  return <polygon points={points} fill={fill} stroke={stroke} strokeWidth={1} />;
}

function CylinderShape({
  width,
  height,
  fill,
  stroke,
}: {
  width: number;
  height: number;
  fill: string;
  stroke: string;
}) {
  const ry = height * 0.15;
  const topY = ry;
  const bottomY = height - ry;

  return (
    <>
      <rect x={0} y={topY} width={width} height={bottomY - topY} fill={fill} />
      <ellipse cx={width / 2} cy={topY} rx={width / 2} ry={ry} fill={fill} stroke={stroke} strokeWidth={1} />
      <line x1={0} y1={topY} x2={0} y2={bottomY} stroke={stroke} strokeWidth={1} />
      <line x1={width} y1={topY} x2={width} y2={bottomY} stroke={stroke} strokeWidth={1} />
      <ellipse cx={width / 2} cy={bottomY} rx={width / 2} ry={ry} fill={fill} stroke={stroke} strokeWidth={1} />
    </>
  );
}

function CssNodeShape({
  shape,
  width,
  height,
  fill,
  label,
  textColor,
  borderColor,
  className,
}: {
  shape: 'rectangle' | 'pill' | 'circle';
  width: number;
  height: number;
  fill: string;
  label?: string;
  textColor: string;
  borderColor: string;
  className?: string;
}) {
  const radiusClass = shape === 'rectangle' ? 'rounded-xl' : 'rounded-full';

  return (
    <div
      className={cn('flex items-center justify-center border', radiusClass, className)}
      style={{
        width,
        height,
        backgroundColor: fill,
        borderColor,
      }}
    >
      {label ? <NodeLabel label={label} textColor={textColor} /> : null}
    </div>
  );
}

export function NodeShape({ shape, width, height, fill, label, selected = false, className }: NodeShapeProps) {
  const textColor = getNodeTextColor(fill);
  const borderColor = getBorderColor(selected);

  if (shape === 'rectangle' || shape === 'pill' || shape === 'circle') {
    return (
      <CssNodeShape
        shape={shape}
        width={width}
        height={height}
        fill={fill}
        label={label}
        textColor={textColor}
        borderColor={borderColor}
        className={className}
      />
    );
  }

  const svgProps = { width, height, fill, stroke: borderColor };

  return (
    <SvgShapeFrame width={width} height={height} label={label} textColor={textColor}>
      {shape === 'diamond' ? <DiamondShape {...svgProps} /> : null}
      {shape === 'hexagon' ? <HexagonShape {...svgProps} /> : null}
      {shape === 'cylinder' ? <CylinderShape {...svgProps} /> : null}
    </SvgShapeFrame>
  );
}

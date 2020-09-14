// Tooltip Component
/**
 * Component to render the cursor tooltip for a graph
 * @packageDocumentation
 */
import React from 'react';
import {Dimensions, CommonProps} from '../../types';

const TOOLTIP_X_OFFSET = 20;

/** Tooltip's own props */
export interface SelfProps {
  /** X offset of the tooltip in pixels from the left hand side of the graph */
  xOffset: number;
  /** Y offset of the tooltip in pixels from the upside of the graph */
  yOffset: number;
  /** tooltip content */
  content: React.ReactNode;
  /** if the tooltip is visible */
  visible: boolean;
}

/** All Tooltip props */
export type TooltipProps = SelfProps &
    Pick<Dimensions, 'height' | 'width'> &
    Partial<Pick<CommonProps, 'color' | 'graphIndex' | 'graphWidth'>>;

/** Tooltip State Management */
export type TooltipState = Pick<SelfProps, 'xOffset' | 'yOffset' | 'content' | 'visible'>

/** Tooltip Component  */
export const Tooltip: React.FC<TooltipProps> = (
    {
      width,
      height,
      xOffset,
      yOffset,
      graphWidth,
      content,
      visible
    }) => {

  if (!visible) return <></>;

  // Flip the tooltip to the other side of the bisector when close to the right
  // edge of the graph
  const tooltipPositionX =
      xOffset + width + TOOLTIP_X_OFFSET < graphWidth
          ? xOffset + TOOLTIP_X_OFFSET
          : xOffset - TOOLTIP_X_OFFSET - width;

  return (
      <g transform={`translate(${tooltipPositionX}, ${yOffset})`}>
        <text>
          {content}
        </text>
      </g>
  );
};

export default Tooltip;

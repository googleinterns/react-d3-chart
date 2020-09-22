// BisectorTooltip Component
/**
 * Component to render the cursor bisector tooltip for a graph
 * @packageDocumentation
 */
import React from 'react';
import * as d3 from 'd3';
import { TooltipContainer } from './styles';
import { DEFAULT_COLOR } from '../../../theme';
import { Coordinate, Dimensions, CommonProps } from '../../../types';

const TOOLTIP_X_OFFSET = 20;

/** BisectorTooltip's own props */
export interface SelfProps {
  /** Current x domain value to display */
  x: number;
  /** X offset of the tooltip in pixels from the left hand side of the graph */
  xOffset: number;
}

/** All BisectorTooltip props */
export type BisectorTooltipProps = SelfProps &
  Pick<Dimensions, 'height' | 'width'> &
  Pick<CommonProps, 'data'> &
  Partial<Pick<CommonProps, 'color' | 'graphIndex' | 'graphWidth'>>;

const bisect = d3.bisector((coord: Coordinate) => coord.x).left;

/** BisectorTooltip Component  */
export const BisectorTooltip: React.FC<BisectorTooltipProps> = ({
  data,
  x,
  width,
  height,
  xOffset,
  graphIndex = 0,
  color = DEFAULT_COLOR,
  graphWidth,
}) => {
  // Flip the tooltip to the other side of the bisector when close to the right
  // edge of the graph
  const tooltipPosition =
    xOffset + width + TOOLTIP_X_OFFSET < graphWidth
      ? xOffset + TOOLTIP_X_OFFSET
      : xOffset - TOOLTIP_X_OFFSET - width;
  const tooltipEntries = data.map((line, entryIndex) => {
    const coordX = bisect(line, x);
    let yVal;
    if (coordX >= line.length) {
      yVal = 'N/A';
    } else {
      yVal = line[coordX].y;
    }
    return (
      <tspan
        x={5}
        dy="14px"
        fill={color((entryIndex + graphIndex).toString())}
        key={`entry${entryIndex}`}
      >
        {`Trace ${entryIndex + graphIndex + 1}: ${yVal}`}
      </tspan>
    );
  });

  return (
    <g transform={`translate(${tooltipPosition}, 0)`}>
      <TooltipContainer width={width} height={height} />
      <text>
        <tspan x={5} y={5} dy="13px" fontWeight="bold">
          {x}
        </tspan>
        {tooltipEntries}
      </text>
    </g>
  );
};

export default BisectorTooltip;

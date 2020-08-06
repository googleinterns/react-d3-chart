import React from 'react';
import * as d3 from 'd3';
import { TooltipContainer } from './styles';
import { Coordinate, Dimensions } from '../../types';
import { DEFAULT_COLOR } from '../../../theme';

export interface CursorTooltipProps {
  data: Coordinate[][];
  scaledX?: number;
  x?: number;
  width?: number;
  height?: number;
  graphWidth: number;
  xDomain: [number, number];
  selectedXDomain: [number, number];
  graphPadding: Dimensions['margin'];
  color?: d3.ScaleOrdinal<string, string>;
  tooltipXOffset?: number;
  tooltipYOffset?: number;
  startIndex: number;
}

// TODO(https://github.com/FormidableLabs/victory/issues/1451)
// Custom scaled X calculation till this issue with
// zoom and cursor onCursorChange is solved
const scaleX = (
  x: CursorTooltipProps['x'],
  selectedXDomain: CursorTooltipProps['selectedXDomain'],
  width: CursorTooltipProps['width'],
  graphPadding: CursorTooltipProps['graphPadding']
) => {
  // x is the cursor pixel offset from the left hand side of the containing svg
  if (x === null) return -1;
  const start = selectedXDomain[0];
  const end = selectedXDomain[1];
  // adjustedWidth removes the inner padding from the width of the containing svg
  const adjustedWith = width - graphPadding.left - graphPadding.right;
  // adjustedX removes the left hand side padding from the cursor position
  const adjustedX = x - graphPadding.left - 5;
  // calculates the cursor positon as a percentage of the svg width
  const percentage = adjustedX / adjustedWith;
  const range = end - start;
  // Finally calculates the respective closest domain x position based on the
  // percentage of the svg the cursor is positioned at
  return Math.round(percentage * range + start);
};

const CursorTooltip: React.FC<CursorTooltipProps> = ({
  data,
  x,
  width = 100,
  height = 140,
  tooltipXOffset = 15,
  tooltipYOffset = 30,
  graphWidth,
  xDomain,
  selectedXDomain,
  graphPadding,
  color = DEFAULT_COLOR,
  startIndex,
}) => {
  const cursorX = Math.round(x);
  // Flips the position of the tooltip from right to left if the cursor is
  // approaching the right handside border of the svg
  const adjustedXOffset =
    cursorX + tooltipXOffset + width <
    graphWidth - graphPadding.left - graphPadding.right
      ? cursorX + tooltipXOffset
      : cursorX - tooltipXOffset * 2 - width;
  const scaledX = scaleX(x, selectedXDomain, graphWidth, graphPadding);

  const yValues = data.map((line) => {
    if (scaledX < xDomain[1] && scaledX >= xDomain[0]) {
      return line[scaledX].y;
    }
    return 'Unknown';
  });

  const tooltipEntries = yValues.map((y, index) => (
    <tspan
      x={5}
      dy="14px"
      fill={color(startIndex + index.toString())}
      key={`entry${index}`}
    >
      {`Trace ${startIndex + index + 1}: ${y}`}
    </tspan>
  ));

  return (
    <g transform={`translate(${adjustedXOffset}, ${tooltipYOffset})`}>
      <TooltipContainer width={width} height={height} />
      <text>
        <tspan x={5} y={5} dy="13px" fontWeight="bold">
          {scaledX}
        </tspan>
        {tooltipEntries}
      </text>
    </g>
  );
};

export default CursorTooltip;

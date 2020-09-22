// Line Component
/**
 * Component to render a line to be displayed in a line chart
 * @packageDocumentation
 */
import React from 'react';
import * as d3 from 'd3';
import { LineProps, Coordinate, Scales } from '../../types';
import { LineContainer } from './styles';

/** Line's own props */
export interface LineSelfProps {
  /** Data points for the line */
  coordinates: LineProps;
  /** Line's color */
  color: string;
}

/** All Line's Props */
export type LineCmpProps = LineSelfProps & Pick<Scales, 'xScale' | 'yScale'>;

/** Line Component */
export const Line: React.FC<LineCmpProps> = ({
  color,
  coordinates,
  xScale,
  yScale,
}) => {
  const line = d3
    .line<Coordinate>()
    .defined(
      (d) =>
        d.x >= xScale.domain()[0] &&
        xScale.domain()[1] >= d.x &&
        d.y >= yScale.domain()[0] &&
        yScale.domain()[1] >= d.y
    )
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));

  return <LineContainer stroke={color} d={line(coordinates)} />;
};

export default Line;

import React from 'react';
import * as d3 from 'd3';
import { LineProps, Coordinate } from '../types';
import { LineContainer } from './styles';

interface SelfProps {
  xScale: d3.ScaleLinear<number, number>;
  yScale: d3.ScaleLinear<number, number>;
}

export type Props = LineProps & SelfProps;

const Line: React.FC<Props> = ({ colour, coordinates, xScale, yScale }) => {
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

  return <LineContainer stroke={colour} d={line(coordinates)} />;
};

export default Line;

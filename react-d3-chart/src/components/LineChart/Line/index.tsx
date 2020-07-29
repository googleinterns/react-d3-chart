import React from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { LineProps, Coordinate } from '../../types';

const LineContainer = styled.path`
  fill: none;
  stroke-width: 1.5px;
`;

interface SelfProps {
  xScale: d3.ScaleLinear<number, number>;
  yScale: d3.ScaleLinear<number, number>;
}

type Props = LineProps & SelfProps;

const Line: React.FC<Props> = ({ colour, coordinates, xScale, yScale }) => {
  const line = d3
    .line<Coordinate>()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));

  return <LineContainer stroke={colour} d={line(coordinates)} />;
};

export default Line;

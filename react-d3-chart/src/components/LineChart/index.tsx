import React, { useMemo } from 'react';
import * as d3 from 'd3';
import Axis from '../Axis';
import { LineProps, Dimensions } from '../types';
import Line from './Line';
import Bisector from '../Bisector';

interface SelfProps {
  xDomain: [number, number];
  yDomain: [number, number];
  data: Array<LineProps>;
  lineClassName?: string;
}

type Props = SelfProps & Dimensions;

const LineChart: React.FC<Props> = ({
  width,
  height,
  xDomain,
  yDomain,
  data,
  margin,
}) => {
  const xScale = d3.scaleLinear().domain(xDomain).range([0, width]);
  const yScale = d3.scaleLinear().domain(yDomain).range([height, 0]);
  const lines = useMemo(
    () =>
      data.map((lineData, index) => (
        <Line
          key={`line${index}`}
          colour={lineData.colour}
          coordinates={lineData.coordinates}
          xScale={xScale}
          yScale={yScale}
        />
      )),
    [data]
  );

  return (
    <svg
      width={width + margin.left + margin.right}
      height={height + margin.top + margin.bottom}
    >
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {lines}
        <Axis x={0} y={0} scale={yScale} type="Left" />
        <Axis x={0} y={height} scale={xScale} type="Bottom" />
        <Bisector
          width={width}
          height={height}
          margin={margin}
          xScale={xScale}
          linesData={data}
        />
      </g>
    </svg>
  );
};

export default LineChart;

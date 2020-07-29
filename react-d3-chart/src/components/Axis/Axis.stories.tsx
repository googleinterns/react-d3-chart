import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Axis from '.';
import * as d3 from 'd3';
const yScale = d3.scaleLinear().domain([0, 1]).range([300, 0]);
const xScale = d3.scaleLinear().domain([0, 1]).range([300, 0]);

storiesOf('Axis', module).add('Left', () => (
  <svg width={500} height={500}>
    <g transform={`translate(${50}, ${50})`}>
      <Axis x={0} y={0} scale={yScale} type="Left" />
    </g>
  </svg>
));

storiesOf('Axis', module).add('Bottom', () => (
  <svg width={500} height={500}>
    <g transform={`translate(${50}, ${50})`}>
      <Axis x={0} y={0} scale={xScale} type="Bottom" />
    </g>
  </svg>
));

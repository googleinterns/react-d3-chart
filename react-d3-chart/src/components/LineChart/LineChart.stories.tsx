import * as React from 'react';
import { storiesOf } from '@storybook/react';
import LineChart from '.';
import { graphData } from './rawData';
import { LineProps } from '../types';

const ranges = '1-5, 7-9';
let data: Array<LineProps> = [];

ranges.split(',').forEach((range) => {
  const l = parseInt(range.trim().split('-')[0]);
  const r = parseInt(range.trim().split('-')[1]) + 1;

  for (let i = l; i < r; i++) {
    const temp = graphData.trace[i].c3.map((value, index) => ({
      x: index,
      y: value,
    }));
    data.push({
      coordinates: [...temp],
      colour:
        '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
    });
  }
});

storiesOf('LineChart', module).add('Default', () => (
  <LineChart
    width={800}
    height={800}
    xDomain={[0, 900]}
    yDomain={[-300, 300]}
    data={data}
    margin={{ top: 50, left: 50, right: 50, bottom: 200 }}
  />
));

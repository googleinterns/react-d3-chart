import * as React from 'react';
import {storiesOf} from '@storybook/react';
import HeatMap from '.';
import * as d3 from 'd3';

const xLabels = Array.from(Array(255).keys());
const yLabels = ["A", "B", "C", "D"];
const matrix = [
    xLabels.map((e,i) => 0),
    xLabels.map((e,i) => -i),
    xLabels.map((e,i) => i),
    xLabels.map((e, i) => Math.floor(Math.random() * 100) + 1)
];
storiesOf('HeatMap', module).add('HeatMap', () => (
    <>
      <h1>Heat Map</h1>
      <HeatMap xLabels={xLabels} yLabels={yLabels} matrix={matrix}/>
    </>
));


import * as React from 'react';
import {storiesOf} from '@storybook/react';
import Scroller from '.';
import * as d3 from 'd3';
import {Margin} from '../../types';

const leftScrollerWidth = 40;
const bottomScrollerHeight = 40;

const mainGraphMargin = {top: 50, left: 50, right: 50, bottom: 50};
const mainGraphDimension = {width: 1000, height: 500};
const bottomScrollerMargin: Margin = {
  top: mainGraphMargin.top + mainGraphDimension.height + 20,
  right: mainGraphMargin.right,
  bottom: mainGraphMargin.bottom,
  left: mainGraphMargin.left,
};

const leftScrollerMargin: Margin = {
  top: mainGraphMargin.top,
  left: mainGraphMargin.left,
  bottom: mainGraphMargin.bottom,
  right: 20,
};


storiesOf('Scroller', module).add('Bottom', () => {
  const xScaleContext = d3.scaleLinear().range([0, 1000]).domain([1, 1000]);

  return (
      <>
        <h1>Scroller</h1>
        <p>The black box represents main graph</p>
        <svg
            width={mainGraphDimension.width + mainGraphMargin.left + mainGraphMargin.right}
            height={mainGraphDimension.height + mainGraphMargin.top + bottomScrollerMargin.top + bottomScrollerMargin.bottom + bottomScrollerHeight}>
          <g transform={`translate(${mainGraphMargin.left}, ${mainGraphMargin.top})`}>
            <rect style={{'fill': 'black'}} width={mainGraphDimension.width}
                  height={mainGraphDimension.height}></rect>
          </g>
          <Scroller margin={bottomScrollerMargin}
                    width={mainGraphDimension.width}
                    height={bottomScrollerHeight}
                    position="Bottom"
                    scale={xScaleContext}/>
        </svg>
      </>
  );
});

storiesOf('Scroller', module).add('Left', () => {
  const yScaleContext = d3.scaleLinear().range([0, 500]).domain([1, 500]);

  return (
      <>
        <h1>Scroller</h1>
        <p>The black box represents main graph</p>
        <svg
            width={mainGraphDimension.width + mainGraphMargin.left + mainGraphMargin.right + leftScrollerWidth + leftScrollerMargin.left + leftScrollerMargin.right}
            height={mainGraphDimension.height + mainGraphMargin.top + mainGraphMargin.bottom}>
          <g transform={`translate(${leftScrollerWidth + leftScrollerMargin.left + leftScrollerMargin.right}, ${mainGraphMargin.top})`}>
            <rect style={{'fill': 'black'}}
                  width={mainGraphDimension.width}
                  height={mainGraphDimension.height}/>
          </g>
          <Scroller margin={leftScrollerMargin}
                    width={leftScrollerWidth}
                    height={mainGraphDimension.height}
                    position="Left"
                    scale={yScaleContext}/>
        </svg>
      </>
  );
});

storiesOf('Scroller', module).add('Left & Bottom', () => {
  const xScaleContext = d3.scaleLinear().range([0, 1000]).domain([1, 1000]);
  const yScaleContext = d3.scaleLinear().range([0, 500]).domain([1, 500]);
  const newBottomScrollerMargin = {
    ...bottomScrollerMargin,
    left: leftScrollerWidth + leftScrollerMargin.left + leftScrollerMargin.right
  };

  return (
      <>
        <h1>Scroller</h1>
        <p>The black box represents main graph</p>
        <svg
            width={mainGraphDimension.width + mainGraphMargin.left + mainGraphMargin.right + leftScrollerWidth + leftScrollerMargin.left + leftScrollerMargin.right}
            height={mainGraphDimension.height + mainGraphMargin.top + mainGraphMargin.bottom + bottomScrollerHeight + bottomScrollerMargin.top + bottomScrollerMargin.bottom}>
          <g transform={`translate(${leftScrollerWidth + leftScrollerMargin.left + leftScrollerMargin.right}, ${mainGraphMargin.top})`}>
            <rect style={{'fill': 'black'}}
                  width={mainGraphDimension.width}
                  height={mainGraphDimension.height}/>
          </g>
          <Scroller margin={leftScrollerMargin}
                    width={leftScrollerWidth}
                    height={mainGraphDimension.height}
                    position="Left"
                    showAxis={true}
                    scale={yScaleContext}/>
          <Scroller margin={newBottomScrollerMargin}
                    width={mainGraphDimension.width}
                    height={bottomScrollerHeight}
                    position="Bottom"
                    showAxis={true}
                    scale={xScaleContext}/>
        </svg>
      </>
  );
});
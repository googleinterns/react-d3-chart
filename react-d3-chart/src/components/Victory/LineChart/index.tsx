import React, { useState, useMemo } from 'react';
import * as d3 from 'd3';
import { VictoryZoomContainerProps } from 'victory-zoom-container';
import { VictoryCursorContainerProps } from 'victory-cursor-container';
import { VictoryChart } from 'victory-chart';
import { DomainPropObjectType } from 'victory-core';
import { VictoryLine } from 'victory-line';
import { createContainer } from 'victory';
import { VictoryAxis } from 'victory-axis';
import Context from '../Context';
import { LineProps, Dimensions, Coordinate } from '../../types';
import { DEFAULT_COLOUR } from '../../theme';

const DEFAULT_MARGIN = {
  top: 30,
  left: 30,
  right: 30,
  bottom: 30,
};

const GRAPH_INNER_PADDING_BOTTOM = 40;
const GRAPH_INNER_PADDING_TOP = 30;

const ZoomCursorContainer = createContainer<
  VictoryZoomContainerProps,
  VictoryCursorContainerProps
>('zoom', 'cursor');

interface SelfProps {
  xDomain: [number, number];
  yDomain: [number, number];
  data: Array<LineProps>;
  lineClassName?: string;
  contextHeight?: number;
  viewMode?: 'stacked' | 'overlapped';
  maxPoints?: number;
  colour?: d3.ScaleOrdinal<string, string>;
  tickCount?: number;
}

export type LineChartProps = SelfProps & Dimensions;

interface State {
  selectedDomain: DomainPropObjectType;
}

const filterDomain = (
  data: SelfProps['data'],
  selectedDomain: State['selectedDomain']
) =>
  data.map((line) => {
    return line.filter(
      (d) => d.x >= selectedDomain.x[0] && d.x <= selectedDomain.x[1]
    );
  });

const downSample = (filtered: Coordinate[][], maxPoints: number) => {
  if (filtered.length > 0 && filtered[0].length > maxPoints) {
    const k = Math.ceil(filtered[0].length / maxPoints);
    return filtered.map((line) => {
      return line.filter((_, i) => i % k === 0);
    });
  }
  return filtered;
};

const LineChart: React.FC<LineChartProps> = ({
  width,
  height,
  xDomain,
  yDomain,
  data,
  margin = DEFAULT_MARGIN,
  contextHeight,
  viewMode = 'overlapped',
  maxPoints = 150,
  colour = DEFAULT_COLOUR,
  tickCount = 10,
}) => {
  const domain = {
    x: xDomain,
    y: yDomain,
  };
  const [selectedDomain, setSelectedDomain] = useState<State['selectedDomain']>(
    {
      x: xDomain,
    }
  );
  const handleDomainChange = (domain: State['selectedDomain']) => {
    setSelectedDomain(domain);
  };

  const domainFilteredData = filterDomain(data, selectedDomain);
  const filteredData = downSample(domainFilteredData, maxPoints);

  const lines = useMemo(
    () =>
      filteredData.map((lineData, index) => {
        return (
          <VictoryLine
            animate={false}
            interpolation="linear"
            key={`line${index + 1}`}
            data={lineData}
            style={{
              data: { stroke: colour(index.toString()) },
            }}
          />
        );
      }),
    [filteredData, colour]
  );

  return (
    <div
      style={{
        margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
      }}
    >
      <VictoryChart
        width={width}
        height={height}
        scale={{ x: 'linear', y: 'linear' }}
        domain={domain}
        padding={{
          left: margin.left,
          right: margin.right,
          bottom: GRAPH_INNER_PADDING_BOTTOM,
          top: GRAPH_INNER_PADDING_TOP,
        }}
        containerComponent={
          <ZoomCursorContainer
            responsive={false}
            zoomDimension="x"
            zoomDomain={selectedDomain}
            cursorDimension="x"
            onZoomDomainChange={handleDomainChange}
          />
        }
      >
        <VictoryAxis
          crossAxis={false}
          orientation="bottom"
          tickCount={tickCount}
          domain={domain}
          offsetY={GRAPH_INNER_PADDING_BOTTOM}
        />
        <VictoryAxis
          crossAxis={false}
          orientation="left"
          dependentAxis
          tickCount={tickCount}
          domain={domain}
        />
        {lines}
      </VictoryChart>
      <Context
        width={width}
        height={contextHeight}
        entireDomain={domain}
        selectedDomain={selectedDomain}
        handleDomainChange={handleDomainChange}
        data={data}
        margin={margin}
        tickCount={tickCount}
      />
    </div>
  );
};

export default LineChart;

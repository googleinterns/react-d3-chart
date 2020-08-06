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
import CursorTooltip from '../CursorTooltip';
import { LineProps, Dimensions } from '../../types';
import {
  DEFAULT_COLOR,
  DEFAULT_GRAPH_MARGIN,
  DEFAULT_GRAPH_PADDING,
} from '../../../theme';
import { downSample } from '../../../utils';

const ZoomCursorContainer = createContainer<
  VictoryCursorContainerProps,
  VictoryZoomContainerProps
>('zoom', 'cursor');

interface SelfProps {
  xDomain: [number, number];
  yDomain: [number, number];
  data: Array<LineProps>;
  lineClassName?: string;
  contextHeight?: number;
  viewMode?: 'stacked' | 'overlapped';
  maxPoints?: number;
  color?: d3.ScaleOrdinal<string, string>;
  tickCount?: number;
  tooltipWidth?: number;
  tooltipHeight?: number;
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

const LineChart: React.FC<LineChartProps> = ({
  width,
  height,
  xDomain,
  yDomain,
  data,
  margin = DEFAULT_GRAPH_MARGIN,
  contextHeight,
  viewMode = 'overlapped',
  maxPoints = 150,
  color = DEFAULT_COLOR,
  tickCount = 10,
  tooltipWidth,
  tooltipHeight,
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
              data: { stroke: color(index.toString()) },
            }}
          />
        );
      }),
    [filteredData, color]
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
        padding={DEFAULT_GRAPH_PADDING}
        containerComponent={
          <ZoomCursorContainer
            responsive={false}
            zoomDimension="x"
            zoomDomain={selectedDomain}
            cursorDimension="x"
            onZoomDomainChange={handleDomainChange}
            cursorLabel={(point) => point.x}
            cursorLabelComponent={
              <CursorTooltip
                data={data}
                graphWidth={width}
                xDomain={xDomain}
                selectedXDomain={selectedDomain.x as [number, number]}
                graphPadding={DEFAULT_GRAPH_PADDING}
                width={tooltipWidth}
                height={tooltipHeight}
              />
            }
          />
        }
      >
        <VictoryAxis
          crossAxis={false}
          orientation="bottom"
          tickCount={tickCount}
          domain={domain}
          offsetY={DEFAULT_GRAPH_PADDING.bottom}
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
        margin={DEFAULT_GRAPH_PADDING}
        tickCount={tickCount}
      />
    </div>
  );
};

export default LineChart;

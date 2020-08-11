import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { VictoryZoomContainerProps } from 'victory-zoom-container';
import { VictoryCursorContainerProps } from 'victory-cursor-container';
import { VictoryChart } from 'victory-chart';
import { DomainPropObjectType } from 'victory-core';
import { VictoryLine } from 'victory-line';
import { createContainer } from 'victory';
import { VictoryAxis } from 'victory-axis';
import Context from '../../Context';
import CursorTooltip from '../../CursorTooltip';
import { LineProps, Dimensions } from '../../../types';
import { DEFAULT_COLOR, DEFAULT_GRAPH_PADDING } from '../../../../theme';

const ZoomCursorContainer = createContainer<
  VictoryCursorContainerProps,
  VictoryZoomContainerProps
>('zoom', 'cursor');

interface SelfProps {
  xDomain: [number, number];
  yDomain: [number, number];
  data: Array<LineProps>;
  filteredData: Array<LineProps>;
  lineClassName?: string;
  contextHeight?: number;
  color?: d3.ScaleOrdinal<string, string>;
  tickCount?: number;
  tooltipWidth?: number;
  tooltipHeight?: number;
  selectedDomain: DomainPropObjectType;
  handleDomainChange: (selectedDomain: DomainPropObjectType) => void;
  startIndex: number;
}

export type BaseLineChartProps = SelfProps &
  Pick<Dimensions, 'width' | 'height'>;

const BaseChart: React.FC<BaseLineChartProps> = ({
  width,
  height,
  xDomain,
  yDomain,
  data,
  filteredData,
  contextHeight,
  color = DEFAULT_COLOR,
  tickCount = 10,
  tooltipWidth,
  tooltipHeight,
  selectedDomain,
  handleDomainChange,
  startIndex,
}) => {
  const domain = {
    x: xDomain,
    y: yDomain,
  };

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
              data: { stroke: color(startIndex + index.toString()) },
            }}
          />
        );
      }),
    [filteredData, color]
  );

  return (
    <>
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
                startIndex={startIndex}
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
        startIndex={startIndex}
      />
    </>
  );
};

export default BaseChart;

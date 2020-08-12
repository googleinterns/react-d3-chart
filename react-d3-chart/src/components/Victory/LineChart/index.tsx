import React, { useState } from 'react';
import * as d3 from 'd3';
import { DomainPropObjectType } from 'victory-core';
import { LineProps, Dimensions, RangeSelectionState } from '../../types';
import { DEFAULT_COLOR, DEFAULT_GRAPH_MARGIN } from '../../../theme';
import { downSample } from '../../../utils';
import BaseChart from './BaseChart';

const DEFAULT_DOMAIN: DomainPropObjectType = {
  x: [0, 0],
  y: [0, 0],
};

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
  cursorMode: 'selection' | 'intersection';
  rangeSelection: RangeSelectionState;
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
  const [cursorMode, setCursorMode] = useState<State['cursorMode']>(
    'intersection'
  );
  const [selectedDomain, setSelectedDomain] = useState<State['selectedDomain']>(
    {
      x: xDomain,
    }
  );
  const [rangeSelection, setRangeSelection] = useState<State['rangeSelection']>(
    { enabled: false, domain: DEFAULT_DOMAIN }
  );

  const changeCursorMode = (cursorMode: State['cursorMode']) => {
    // setSelectedDomain({
    //   x: xDomain,
    //   y: yDomain,
    // });
    // setRangeSelection({ enabled: false, domain: DEFAULT_DOMAIN });
    setCursorMode(cursorMode);
  };

  const domainFilteredData = filterDomain(data, selectedDomain);
  const filteredData = downSample(domainFilteredData, maxPoints);

  return (
    <div
      style={{
        margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
      }}
    >
      {viewMode === 'stacked' ? (
        filteredData.map((lineData, index) => (
          <BaseChart
            width={width}
            height={height}
            filteredData={[lineData]}
            data={[data[index]]}
            xDomain={xDomain}
            yDomain={yDomain}
            selectedDomain={selectedDomain}
            handleDomainChange={setSelectedDomain}
            tooltipHeight={tooltipHeight}
            tooltipWidth={tooltipWidth}
            tickCount={tickCount}
            color={color}
            contextHeight={contextHeight}
            key={`line-graph-${index}`}
            startIndex={index}
            rangeSelection={rangeSelection}
            setRangeSelection={setRangeSelection}
            cursorMode={cursorMode}
            setCursorMode={changeCursorMode}
          />
        ))
      ) : (
        <BaseChart
          width={width}
          height={height}
          filteredData={filteredData}
          data={data}
          xDomain={xDomain}
          yDomain={yDomain}
          selectedDomain={selectedDomain}
          handleDomainChange={setSelectedDomain}
          tooltipHeight={tooltipHeight}
          tooltipWidth={tooltipWidth}
          tickCount={tickCount}
          color={color}
          contextHeight={contextHeight}
          startIndex={0}
          rangeSelection={rangeSelection}
          setRangeSelection={setRangeSelection}
          cursorMode={cursorMode}
          setCursorMode={changeCursorMode}
        />
      )}
    </div>
  );
};

export default LineChart;

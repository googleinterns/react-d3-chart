import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { VictoryBrushContainer } from 'victory-brush-container';
import { VictoryChart } from 'victory-chart';
import { DomainPropObjectType } from 'victory-core';
import { VictoryAxis } from 'victory-axis';
import { VictoryLine } from 'victory-line';
import { Dimensions, Coordinate, LineProps } from '../../types';
import { DEFAULT_COLOUR } from '../../theme';

const CONTEXT_HEIGHT = 90;
const CONTEXT_INNER_PADDING_BOTTOM = 30;

interface SelfProps {
  entireDomain: DomainPropObjectType;
  selectedDomain: DomainPropObjectType;
  handleDomainChange: (selectedDomain: DomainPropObjectType) => void;
  colour?: d3.ScaleOrdinal<string, string>;
  tickCount?: number;
  data: LineProps[];
  maxPoints?: number;
}

export type ContextProps = SelfProps & Dimensions;

const contextFilterData = (data: LineProps[], maxPoints: number) => {
  if (data.length > 0) {
    return data.map((line) => {
      const k = Math.ceil(line.length / maxPoints);
      return line.filter((_, i) => i % k === 0);
    });
  }
  return [];
};

const Context: React.FC<ContextProps> = ({
  width,
  entireDomain,
  margin,
  colour = DEFAULT_COLOUR,
  height = CONTEXT_HEIGHT,
  maxPoints = 150,
  selectedDomain,
  handleDomainChange,
  tickCount,
  data,
}) => {
  const contextFilteredData = useMemo(
    () => contextFilterData(data, maxPoints),
    [data, maxPoints]
  );

  const contextLines = useMemo(
    () =>
      contextFilteredData.map((lineData, index) => {
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
    [contextFilteredData, colour]
  );

  return (
    <VictoryChart
      width={width}
      height={height}
      scale={{ x: 'linear', y: 'linear' }}
      domain={entireDomain}
      padding={{
        right: margin.right,
        bottom: CONTEXT_INNER_PADDING_BOTTOM,
        left: margin.left,
      }}
      containerComponent={
        <VictoryBrushContainer
          responsive={false}
          brushDimension="x"
          brushDomain={selectedDomain}
          onBrushDomainChange={handleDomainChange}
        />
      }
    >
      <VictoryAxis
        domain={entireDomain}
        orientation="bottom"
        offsetY={CONTEXT_INNER_PADDING_BOTTOM}
        tickCount={tickCount}
      />
      {contextLines}
    </VictoryChart>
  );
};

export default Context;

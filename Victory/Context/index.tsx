import React, { useMemo } from "react";
import * as d3 from "d3";
import { VictoryBrushContainer } from "victory-brush-container";
import { VictoryChart } from "victory-chart";
import { DomainPropObjectType } from "victory-core";
import { VictoryAxis } from "victory-axis";
import { VictoryLine } from "victory-line";
import {
  Dimensions,
  Coordinate,
  LineProps,
} from "../../react-d3-chart/src/components/types";
import { DEFAULT_COLOR } from "../../react-d3-chart/src/theme";
import { downSample } from "../../react-d3-chart/src/utils";

const CONTEXT_HEIGHT = 90;
const CONTEXT_INNER_PADDING_BOTTOM = 30;

interface SelfProps {
  entireDomain: DomainPropObjectType;
  selectedDomain: DomainPropObjectType;
  handleDomainChange: (selectedDomain: DomainPropObjectType) => void;
  color?: d3.ScaleOrdinal<string, string>;
  tickCount?: number;
  data: LineProps[];
  maxPoints?: number;
  startIndex: number;
}

export type ContextProps = SelfProps & Dimensions;

const Context: React.FC<ContextProps> = ({
  width,
  entireDomain,
  margin,
  color = DEFAULT_COLOR,
  height = CONTEXT_HEIGHT,
  maxPoints = 150,
  selectedDomain,
  handleDomainChange,
  tickCount,
  data,
  startIndex,
}) => {
  const contextFilteredData = useMemo(() => downSample(data, maxPoints), [
    data,
    maxPoints,
  ]);

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
              data: { stroke: color(startIndex + index.toString()) },
            }}
          />
        );
      }),
    [contextFilteredData, color]
  );

  return (
    <VictoryChart
      width={width}
      height={height}
      scale={{ x: "linear", y: "linear" }}
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

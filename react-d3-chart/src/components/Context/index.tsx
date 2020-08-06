import React, { useMemo, useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';
import { Dimensions, Margin, LineProps } from '../types';
import Axis from '../Axis';
import Line from '../Line';
import usePrevious from '../../utils/usePrevious';

interface SelfProps {
  graphHeight: number;
  linesData: Array<LineProps>;
  xScaleContext: d3.ScaleLinear<number, number>;
  yScaleContext: d3.ScaleLinear<number, number>;
  xScale: d3.ScaleLinear<number, number>;
  onBrush: (domain: [number, number]) => void;
  graphDomain: [number, number];
  setBrush: (brushState: { brush: d3.BrushBehavior<unknown> }) => void;
  brushRef: React.MutableRefObject<SVGGElement>;
}

export type Props = SelfProps & Dimensions;

const Context: React.FC<Props> = ({
  margin,
  height,
  graphHeight,
  width,
  linesData,
  xScaleContext,
  yScaleContext,
  xScale,
  onBrush,
  setBrush,
  brushRef,
}) => {
  const contextMargin: Margin = {
    top: margin.top + graphHeight + 30,
    right: margin.right,
    bottom: margin.bottom,
    left: margin.left,
  };

  const lines = useMemo(
    () =>
      linesData.map((lineData, index) => (
        <Line
          key={`line${index}`}
          color={lineData.color}
          coordinates={lineData.coordinates}
          xScale={xScaleContext}
          yScale={yScaleContext}
        />
      )),
    [linesData, xScaleContext, yScaleContext]
  );

  useEffect(() => {
    if (brushRef.current) {
      const brushed = () => {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') {
          return;
        }
        const s = d3.event.selection || xScale.range();
        const newGraphDomain = s.map(xScale.invert, xScale);
        onBrush(newGraphDomain);
      };

      const brushContainer = d3.select(brushRef.current);
      const brush = d3.brushX().extent([
        [0, 0],
        [width, height],
      ]);
      brush.on('brush end', brushed);
      brushContainer.call(brush);
      brushContainer.call(brush.move, xScaleContext.range());
      brushContainer.call(brush.move, xScale.range());
      setBrush({ brush });
    }
  }, [brushRef]);

  return (
    <g
      transform={`translate(${contextMargin.left}, ${contextMargin.top})`}
      ref={brushRef}
      width={width}
    >
      {lines}
      <Axis x={0} y={height} scale={xScaleContext} type="Bottom" />
    </g>
  );
};

export default Context;

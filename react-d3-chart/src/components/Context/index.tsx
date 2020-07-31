import React, { useMemo, useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';
import { Dimensions, Margin, LineProps } from '../types';
import Axis from '../Axis';
import Line from '../Line';

const Brush = styled.g`
  fill: #777;
  fill-opacity: 0.3;
`;

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
  brush: d3.BrushBehavior<unknown>;
  zoom: d3.ZoomBehavior<Element, unknown>;
  svgRef: React.MutableRefObject<SVGGElement>;
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
  graphDomain,
  setBrush,
  brushRef,
  zoom,
  svgRef,
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
          colour={lineData.colour}
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
        if (svgRef.current && zoom) {
          const zoomContainer = d3.select(svgRef.current);
          const identity = d3.zoomIdentity
            .scale(width / (s[1] - s[0]))
            .translate(-s[0], 0);
          zoom.transform(zoomContainer, identity);
        }
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
  }, [brushRef, svgRef]);

  useEffect(() => {});

  return (
    <g
      transform={`translate(${contextMargin.left}, ${contextMargin.top})`}
      ref={brushRef}
      width={width}
    >
      {lines}
      <Axis x={0} y={height} scale={xScaleContext} type="Bottom" />
      {/* <Brush ref={} /> */}
    </g>
  );
};

export default Context;

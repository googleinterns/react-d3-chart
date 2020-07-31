import React, { useMemo, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { Dimensions, Margin, LineProps } from '../types';
import Axis from '../Axis';
import Line from '../Line';

interface SelfProps {
  graphHeight: number;
  linesData: Array<LineProps>;
  xScale: d3.ScaleLinear<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  graphXScale: d3.ScaleLinear<number, number>;
  onBrush: (xScale: d3.ScaleLinear<number, number>) => void;
  setOverlayState: (state: {
    brush: d3.BrushBehavior<unknown>;
    brushContainer: SVGGElement;
  }) => void;
}

export type Props = SelfProps & Dimensions;

const Context: React.FC<Props> = ({
  margin,
  height,
  graphHeight,
  width,
  linesData,
  xScale,
  yScale,
  graphXScale,
  onBrush,
  setOverlayState,
}) => {
  const overlayRef = useRef<SVGGElement>();
  const contextMargin: Margin = {
    top: margin.top + graphHeight + 30,
    right: margin.right,
    bottom: margin.bottom,
    left: margin.left,
  };

  const brushed = () => {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') {
      return;
    }
    const s = d3.event.selection || graphXScale.range();
    const newXScale = xScale.domain(s.map(graphXScale.invert, graphXScale));
    onBrush(newXScale);
  };

  const lines = useMemo(
    () =>
      linesData.map((lineData, index) => (
        <Line
          key={`line${index}`}
          colour={lineData.colour}
          coordinates={lineData.coordinates}
          xScale={xScale}
          yScale={yScale}
        />
      )),
    [linesData, xScale, yScale]
  );

  useEffect(() => {
    if (overlayRef.current) {
      const overlay = d3.select(overlayRef.current);
      const brush = d3
        .brushX()
        .extent([
          [0, 0],
          [width, height],
        ])
        .on('brush end', brushed);
      overlay.call(brush);
      overlay.call(brush.move, xScale.range());
      overlay.call(brush.move, graphXScale.range());
      setOverlayState({ brush, brushContainer: overlayRef.current });
    }
  }, [overlayRef]);

  return (
    <g
      transform={`translate(${contextMargin.left}, ${contextMargin.top})`}
      ref={overlayRef}
    >
      {lines}
      <Axis x={0} y={height} scale={xScale} type="Bottom" />
    </g>
  );
};

export default Context;

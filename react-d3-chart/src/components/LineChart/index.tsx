import React, { useMemo, useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import Axis from '../Axis';
import { LineProps, Dimensions } from '../types';
import Line from '../Line';
import Overlay from '../Overlay';
import Context from '../Context';

const ContextHeight = 40;

interface ScalesState {
  xScale: d3.ScaleLinear<number, number>;
}

interface OverlayState {
  brush: d3.BrushBehavior<unknown>;
  brushContainer: SVGGElement;
}

export type State = OverlayState & ScalesState;

interface SelfProps {
  xDomain: [number, number];
  yDomain: [number, number];
  data: Array<LineProps>;
  lineClassName?: string;
  contextHeight?: number;
}

export type LineChartProps = SelfProps & Dimensions;

const LineChart: React.FC<LineChartProps> = ({
  width,
  height,
  xDomain,
  yDomain,
  data,
  margin,
  contextHeight = 40,
}) => {
  const svgRef = useRef<SVGSVGElement>();
  const [scales, setScales] = useState<ScalesState>({
    xScale: d3.scaleLinear().domain(xDomain).range([0, width]),
  });
  const [overlayState, setOverlayState] = useState<OverlayState>({
    brush: null,
    brushContainer: null,
  });
  const setXScale = (xScale: d3.ScaleLinear<number, number>) => {
    setScales({ xScale });
  };
  const { xScale } = scales;
  const xScaleContext = d3.scaleLinear().domain(xDomain).range([0, width]);
  const yScale = d3.scaleLinear().domain(yDomain).range([height, 0]);
  const yScaleContext = d3
    .scaleLinear()
    .domain(yDomain)
    .range([ContextHeight, 0]);

  const lines = useMemo(
    () =>
      data.map((lineData, index) => (
        <Line
          key={`line${index}`}
          colour={lineData.colour}
          coordinates={lineData.coordinates}
          xScale={xScale}
          yScale={yScale}
        />
      )),
    [data, xScale, yScale]
  );

  useEffect(() => {
    if (svgRef.current) {
      const zoomed = () => {
        const { brush, brushContainer } = overlayState;
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') {
          return;
        }
        const t = d3.event.transform;
        const newXScale = xScale.domain(t.rescaleX(xScaleContext).domain());
        setXScale(newXScale);
        if (brush && brushContainer) {
          const selection = d3.select(brushContainer);
          // @ts-ignore
          brush.move(selection, xScale.range().map(t.invertX, t));
        }
      };
      const svg = d3.select(svgRef.current);
      const zoom = d3
        .zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([
          [0, 0],
          [width, height],
        ])
        .extent([
          [0, 0],
          [width, height],
        ])
        .on('zoom', zoomed);
      svg.call(zoom);
    }
  }, [svgRef, overlayState, height, width]);

  return (
    <svg
      width={width + margin.left + margin.right}
      height={height + margin.top + margin.bottom}
      ref={svgRef}
    >
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {lines}
        <Axis x={0} y={0} scale={yScale} type="Left" />
        <Axis x={0} y={height} scale={xScale} type="Bottom" />
        <Overlay
          width={width}
          height={height}
          margin={margin}
          xScale={xScale}
          linesData={data}
        />
      </g>
      <Context
        margin={margin}
        width={width}
        graphHeight={height}
        height={contextHeight}
        graphXScale={xScale}
        xScale={xScaleContext}
        yScale={yScaleContext}
        linesData={data}
        onBrush={setXScale}
        setOverlayState={setOverlayState}
      />
    </svg>
  );
};

export default LineChart;

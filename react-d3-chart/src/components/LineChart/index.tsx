import React, { useState, useMemo, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import Axis from '../Axis';
import { LineProps, Dimensions } from '../types';
import Overlay from '../Overlay';
import Context from '../Context';
import StackedLines from './StackedLines';
import OverlappedLines from './OverlappedLines';
import { brush } from 'd3';

const ContextHeight = 40;

export interface State {
  graphDomain: [number, number];
}

interface SelfProps {
  xDomain: [number, number];
  yDomain: [number, number];
  data: Array<LineProps>;
  lineClassName?: string;
  contextHeight?: number;
  viewMode?: 'stacked' | 'overlapped';
}

export type LineChartProps = SelfProps & Dimensions;

const LineChart: React.FC<LineChartProps> = ({
  width,
  height,
  xDomain,
  yDomain,
  data,
  margin,
  contextHeight = ContextHeight,
  viewMode = 'overlapped',
}) => {
  const brushRef = useRef<SVGGElement>();
  const [state, setState] = useState<{ brush: d3.BrushBehavior<unknown> }>({
    brush: null,
  });
  const svgRef = useRef<SVGGElement>();
  const [graphDomain, setGraphDomain] = useState<State['graphDomain']>(xDomain);
  const xScale = useMemo(
    () => d3.scaleLinear().domain(graphDomain).range([0, width]),
    [width, graphDomain]
  );
  const xScaleContext = useMemo(
    () => d3.scaleLinear().range([0, width]).domain(xDomain),
    [width, xDomain]
  );
  const yScale = useMemo(
    () => d3.scaleLinear().range([height, 0]).domain(yDomain),
    [height, yDomain]
  );
  const yScaleContext = useMemo(
    () => d3.scaleLinear().range([contextHeight, 0]).domain(yDomain),
    [contextHeight, yDomain]
  );

  useEffect(() => {
    if (svgRef.current) {
      const zoomed = () => {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') {
          return;
        }
        const t = d3.event.transform;
        const { brush } = state;
        if (brush && brushRef.current) {
          const brushContainer = d3.select(brushRef.current);
          brush.move(brushContainer, t.rescaleX(xScaleContext).domain());
        }
        setGraphDomain(t.rescaleX(xScaleContext).domain());
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
  }, [svgRef, width, height, state, brushRef, xScaleContext]);

  return (
    <svg
      width={width + margin.left + margin.right}
      height={height + margin.top + margin.bottom}
    >
      <g transform={`translate(${margin.left}, ${margin.top})`} ref={svgRef}>
        {viewMode === 'overlapped' && (
          <OverlappedLines data={data} xScale={xScale} yScale={yScale} />
        )}
        {viewMode === 'stacked' && (
          <StackedLines data={data} xScale={xScale} yScale={yScale} />
        )}
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
        xScale={xScale}
        xScaleContext={xScaleContext}
        yScaleContext={yScaleContext}
        linesData={data}
        onBrush={setGraphDomain}
        graphDomain={graphDomain}
        setBrush={setState}
        brushRef={brushRef}
        brush={state.brush}
      />
    </svg>
  );
};

export default LineChart;

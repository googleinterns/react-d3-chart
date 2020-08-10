import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import Axis from '../../Axis';
import {
  LineProps,
  Dimensions,
  TooltipState,
  DomainState,
  Scales,
  CommonProps,
} from '../../types';
import Overlay from '../..//Overlay';
import Context from '../../Context';
import LineContainer from '../Lines';
import { DEFAULT_COLOR } from '../../../theme';

const CONTEXT_HEIGHT = 40;

interface SelfProps {
  filteredData: Array<LineProps>;
  lineClassName?: string;
  contextHeight?: number;
  tooltipState: TooltipState;
  setTooltipState: (tooltipState: TooltipState) => void;
  domainState: DomainState;
  setDomainState: (domainState: DomainState) => void;
}

export type BaseLineChartProps = SelfProps &
  Dimensions &
  Scales &
  Partial<Pick<CommonProps, 'color' | 'graphIndex'>> &
  Pick<CommonProps, 'data'>;

const BaseChart: React.FC<BaseLineChartProps> = ({
  width,
  height,
  data,
  filteredData,
  margin,
  contextHeight = CONTEXT_HEIGHT,
  color = DEFAULT_COLOR,
  xScale,
  yScale,
  xScaleContext,
  yScaleContext,
  graphIndex = 0,
  tooltipState,
  setTooltipState,
  domainState,
  setDomainState,
}) => {
  const svgRef = useRef<SVGGElement>();
  const [zoomState, setZoomState] = useState<{
    zoom: d3.ZoomBehavior<Element, unknown>;
  }>({ zoom: null });

  const { zoom } = zoomState;
  const { selectedDomain, eventSource } = domainState;

  useEffect(() => {
    if (zoom && eventSource != `zoom${graphIndex}`) {
      const svg = d3.select(svgRef.current);
      svg.call(
        zoom.transform,
        d3.zoomIdentity
          .scale(
            width /
              (xScaleContext(selectedDomain[1]) -
                xScaleContext(selectedDomain[0]))
          )
          .translate(-xScaleContext(selectedDomain[0]), 0)
      );
    }
  }, [selectedDomain, eventSource, zoomState, svgRef, xScaleContext]);

  useEffect(() => {
    if (svgRef.current) {
      const zoomed = () => {
        if (!d3.event.sourceEvent || d3.event.sourceEvent.type === 'brush') {
          return;
        }
        const t = d3.event.transform;
        setDomainState({
          eventSource: `zoom${graphIndex}`,
          selectedDomain: t.rescaleX(xScaleContext).domain(),
        });
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
      setZoomState({ zoom });
    }
  }, [svgRef, width, height, xScaleContext]);

  return (
    <svg
      width={width + margin.left + margin.right}
      height={height + margin.top + margin.bottom}
    >
      <g transform={`translate(${margin.left}, ${margin.top})`} ref={svgRef}>
        <LineContainer
          data={filteredData}
          xScale={xScale}
          yScale={yScale}
          color={color}
          graphIndex={graphIndex}
        />
        <Axis x={0} y={0} scale={yScale} type="Left" />
        <Axis x={0} y={height} scale={xScale} type="Bottom" />
        <Overlay
          width={width}
          height={height}
          margin={margin}
          xScale={xScale}
          data={data}
          graphIndex={graphIndex}
          tooltipState={tooltipState}
          setTooltipState={setTooltipState}
          color={color}
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
        data={data}
        onBrush={setDomainState}
        graphIndex={graphIndex}
        domainState={domainState}
      />
    </svg>
  );
};

export default BaseChart;
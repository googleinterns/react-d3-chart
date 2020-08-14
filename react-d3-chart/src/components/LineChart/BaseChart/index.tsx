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
  ModeTypes,
  RangeSelectionState,
} from '../../../types';
import Overlay from '../..//Overlay';
import Context from '../../Context';
import LineContainer from '../../Lines';
import { DEFAULT_COLOR } from '../../../theme';

const CONTEXT_HEIGHT = 40;

interface SelfProps {
  filteredData: Array<LineProps>;
  contextData: Array<LineProps>;
  lineClassName?: string;
  contextHeight?: number;
  tooltipState: TooltipState;
  setTooltipState: (tooltipState: TooltipState) => void;
  rangeSelectionState: RangeSelectionState;
  setRangeSelectionState: (rangeSelectionState: RangeSelectionState) => void;
  domainState: DomainState;
  setDomainState: (domainState: DomainState) => void;
  mode?: ModeTypes;
}

export type BaseLineChartProps = SelfProps &
  Dimensions &
  Scales &
  Partial<Pick<CommonProps, 'color' | 'graphIndex' | 'tooltipEntryHeight'>> &
  Pick<CommonProps, 'data'>;

export const BaseChart: React.FC<BaseLineChartProps> = ({
  width,
  height,
  data,
  filteredData,
  contextData,
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
  rangeSelectionState,
  setRangeSelectionState,
  domainState,
  setDomainState,
  mode = 'intersection',
  tooltipEntryHeight,
}) => {
  const svgRef = useRef<SVGGElement>();
  const [zoomState, setZoomState] = useState<{
    zoom: d3.ZoomBehavior<Element, unknown>;
  }>({ zoom: null });

  const { zoom } = zoomState;
  const { selectedDomain, eventSource } = domainState;

  useEffect(() => {
    if (svgRef.current && zoom && eventSource !== `zoom${graphIndex}`) {
      const svg = d3.select(svgRef.current);
      // @ts-ignore
      svg.call(
        // @ts-ignore
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
        if (
          !d3.event.sourceEvent ||
          d3.event.sourceEvent.type === 'brush' ||
          (mode === 'selection' && d3.event.sourceEvent.type === 'mousemove')
        ) {
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
      // @ts-ignore
      svg.call(zoom);
      setZoomState({ zoom });
      return () => {
        zoom.on('zoom', null);
      };
    }
  }, [svgRef, width, height, xScaleContext, mode]);

  return (
    <svg
      width={width + margin.left + margin.right}
      height={height + margin.top + margin.bottom + contextHeight}
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
          rangeSelectionState={rangeSelectionState}
          setRangeSelectionState={setRangeSelectionState}
          color={color}
          mode={mode}
          tooltipEntryHeight={tooltipEntryHeight}
        />
      </g>
      <Context
        margin={margin}
        width={width}
        graphHeight={height}
        height={contextHeight}
        xScaleContext={xScaleContext}
        yScaleContext={yScaleContext}
        data={contextData}
        onBrush={setDomainState}
        graphIndex={graphIndex}
        domainState={domainState}
      />
    </svg>
  );
};

export default BaseChart;

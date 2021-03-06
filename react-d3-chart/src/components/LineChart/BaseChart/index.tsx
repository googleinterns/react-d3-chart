// BaseChart Component
/**
 * File containing the BaseChart Wrapped by the LineChart component
 * @packageDocumentation
 */
import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import Axis from '../../Axis';
import {
  LineProps,
  Dimensions,
  Scales,
  CommonProps,
  TooltipStateManagement,
  RangeSelectionStateManagement,
  DomainStateManagement,
  ModeTypeStateManagement,
  TRangeSelection,
} from '../../../types';
import Overlay from '../..//Overlay';
import Context from '../../Context';
import LineContainer from '../../LineContainer';
import { DEFAULT_COLOR } from '../../../theme';
import { googleColor20c } from '../../../utils';


const CONTEXT_HEIGHT = 40;

/** BaseChart's own props */
export interface BaseChartSelfProps {
  /** Data points to be rendered as lines in the main graph*/
  filteredData: Array<LineProps>;
  /** Data points to be rendered as lines in the context */
  contextData: Array<LineProps>;
  /** Selected ranges */
  rangeSelections: Array<TRangeSelection>;
}

/** All BaseLineChart's Props */
export type BaseLineChartProps = BaseChartSelfProps &
  DomainStateManagement &
  TooltipStateManagement &
  RangeSelectionStateManagement &
  Dimensions &
  Scales &
  Partial<
    Pick<
      CommonProps,
      'color' | 'graphIndex' | 'tooltipEntryHeight' | 'contextHeight'
    >
  > &
  Pick<CommonProps, 'data'> &
  Pick<ModeTypeStateManagement, 'mode'>;

/** BaseLineChart Component */
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
  rangeSelections
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
        {rangeSelections.map((range, i) => {
          return <rect key={i}
                       x={xScale(range[0])}
                       width={xScale(range[1]) - xScale(range[0])}
                       height={height}
                       style={{fill: `${googleColor20c(i)}`, zIndex: -99+i, opacity: 0.3}} />
        })}
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

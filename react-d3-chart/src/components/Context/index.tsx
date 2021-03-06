// Context Component
/**
 * Component to render the graph context displayed below each graph
 * @packageDocumentation
 */
import React, { useMemo, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
  Dimensions,
  Margin,
  DomainStateManagement,
  Scales,
  CommonProps,
} from '../../types';
import Axis from '../Axis';
import Line from '../Line';
import { DEFAULT_COLOR } from '../../theme';

interface State {
  brushRef: SVGGElement;
  brushState: { brush: d3.BrushBehavior<unknown> };
}

/** Context's own props */
export interface ContextSelfProps {
  /** callback that triggers on context brush */
  onBrush: DomainStateManagement['setDomainState'];
}

/** All Context's Props */
export type ContextProps = ContextSelfProps &
  Pick<DomainStateManagement, 'domainState'> &
  Dimensions &
  Pick<Scales, 'xScaleContext' | 'yScaleContext'> &
  Partial<Pick<CommonProps, 'color' | 'graphIndex'>> &
  Pick<CommonProps, 'data' | 'graphHeight'>;

/** Context Component */
export const Context: React.FC<ContextProps> = ({
  margin,
  height,
  graphHeight,
  width,
  data,
  xScaleContext,
  yScaleContext,
  onBrush,
  color = DEFAULT_COLOR,
  graphIndex = 0,
  domainState,
}) => {
  const brushRef = useRef<State['brushRef']>();
  const [brushState, setBrushState] = useState<State['brushState']>({
    brush: null,
  });
  const { brush } = brushState;
  const brushEventID = `brush${graphIndex}`;
  const contextMargin: Margin = {
    top: margin.top + graphHeight + 30,
    right: margin.right,
    bottom: margin.bottom,
    left: margin.left,
  };
  const { selectedDomain, eventSource } = domainState;

  const lines = useMemo(
    () =>
      data.map((lineData, index) => (
        <Line
          key={`line${index}`}
          color={color((index + graphIndex).toString())}
          coordinates={lineData}
          xScale={xScaleContext}
          yScale={yScaleContext}
        />
      )),
    [data, xScaleContext, yScaleContext]
  );

  const brushed = () => {
    if (!d3.event.sourceEvent || d3.event.sourceEvent.type === 'zoom') {
      return;
    }
    const s = d3.event.selection || xScaleContext.range();
    const newGraphDomain = s.map(xScaleContext.invert, xScaleContext);
    onBrush({ selectedDomain: newGraphDomain, eventSource: brushEventID });
  };

  useEffect(() => {
    if (brushRef.current) {
      const brushContainer = d3.select(brushRef.current);
      const brush = d3.brushX().extent([
        [0, 0],
        [width, height],
      ]);
      brush.on('brush end', brushed);
      brushContainer.call(brush);
      brushContainer.call(brush.move, xScaleContext.range());
      setBrushState({ brush });
      return () => {
        brush.on('brush end', null);
      };
    }
  }, [brushRef, brushEventID, xScaleContext]);

  useEffect(() => {
    if (brushRef.current && brush && eventSource !== brushEventID) {
      const brushContainer = d3.select(brushRef.current);
      brush.on('brush end', null);
      brushContainer.call(brush.move, [
        xScaleContext(selectedDomain[0]),
        xScaleContext(selectedDomain[1]),
      ]);
      brush.on('brush end', brushed);
    }
  }, [selectedDomain, brushRef.current, eventSource, brush]);

  return (
    <g
      transform={`translate(${contextMargin.left}, ${contextMargin.top})`}
      ref={brushRef}
      width={width}
      id={brushEventID}
    >
      {lines}
      <Axis x={0} y={height} scale={xScaleContext} type="Bottom" />
    </g>
  );
};

export default Context;

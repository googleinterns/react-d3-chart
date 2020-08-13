import React, { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import {
  Dimensions,
  RangeSelectionState,
  Scales,
  CommonProps,
} from '../../types';
import { Selection } from './styles';

interface State {
  brushRef: SVGGElement;
  brushState: { brush: d3.BrushBehavior<unknown> };
}

interface SelfProps {
  onBrush: (rangeSelectionState: RangeSelectionState) => void;
}

type RangeSelectionProps = SelfProps &
  Pick<Dimensions, 'width' | 'height'> &
  RangeSelectionState &
  Pick<Scales, 'xScale'> &
  Partial<Pick<CommonProps, 'graphIndex'>>;

export const RangeSelection: React.FC<RangeSelectionProps> = ({
  width,
  height,
  xScale,
  onBrush,
  selection,
  eventSource,
  graphIndex = 0,
}) => {
  const brushRef = useRef<State['brushRef']>();
  const brushEventID = `range-selection-brush${graphIndex}`;
  const [{ brush }, setBrushState] = useState<State['brushState']>({
    brush: null,
  });

  const resetBrush = () => {
    if (!d3.event.selection) {
      onBrush({
        selection: [0, 0],
        eventSource: brushEventID,
      });
    }
  };

  const brushed = () => {
    if (!d3.event.sourceEvent || d3.event.sourceEvent.type === 'zoom') {
      return;
    }
    const s = d3.event.selection || xScale.range();
    const newSelection = s.map(xScale.invert, xScale);
    onBrush({
      selection: newSelection,
      eventSource: brushEventID,
    });
  };

  useEffect(() => {
    if (brushRef.current) {
      const brushContainer = d3.select(brushRef.current);
      const brush = d3.brushX().extent([
        [0, 0],
        [width, height],
      ]);
      brush.on('brush', brushed);
      brush.on('end', resetBrush);
      brushContainer.call(brush);
      setBrushState({ brush });
      return () => {
        brush.on('brush', null);
        brush.on('end', null);
      };
    }
  }, [brushRef, brushEventID, xScale]);

  useEffect(() => {
    if (brushRef.current && brush && eventSource !== brushEventID) {
      const brushContainer = d3.select(brushRef.current);
      brush.on('brush', null);
      brush.on('end', null);
      brushContainer.call(brush.move, [
        xScale(selection[0]),
        xScale(selection[1]),
      ]);
      brush.on('brush', brushed);
      brush.on('end', resetBrush);
    }
  }, [selection, brushRef.current, eventSource, brush]);

  return <Selection ref={brushRef} width={width} />;
};

export default RangeSelection;

// Overlay Component
/**
 * File containing the Overlay Component that is the wrapper around
 * cursor interaction with the graph
 * @packageDocumentation
 */
import React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import {
  Dimensions,
  Scales,
  CommonProps,
  TooltipStateManagement,
  ModeTypeStateManagement,
  RangeSelectionStateManagement,
} from '../../types';
import Bisector from '../Bisector';
import RangeSelection from '../RangeSelection';
import { ScannerRect } from './styles';
import { DEFAULT_COLOR } from '../../theme';

/** All Overlay's Props */
export type OverlayProps = RangeSelectionStateManagement &
  TooltipStateManagement &
  Dimensions &
  Pick<Scales, 'xScale'> &
  Partial<Pick<CommonProps, 'color' | 'graphIndex' | 'tooltipEntryHeight'>> &
  Pick<ModeTypeStateManagement, 'mode'> &
  Pick<CommonProps, 'data'>;

export const Overlay: React.FC<OverlayProps> = ({
  height,
  width,
  xScale,
  data,
  color = DEFAULT_COLOR,
  graphIndex,
  tooltipState,
  setTooltipState,
  rangeSelectionState,
  setRangeSelectionState,
  mode = 'intersection',
  tooltipEntryHeight,
}) => {
  const { selection, eventSource } = rangeSelectionState;
  const onMouseOver = () =>
    setTooltipState({ enabled: true, xOffset: 0, xScaled: 0 });
  const onMouseOut = () =>
    setTooltipState({ enabled: false, xOffset: 0, xScaled: 0 });

  const onMouseMove = (e: React.MouseEvent<SVGRectElement, MouseEvent>) => {
    const mouse = d3.clientPoint(e.target as d3.ContainerElement, e);
    const mouseX = Math.round(mouse[0]);
    const timeX = Math.round(xScale.invert(mouse[0]));
    setTooltipState({ enabled: true, xOffset: mouseX, xScaled: timeX });
  };

  // Adds a 100ms delay between onMouseMove calls for performance improvement purposes
  const throttledMouseMove = _.throttle(onMouseMove, 0.1);

  return (
    <>
      <ScannerRect
        height={height}
        width={width}
        onMouseEnter={onMouseOver}
        onMouseLeave={onMouseOut}
        onMouseMove={throttledMouseMove}
      ></ScannerRect>
      {tooltipState.enabled && mode === 'intersection' && (
        <Bisector
          color={color}
          tooltipState={tooltipState}
          height={height}
          tooltipEntryHeight={tooltipEntryHeight}
          data={data}
          graphIndex={graphIndex}
          graphWidth={width}
        />
      )}
      {mode === 'selection' && (
        <RangeSelection
          width={width}
          height={height}
          selection={selection}
          eventSource={eventSource}
          onBrush={setRangeSelectionState}
          xScale={xScale}
          graphIndex={graphIndex}
        />
      )}
    </>
  );
};

export default Overlay;

import React from 'react';
import * as d3 from 'd3';
import { Dimensions, TooltipState, Scales, CommonProps } from '../types';
import Bisector from '../Bisector';
import { ScannerRect } from './styles';
import { DEFAULT_COLOR } from '../../theme';

interface SelfProps {
  tooltipState: TooltipState;
  setTooltipState: (tooltipState: TooltipState) => void;
}

export type OverlayProps = SelfProps &
  Dimensions &
  Pick<Scales, 'xScale'> &
  Partial<Pick<CommonProps, 'color' | 'graphIndex'>> &
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
}) => {
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

  return (
    <>
      <ScannerRect
        height={height}
        width={width}
        onMouseEnter={onMouseOver}
        onMouseLeave={onMouseOut}
        onMouseMove={onMouseMove}
      ></ScannerRect>
      {tooltipState.enabled && (
        <Bisector
          color={color}
          tooltipState={tooltipState}
          height={height}
          data={data}
          graphIndex={graphIndex}
          graphWidth={width}
        />
      )}
    </>
  );
};

export default Overlay;

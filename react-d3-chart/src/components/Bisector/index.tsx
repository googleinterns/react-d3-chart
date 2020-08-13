import React from 'react';
import BisectorTooltip from './BisectorTooltip';
import { BisectorLine } from './styles';
import { TooltipState, CommonProps, Dimensions } from '../../types';
import { DEFAULT_COLOR } from '../../theme';

interface SelfProps {
  tooltipHeight?: number;
  tooltipWidth?: number;
  tooltipState: TooltipState;
}

export type BisectorProps = SelfProps &
  Pick<Dimensions, 'height'> &
  Partial<Pick<CommonProps, 'color' | 'graphIndex' | 'graphWidth'>> &
  Pick<CommonProps, 'data'>;

export const Bisector: React.FC<BisectorProps> = ({
  tooltipState,
  data,
  height,
  tooltipHeight = 140,
  tooltipWidth = 90,
  graphIndex,
  graphWidth,
  color = DEFAULT_COLOR,
}) => {
  const { xOffset, xScaled } = tooltipState;
  return (
    <>
      <BisectorLine d={`M${xOffset},${height} ${xOffset},0`} />
      <BisectorTooltip
        data={data}
        x={xScaled}
        xOffset={xOffset}
        width={tooltipWidth}
        height={tooltipHeight}
        graphIndex={graphIndex}
        graphWidth={graphWidth}
        color={color}
      />
    </>
  );
};

export default Bisector;

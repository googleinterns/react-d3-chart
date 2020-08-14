import React from 'react';
import BisectorTooltip from './BisectorTooltip';
import { BisectorLine } from './styles';
import { TooltipState, CommonProps, Dimensions } from '../../types';
import { DEFAULT_COLOR } from '../../theme';

interface SelfProps {
  tooltipEntryHeight?: number;
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
  tooltipEntryHeight = 15,
  tooltipWidth = 120,
  graphIndex = 0,
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
        height={tooltipEntryHeight * data.length + 25}
        graphIndex={graphIndex}
        graphWidth={graphWidth}
        color={color}
      />
    </>
  );
};

export default Bisector;

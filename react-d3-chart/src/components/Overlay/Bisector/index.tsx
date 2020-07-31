import React from 'react';
import BisectorTooltip, {
  Props as BisectorTooltipProps,
} from './BisectorTooltip';
import { BisectorLine } from './styles';

interface Props {
  height: number;
  tooltipHeight?: number;
  tooltipWidth?: number;
  tooltipProps: Pick<BisectorTooltipProps, 'data' | 'x' | 'marginLeft'>;
}

const Bisector: React.FC<Props> = ({
  tooltipProps,
  height,
  tooltipHeight = 140,
  tooltipWidth = 90,
}) => {
  const { x, marginLeft, data } = tooltipProps;
  return (
    <>
      <BisectorLine d={`M${marginLeft},${height} ${marginLeft},0`} />
      <BisectorTooltip
        data={data}
        x={x}
        marginLeft={marginLeft}
        width={tooltipWidth}
        height={tooltipHeight}
      />
    </>
  );
};

export default Bisector;

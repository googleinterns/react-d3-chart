import React from 'react';
import styled from 'styled-components';
import { BisectorTooltipEntry } from '../../types';

const TooltipContainer = styled.rect`
  fill: #e8e8e8;
`;

export interface Props {
  data: Array<BisectorTooltipEntry>;
  x: number;
  width: number;
  height: number;
  marginLeft: number;
}

const BisectorTooltip: React.FC<Props> = ({
  data,
  x,
  width,
  height,
  marginLeft,
}) => {
  const tooltipEntries = data.map((entry, index) => (
    <tspan x={5} dy="14px" fill={entry.colour} key={`entry${index}`}>
      {`Trace ${index + 1}: ${entry.y}`}
    </tspan>
  ));

  return (
    <g transform={`translate(${marginLeft + 20}, 0)`}>
      <TooltipContainer width={width} height={height} />
      <text>
        <tspan x={5} y={5} dy="13px" fontWeight="bold">
          {x}
        </tspan>
        {tooltipEntries}
      </text>
    </g>
  );
};

export default BisectorTooltip;
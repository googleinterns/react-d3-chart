// Lines Component
/**
 * File containing the Line Container Component
 * @packageDocumentation
 */
import React, { useMemo } from 'react';
import { Scales, CommonProps } from '../../types';
import Line from '../Line';
import { DEFAULT_COLOR } from '../../theme';

/** All LineContainer's Props */
export type LineContainerProps = Pick<Scales, 'xScale' | 'yScale'> &
  Pick<CommonProps, 'data'> &
  Partial<Pick<CommonProps, 'color' | 'graphIndex'>>;

/** LineContainer Component */
export const LineContainer: React.FC<LineContainerProps> = ({
  color = DEFAULT_COLOR,
  data,
  xScale,
  yScale,
  graphIndex,
}) => {
  const lines = useMemo(
    () =>
      data.map((lineData, index) => (
        <Line
          key={`line${index}`}
          color={color((index + graphIndex).toString())}
          coordinates={lineData}
          xScale={xScale}
          yScale={yScale}
        />
      )),
    [data, xScale, yScale]
  );

  return <>{lines}</>;
};

export default LineContainer;

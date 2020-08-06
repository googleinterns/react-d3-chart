import React, { useMemo } from 'react';
import { LineProps } from '../../types';
import Line from '../../Line';

export interface OverlappedLinesProps {
  data: Array<LineProps>;
  xScale: d3.ScaleLinear<number, number>;
  yScale: d3.ScaleLinear<number, number>;
}

const OverlappedLines: React.FC<OverlappedLinesProps> = ({
  data,
  xScale,
  yScale,
}) => {
  const lines = useMemo(
    () =>
      data.map((lineData, index) => (
        <Line
          key={`line${index}`}
          color={lineData.color}
          coordinates={lineData.coordinates}
          xScale={xScale}
          yScale={yScale}
        />
      )),
    [data, xScale, yScale]
  );

  return <>{lines}</>;
};

export default OverlappedLines;

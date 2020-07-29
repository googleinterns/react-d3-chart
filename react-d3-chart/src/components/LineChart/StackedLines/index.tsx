import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { LineProps } from '../../types';

export interface StackedLinesProps {
  data: Array<LineProps>;
  xScale: d3.ScaleLinear<number, number>;
  yScale: d3.ScaleLinear<number, number>;
}

const StackedLines: React.FC<StackedLinesProps> = ({
  data,
  xScale,
  yScale,
}) => {
  const keys = data.map((_, lineNumber) => `${lineNumber}`);
  const stackedValues = useMemo(() => {
    const stack = d3.stack<LineProps>().keys(keys);
    let stackedData = [];
    data[0].coordinates.forEach((_, x) => {
      const entry = { x };
      data.forEach((line, lineNumber) => {
        entry[`${lineNumber}`] = line.coordinates[x].y;
      });
      stackedData.push(entry);
    });
    return stack(stackedData);
  }, [data]);

  const areaGenerator = d3
    .area()
    .x(function (_, i) {
      return xScale(i);
    })
    .y0(function (d) {
      return yScale(d[0]);
    })
    .y1(function (d) {
      return yScale(d[1]);
    })
    .defined(
      (d, i) =>
        i >= xScale.domain()[0] &&
        xScale.domain()[1] >= i &&
        d[0] >= yScale.domain()[0] &&
        yScale.domain()[1] >= d[1]
    );

  const lines = stackedValues.map((value, index) => {
    return (
      // @ts-ignore
      <path d={areaGenerator(value)} fill={data[index].colour} key={index} />
    );
  });

  return <>{lines}</>;
};

export default StackedLines;

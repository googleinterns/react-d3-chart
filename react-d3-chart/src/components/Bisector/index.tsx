import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { Dimensions, Coordinate, LineProps } from '../types';
import BisectorTooltip, {
  Props as BisectorTooltipProps,
} from './BisectorTooltip';

const ScannerRect = styled.rect`
  fill: none;
  pointer-events: all;
  z-index: 2;
`;

const BisectorLine = styled.path`
  stroke-width: 1;
  stroke: #666;
  pointer-events: none;
  cursor: pointer;
`;

interface SelfProps {
  xScale: d3.ScaleLinear<number, number>;
  linesData: Array<LineProps>;
}

interface State {
  isHovered: boolean;
  tooltipProps: Pick<BisectorTooltipProps, 'data' | 'x' | 'marginLeft'>;
}

type Props = SelfProps & Dimensions;

const Bisector: React.FC<Props> = ({ height, width, xScale, linesData }) => {
  const [isHovered, setIsHovered] = useState<State['isHovered']>(false);
  const [tooltipProps, setTooltipProps] = useState<State['tooltipProps']>({
    marginLeft: 0,
    x: 0,
    data: [],
  });
  const onMouseOver = () => setIsHovered(true);
  const onMouseOut = () => setIsHovered(false);
  const ref = useRef<SVGRectElement>();

  const onMouseMove = (e: React.MouseEvent<SVGRectElement, MouseEvent>) => {
    setIsHovered(true);
    const mouse = d3.clientPoint(e.target as d3.ContainerElement, e);
    const mouseX = Math.round(mouse[0]);
    const timeX = Math.round(xScale.invert(mouse[0]));
    const bisect = d3.bisector((coord: Coordinate) => coord.x).left;
    let data: BisectorTooltipProps['data'] = [];
    linesData.forEach((line) => {
      const { coordinates, colour } = line;
      const idx = bisect(coordinates, timeX);
      data.push({
        colour,
        y: coordinates[idx].y,
      });
    });

    setTooltipProps({
      x: timeX,
      marginLeft: mouseX,
      data,
    });
  };

  const { x, marginLeft, data } = tooltipProps;

  return (
    <>
      <ScannerRect
        height={height}
        width={width}
        onMouseEnter={onMouseOver}
        onMouseLeave={onMouseOut}
        onMouseMove={onMouseMove}
        ref={ref}
      ></ScannerRect>
      {isHovered && (
        <>
          <BisectorLine d={`M${marginLeft},${height} ${marginLeft},0`} />
          <BisectorTooltip
            data={data}
            x={x}
            marginLeft={marginLeft}
            width={90}
            height={140}
          />
        </>
      )}
    </>
  );
};

export default Bisector;

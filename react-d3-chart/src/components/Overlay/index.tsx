import React, { useState } from 'react';
import * as d3 from 'd3';
import { Dimensions, Coordinate, LineProps } from '../types';
import { Props as BisectorTooltipProps } from './Bisector/BisectorTooltip';
import Bisector from './Bisector';
import { ScannerRect } from './styles';

interface SelfProps {
  xScale: d3.ScaleLinear<number, number>;
  linesData: Array<LineProps>;
}

interface State {
  isHovered: boolean;
  tooltipProps: Pick<BisectorTooltipProps, 'data' | 'x' | 'marginLeft'>;
}

export type Props = SelfProps & Dimensions;

const Overlay: React.FC<Props> = ({ height, width, xScale, linesData }) => {
  const [isHovered, setIsHovered] = useState<State['isHovered']>(false);
  const [tooltipProps, setTooltipProps] = useState<State['tooltipProps']>({
    marginLeft: 0,
    x: 0,
    data: [],
  });
  const onMouseOver = () => setIsHovered(true);
  const onMouseOut = () => setIsHovered(false);

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

  return (
    <>
      <ScannerRect
        height={height}
        width={width}
        onMouseEnter={onMouseOver}
        onMouseLeave={onMouseOut}
        onMouseMove={onMouseMove}
      ></ScannerRect>
      {isHovered && <Bisector tooltipProps={tooltipProps} height={height} />}
    </>
  );
};

export default Overlay;

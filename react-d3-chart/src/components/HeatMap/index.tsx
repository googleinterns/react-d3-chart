// HeatMap Component
/**
 * Component to render an HeatMap
 * @packageDocumentation
 */
import React, {useEffect, useMemo, useRef, useState} from 'react';
import * as d3 from 'd3';
import Axis from '../Axis';
import Tooltip, {TooltipState} from '../Tooltip';
import Scroller from '../Scroller';

import {Margin} from '../../types';
import {getMatrixDomain} from '../../utils';

interface HeatMapProps {
  width?: number,
  height?: number,
  xLabels: Array<string>,
  yLabels: Array<string>,
  matrix: Array<Array<number>>
}

const scrollerSize = 40;

/** HeatMap Component */
export const HeatMap: React.FC<HeatMapProps> = (
    {
      width = 1000,
      height = 500,
      xLabels, yLabels, matrix
    }: HeatMapProps) => {
  const svgRef = useRef<SVGAElement>();
  const [selectedXRange, setSelectedXRange] = useState([0, xLabels.length]);
  const [selectedYRange, setSelectedYRange] = useState([0, yLabels.length]);
  const [toolTipState, setTooltipState] = useState<TooltipState>({
    content: '', visible:false, xOffset: 200, yOffset:200
  });
  const [hoveredIndex, setHoveredIndex] = useState([-1, -1]);

  const xScale = useMemo(
      () => d3.scaleBand()
          .range([0, width])
          .domain(xLabels.slice(selectedXRange[0], selectedXRange[1]))
          .padding(0.01),
      [width, xLabels, selectedXRange]
  );
  const yLabelScale = d3.scaleBand()
      .range([height, 0])
      .domain(yLabels)
      .padding(0.01);

  const yScale = d3.scaleBand()
      .range([height, 0])
      .domain(yLabels.slice(Math.round(selectedYRange[0] - 0.5), Math.round(selectedYRange[1] + 0.5)))
      .padding(0.01);

  const xScaleContext = useMemo(
      () => d3.scaleLinear().range([0, width]).domain(selectedXRange),
      [width, xLabels]
  );

  const yScaleContext = useMemo(
      () => d3.scaleLinear().range([0, height]).domain(selectedYRange),
      [width, yLabels]
  );

  const onMouseOver = (e: React.MouseEvent<SVGRectElement, MouseEvent>, matrixIndex: Array<number>) => {
    const mouse = d3.clientPoint(e.target as d3.ContainerElement, e);
    const mouseX = Math.round(mouse[0]);
    const mouseY = Math.round(mouse[1]);
    const value = matrix[matrixIndex[0]][matrixIndex[1]];
    setHoveredIndex(matrixIndex);
    setTooltipState({xOffset: mouseX + margin.left, yOffset: mouseY + margin.top, visible: true, content: `${value}` });
  };

  const onMouseOut = () =>
      setTooltipState({ ...toolTipState, visible: false });

  const margin = {top: 50, left: 50, right: 50, bottom: 50};

  const myColor = useMemo(() => d3.scaleLinear()
      // @ts-ignore
      .range(['white', '#69b3a2'])
      .domain(getMatrixDomain(matrix)), [matrix]);

  const leftScrollerMargin: Margin = {
    top: margin.top,
    left: margin.left,
    bottom: margin.bottom,
    right: 20,
  };

  const bottomScrollerMargin: Margin = {
    top: margin.top + height + 20,
    right: margin.right,
    bottom: margin.bottom,
    left: scrollerSize + leftScrollerMargin.left + leftScrollerMargin.right
  };

  const renderGrids = useMemo(() => {
    return yScale.domain().map((yLabel, _yi) => (
        <React.Fragment key={yLabel}>{xScale.domain().map((xLabel, _xi) => {

          const xi = _xi + selectedXRange[0];
          const yi = _yi + selectedYRange[0];

          const style = {'fill': `${myColor(matrix[yi][xi])}`};
          if (hoveredIndex[0] == yi && hoveredIndex[1] == xi) {
            // @ts-ignore
            style['stroke'] = 'black';
          }
          return (
              <rect key={`${xLabel}, ${xi}`}
                    width={xScale.bandwidth()}
                    height={yScale.bandwidth()}
                    x={xScale(xLabel)}
                    y={yScale(yLabel)}
                    onMouseOver={(e) => onMouseOver(e, [yi, xi])}
                    onMouseOut={onMouseOut}
                    style={style}/>
          )
        })}</React.Fragment>
    ))
  }, [xScale, yScale, hoveredIndex]);

  return (
      <svg
          width={width + margin.left + margin.right + scrollerSize + leftScrollerMargin.left + leftScrollerMargin.right}
          height={height + margin.top + margin.bottom + scrollerSize + bottomScrollerMargin.bottom}
      >
        <g transform={`translate(${scrollerSize + leftScrollerMargin.left + leftScrollerMargin.right}, ${margin.top})`} ref={svgRef}>
          {renderGrids}
          <Axis x={0} y={0} scale={yScale} type="Left"/>
          <Axis x={0} y={height} scale={xScale} type="Bottom" totalPoints={25}/>
        </g>
        <Scroller margin={leftScrollerMargin} width={scrollerSize} height={height}
                  position="Left" scale={yScaleContext} showAxis={false} labelAxis={yLabelScale}
                  onBrush={setSelectedYRange}/>

        <Scroller margin={bottomScrollerMargin} width={width} height={scrollerSize}
               position="Bottom" scale={xScaleContext} showAxis={true}
               onBrush={setSelectedXRange}/>
        <Tooltip {...toolTipState} width={100} height={100} graphWidth={width}/>
      </svg>
  );
};

export default HeatMap;

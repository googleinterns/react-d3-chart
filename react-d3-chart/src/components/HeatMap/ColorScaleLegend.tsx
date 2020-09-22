// ColorScaleLegend Component
/**
 * Component to render an ColorScaleLegend
 * @packageDocumentation
 */
import React, {useEffect, useMemo, useRef, useState} from 'react';
import * as d3 from 'd3';

import Axis from '../Axis';


interface ColorScaleLegendProps {
  width?: number,
  height?: number,
  domain: [number, number],
  colorScheme: (t: number) => string
}

/** ColorScaleLegend Component */
export const ColorScaleLegend: React.FC<ColorScaleLegendProps> = (
    {
      width = 800,
      height = 50,
      domain,
      colorScheme,
    }: ColorScaleLegendProps) => {
  const margin = {left: 20, right: 20};
  const scaleHeight = 30;
  const myColor = useMemo(() => d3.scaleSequential(colorScheme)
      .domain(domain),
      [colorScheme, domain]);

  const xLabels = useMemo(() => {
    const inc = (domain[1] - domain[0]) / (width);
    const ret = [];
    for (let label = domain[0]; label < domain[1]; label += inc) {
      ret.push(label.toFixed(2));
    }
    return ret;
  }, [width, domain]);

  const xScale = useMemo(
      () => d3.scaleBand()
          .range([0, width ])
          // @ts-ignore
          .domain(xLabels)
          .padding(0.01),
      [width, xLabels]
  );

  const renderGrids = useMemo(() => {
    return (<>
      {xLabels.map((label, index) => {
        const style = {'fill': `${myColor(label)}`};
        return (
            <rect key={`${label},${index}`}
                  width={xScale.bandwidth()}
                  height={scaleHeight}
                // @ts-ignore
                  x={xScale(label)}
                  y={0}
                  style={style}/>
        )
      })}
    </>)

  }, [width, colorScheme]);


  return (
      <svg width={width + margin.left + margin.right } height={height}>
        <g transform={`translate(${margin.left}, 0)`}>
          {renderGrids}
        </g>
        <Axis x={margin.left} y={scaleHeight} scale={xScale} type="Bottom"
              totalPoints={10}/>
      </svg>
  );
};

export default ColorScaleLegend;

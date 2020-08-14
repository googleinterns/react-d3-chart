// Axis Component
/**
 * Component to render an Axis for a graph
 * @packageDocumentation
 */
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Text } from './styles';

export interface AxisProps {
  /** Scale to be used for the axis */
  scale: d3.ScaleLinear<number, number>;
  /** Position to render the Axis */
  type: 'Top' | 'Right' | 'Bottom' | 'Left';
  /** Axis x offset from the left side of the graph */
  x: number;
  /** Axis y offset form the bottom of the graph */
  y: number;
  /** Axis label */
  label?: string;
}

/** Axis Component */
export const Axis: React.FC<AxisProps> = ({ x, y, label, scale, type }) => {
  const gRef = useRef<SVGGElement>();

  const d3Render = () => {
    switch (type) {
      case 'Top':
        d3.select(gRef.current).call(d3.axisTop(scale));
        break;
      case 'Right':
        d3.select(gRef.current).call(d3.axisRight(scale));
        break;
      case 'Bottom':
        d3.select(gRef.current).call(d3.axisBottom(scale));
        break;
      case 'Left':
        d3.select(gRef.current).call(d3.axisLeft(scale));
        break;
    }
  };

  const labelPos = () => {
    switch (type) {
      case 'Top':
        return { x: scale.range()[1] + 20, y: 0 };
      case 'Right':
        return { x: 20, y: 0 };
      case 'Bottom':
        return { x: scale.range()[1] + 25, y: 25 };
      case 'Left':
        return { x: -25, y: 0 };
    }
  };

  d3Render();

  useEffect(() => {
    d3Render();
  }, []);
  return (
    <g ref={gRef} transform={`translate(${x}, ${y})`}>
      <Text {...labelPos}>{label}</Text>
    </g>
  );
};

export default Axis;

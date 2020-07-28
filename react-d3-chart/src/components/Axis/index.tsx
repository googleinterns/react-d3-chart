import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Text } from './styles';

export interface AxisProps {
  scale: d3.ScaleLinear<number, number>;
  type: 'Top' | 'Right' | 'Bottom' | 'Left';
  x: number;
  y: number;
  label?: string;
}

const Axis: React.FC<AxisProps> = ({ x, y, label, scale, type }) => {
  const gRef = useRef<SVGGElement>();

  const d3Render = () => {
    d3.select(gRef.current).call(d3[`axis${type}`](scale));
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

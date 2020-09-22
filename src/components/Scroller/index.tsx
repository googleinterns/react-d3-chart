// Scroller Component
/**
 * Component to render an scroller for axises
 * @packageDocumentation
 */
import * as d3 from 'd3';
import {Margin} from '../../types';
import React, {useEffect, useRef, useState} from 'react';
import Axis from '../Axis';

interface State {
  brushRef: SVGGElement;
  brushState: { brush: d3.BrushBehavior<unknown> };
}

interface ScrollerProps {
  margin: Margin;
  width: number;
  height: number;
  scale: d3.ScaleLinear<number, number>;
  position: 'Bottom' | 'Left';
  showAxis: boolean;
  onBrush?: (newDomain: Array<number>) => void;
  labelAxis?: d3.ScaleBand<any>;
}

export const Scroller: React.FC<ScrollerProps> = (
    {
      margin,
      width, height,
      scale,
      position,
      onBrush,
      showAxis = true,
      labelAxis,
    }: ScrollerProps
) => {
  const brushRef = useRef<State['brushRef']>();
  const [brushState, setBrushState] = useState<State['brushState']>({
    brush: null,
  });
  const {brush} = brushState;
  const brushEventID = `brush0`;

  const brushed = () => {
    if (!d3.event.sourceEvent || d3.event.sourceEvent.type === 'zoom') {
      return;
    }
    const s = d3.event.selection || scale.range();

    let newGraphDomain = s.map(scale.invert, scale);
    if(position === 'Left') {
      const oldDomain = scale.domain();
      const [L, R] = oldDomain;
      newGraphDomain = [L + R - newGraphDomain[1], R - L - newGraphDomain[0]]; // invert the domain
    }
    newGraphDomain = [Math.floor(newGraphDomain[0]), Math.ceil(newGraphDomain[1])];

    if (onBrush) {
      onBrush(newGraphDomain);
    }
  };

  useEffect(() => {
    if (brushRef.current) {
      const brushContainer = d3.select(brushRef.current);
      let brush : d3.BrushBehavior<any>;
      if (position === 'Left') {
        brush = d3.brushY().extent([
          [0, 0],
          [width, height],
        ])
      } else {
        brush = d3.brushX().extent([
          [0, 0],
          [width, height],
        ]);
      }
      brush.on('brush end', brushed);
      brushContainer.call(brush);
      brushContainer.call(brush.move, scale.range());
      setBrushState({brush});
      return () => {
        brush.on('brush end', null);
      };
    }
  }, [brushRef, brushEventID, scale]);

  useEffect(() => {
    if (brushRef.current && brush) {
      const brushContainer = d3.select(brushRef.current);
      brush.on('brush end', brushed);
    }
  }, [brushRef.current, brush]);

  let xPos = 0;
  let yPos = height;

  if (position === 'Left') {
    yPos = 0;
  }

  return (<g
      transform={`translate(${margin.left}, ${margin.top})`}
      ref={brushRef}
      width={width}
      height={height}
  >
    {labelAxis && <Axis x={xPos} y={yPos} scale={labelAxis} type={position}/>}
    {showAxis && <Axis x={xPos} y={yPos} scale={scale} type={position}/>}
  </g>)
};

export default Scroller;
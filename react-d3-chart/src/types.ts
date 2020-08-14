export type LineProps = Array<Coordinate>;
export type ModeTypes = 'selection' | 'intersection';

export interface Dimensions {
  width: number;
  height: number;
  margin: Margin;
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface TooltipState {
  xOffset: number;
  xScaled: number;
  enabled: boolean;
}

export interface RangeSelectionState {
  selection: [number, number];
  eventSource: string;
}

export interface DomainState {
  selectedDomain: [number, number];
  eventSource: string;
}

export interface Scales {
  xScale: d3.ScaleLinear<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  xScaleContext: d3.ScaleLinear<number, number>;
  yScaleContext: d3.ScaleLinear<number, number>;
}

export interface CommonProps {
  color: d3.ScaleOrdinal<string, string>;
  tooltipEntryHeight: number;
  graphIndex: number;
  graphWidth: number;
  maxPoints: number;
  data: Array<LineProps>;
}

export interface Domains {
  xDomain: [number, number];
  yDomain: [number, number];
}

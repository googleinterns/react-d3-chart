// types.ts
/**
 * This file contains common types shared between multiple components
 * @packageDocumentation
 */

/** Data points for each line in the line chart*/
export type LineProps = Array<Coordinate>;

/**
 * Available modes for the cursor for each graph.
 *  - Selection: Allows the user to brush a subdomain of the graph
 *  - Intersection: Attempts to intersect every line and display the
 * representative y value based on the current x position of the mouse
 */
export type ModeTypes = 'selection'|'intersection';

/**
 * Range Selection, an array of two numbers indicating the start and end index
 */
export type TRangeSelection = [number, number];

export interface ModeTypeStateManagement {
  /** Current selected cursor mode */
  mode: ModeTypes;
  /** Callback function to select current cursor mode */
  selectMode: (mode: ModeTypes) => void;
}

export interface Dimensions {
  /** Width of the component in pixels */
  width: number;
  /**Height of the component in pixels */
  height: number;
  /** Margin around the component in pixels*/
  margin: Margin;
}

export interface Coordinate {
  /** x value of a coordinate data point */
  x: number;
  /** y value of a coordinate data point */
  y: number;
}

export interface Margin {
  /** Top margin of component in pixels */
  top: number;
  /** Right margin of component in pixels */
  right: number;
  /** Bottom margin of component in pixels */
  bottom: number;
  /** Left margin of component in pixels */
  left: number;
}

export interface TooltipState {
  /** Cursor tooltip x offset from the left side of the chart in pixels */
  xOffset: number;
  /**
   * Scaled x value of the cursor to represent current x position of the domain
   * that the cursor is hovering over
   */
  xScaled: number;
  /** Is the tooltip enabled? */
  enabled: boolean;
}

export interface TooltipStateManagement {
  /** Current tooltipState */
  tooltipState: TooltipState;
  /** Set Current tooltipState */
  setTooltipState: (tooltipState: TooltipState) => void;
}

export interface RangeSelectionState {
  /** Current x range selected of a graph's domain */
  selection: [number, number];
  /**
   * Used in stacked mode to determine source of the change in selection
   * to prevent recursive updates to the current selection
   */
  eventSource: string;
}

export interface RangeSelectionStateManagement {
  rangeSelectionState: RangeSelectionState;
  setRangeSelectionState: (rangeSelectionState: RangeSelectionState) => void;
}

export interface DomainState {
  /** Currently selected domain visible for all graphs under this component */
  selectedDomain: [number, number];
  /**
   * Used in stacked mode to determine source of the change in graph domain
   * to prevent recursive updates to the currently selected graph domain
   */
  eventSource: string;
}

export interface DomainStateManagement {
  /** Current selected domain state */
  domainState: DomainState;
  /** Callback to set the selected domain state */
  setDomainState: (domainState: DomainState) => void;
}

export interface Scales {
  /** Primary x axis scale of the parent graph component */
  xScale: d3.ScaleLinear<number, number>;
  /** Primary y axis scale of the parent graph component*/
  yScale: d3.ScaleLinear<number, number>;
  /** X axis scale of the context under the graph component */
  xScaleContext: d3.ScaleLinear<number, number>;
  /** Y axis scale of the context under the graph component */
  yScaleContext: d3.ScaleLinear<number, number>;
}

export interface CommonProps {
  /** D3 color scale defaulted to d3.scaleOrdinal(d3.schemeCategory10); */
  color: d3.ScaleOrdinal<string, string>;
  /** Height in pixels of each cursor tooltip entry */
  tooltipEntryHeight: number;
  /** Width of cursor tooltip in pixels */
  tooltipWidth: number;
  /** Index of graph used in stacked mode */
  graphIndex: number;
  /** Width of the parent graph component in pixels */
  graphWidth: number;
  /** Height of the parent graph component in pixels */
  graphHeight: number;
  /**
   * Maximum number of points that can be rendered per line in the each graph
   */
  maxPoints: number;
  /** Original data points to be rendered in the graph */
  data: Array<LineProps>;
  /** Height of the context in pixels */
  contextHeight?: number;
}

export interface Domains {
  /**
   * Specified maximum x domain of all graphs under the parent component
   * - xDomain[0] is the lower x bound
   * - xDomain[1] is the upper x bound
   */
  xDomain: [number, number];
  /**
   * Specified maximum y domain of all graphs under the parent component
   * - yDomain[0] is the lower y bound
   * - yDomain[1] is the upper y bound
   */
  yDomain: [number, number];
}
